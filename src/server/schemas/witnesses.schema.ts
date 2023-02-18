import z from "./../../utils/my-zod";
import { name, rg, rgEmitter, cpf, primaryPhone, secondaryPhone, email } from "./base.schemas";

export const witnessSchema = z.object({
  name,
  rg,
  rgEmitter,
  cpf,
  primaryPhone,
  secondaryPhone,
  email,
});

export const formWitnessSchema = witnessSchema
  .extend({ id: z.string().cuid().optional() });

export type FormWitnessSchema = z.TypeOf<typeof formWitnessSchema>;
export type WitnessSchema = z.TypeOf<typeof witnessSchema>;
