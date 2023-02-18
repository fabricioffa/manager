import { Prisma } from "@prisma/client";
import z from "./../../utils/my-zod";
import { formWitnessSchema, witnessSchema } from "./witnesses.schema";
import { electricityId, waterId } from "./base.schemas";

const limits = {
  fiftyYearsBefore: new Date(new Date().getFullYear() - 5, 0, 1),
  fiftyYearsAfter: new Date(new Date().getFullYear() + 5, 0, 1),
};

export const contractsSchema = z.object({
  dueDay: z.number({ coerce: true }).positive().max(31),
  initialDate: z.date().min(limits.fiftyYearsBefore).max(limits.fiftyYearsAfter),
  rent: z.number({ coerce: true }).positive().max(99_999),
  bail: z.number({ coerce: true }).positive().max(99_999),
  duration: z.number({ coerce: true }).positive().max(100).default(12),
  interest: z.number({ coerce: true }).positive().max(100).default(1),
  arrears: z.number({ coerce: true }).positive().max(100).default(10),
  waterId: waterId.nullish(),
  electricityId: electricityId.nullish(),
  tenantId: z.string().cuid(),
  houseId: z.string().cuid(),
  witnesses: z.array(formWitnessSchema),
});

export const createContractsSchema = contractsSchema
  .omit({ witnesses: true })
  .extend({ witnesses: z.array(witnessSchema) })

export const contractsSearchOptionsSchema = z.object({
  property: z.nativeEnum({ ...Prisma.ContractScalarFieldEnum, all: 'all' } as const),
  caseSensitive: z.boolean().default(false),
  query: z.string(),
})

export type ContractSearchOptions = z.TypeOf<typeof contractsSearchOptionsSchema>;
export type CreateContractsSchema = z.TypeOf<typeof createContractsSchema>;
export type ContractsSchema = z.TypeOf<typeof contractsSchema>;

