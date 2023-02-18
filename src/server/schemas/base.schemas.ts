import { Prisma } from "@prisma/client";
import { nullifyEmptyStr, stripOfNonNumeric, stripOfNonNumericOrNullifyEmptyStr } from "../../utils/function/prod";
import { CnpjValidator, CpfValidator, isRepetitionRefiner, isValidMobileRefiner } from "../../utils/zodHelpers";
import z from "./../../utils/my-zod";

export const name = z.string().trim().min(1);
export const rg = z.preprocess(stripOfNonNumeric, z.string().trim().min(5).max(15));
export const rgEmitter = z.string().trim().min(2).max(10).default("SSP/CE");
export const mobile = z.preprocess(stripOfNonNumeric, z.string().trim().length(11).refine(...isValidMobileRefiner));
export const primaryPhone = z.preprocess(stripOfNonNumeric, z.string().trim().min(10).max(11).refine(...isValidMobileRefiner));
export const secondaryPhone = z.preprocess(stripOfNonNumericOrNullifyEmptyStr, z.string().trim().min(10).max(11).nullish());
export const requiredEmail = z.string().trim().email().min(5).max(191);
export const email = z.preprocess(nullifyEmptyStr, requiredEmail.nullish());
export const city = z.string().trim().min(3).max(100);
export const amount = z.number({ coerce: true }).positive().max(99_999.99);
export const waterId = z.string().trim().min(1).max(50);
export const electricityId = z.string().trim().min(1).max(50);
export const cpf = z.preprocess(stripOfNonNumeric, z.string().trim().length(11).refine(...isRepetitionRefiner)).superRefine((val, ctx) => {
  const result = new CpfValidator(val).isCpfValid()
  if (!result.isCPF) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: result.message,
    });
  }
});
export const cnpj = z.preprocess(stripOfNonNumeric, z.string().length(14).refine(...isRepetitionRefiner)).superRefine(
  (val, ctx) => {
    const result = new CnpjValidator(val).isCnpjValid()
    if (!result.isCNPJ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.message,
      });
    }
  }
);

export const baseSearchOptionsSchema = (anyEnum: z.EnumLike) => z.object({
  property: z.nativeEnum({ ...anyEnum, all: 'all' } as const),
  caseSensitive: z.boolean().default(false),
  query: z.string(),
})
