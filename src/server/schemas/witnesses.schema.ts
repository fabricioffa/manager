import z from "./../../utils/my-zod";
import { stripOfNonNumeric } from "../../utils/function/prod";
import { CpfValidator, isValidMobileRefiner } from "../../utils/zodHelpers";

export const witnessSchema = z.object({
  name: z.string().trim().min(1).max(191),
  rg: z.preprocess(stripOfNonNumeric, z.string().trim().min(5).max(15)),
  rgEmitter: z.string().trim().min(2).max(10).default("SSP/CE"),
  cpf: z.preprocess(stripOfNonNumeric, z.string().trim().length(11).superRefine((val, ctx) => {
    const result = new CpfValidator(val).isCpfValid()
    if (!result.isCPF) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.message,
      });
    }
  })
  ),
  primaryPhone: z.preprocess(stripOfNonNumeric, z.string().trim().min(10).max(11).refine(...isValidMobileRefiner)),
  secondaryPhone: z.preprocess(stripOfNonNumeric, z.string().trim().min(10).max(11).nullish()).or(z.literal("")),
  email: z.string().trim().email().min(5).max(191).nullish().or(z.literal("")),
});

export const formWitnessSchema = witnessSchema
  .augment({ id: z.string().cuid().optional() });

export type FormWitnessSchema = z.TypeOf<typeof formWitnessSchema>;
export type WitnessSchema = z.TypeOf<typeof witnessSchema>;
