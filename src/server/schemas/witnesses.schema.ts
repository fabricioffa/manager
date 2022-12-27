import z from "zod";

export const witnessSchema = z.object({
  name: z.string().trim().min(1),
  rg: z.string().trim().min(1),
  rgEmitter: z.string().trim().min(1).default("SSP/CE"),
  cpf: z.string().trim().length(11),
  primaryPhone: z.string().trim().min(1),
  secondaryPhone: z.string().trim().nullish().or(z.literal("")),
  email: z.string().trim().email().nullish().or(z.literal("")),
});

export const formWitnessSchema = witnessSchema
  .augment({ id: z.string().cuid().optional() });

export type FormWitnessSchema = z.TypeOf<typeof formWitnessSchema>;
export type WitnessSchema = z.TypeOf<typeof witnessSchema>;
