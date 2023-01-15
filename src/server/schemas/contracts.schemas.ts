import { Prisma } from "@prisma/client";
import z from "zod";
import { formWitnessSchema, witnessSchema } from "./witnesses.schema";

const limits = {
  fiftyYearsBefore: new Date(new Date().getFullYear() - 5, 0, 1),
  fiftyYearsAfter: new Date(new Date().getFullYear() + 5, 0, 1),
};
const last10Years = new Date(new Date().getFullYear() - 10, 0, 1)

export const contractsSchema = z.object({
  dueDay: z.preprocess((val) => Number(val), z.number().positive().max(31)),
  initialDate: z.date().min(limits.fiftyYearsBefore).max(limits.fiftyYearsAfter),
  rent: z.preprocess((val) => Number(val), z.number().positive().max(99999)),
  bail: z.preprocess((val) => Number(val), z.number().positive().max(99999)),
  duration: z.preprocess((val) => Number(val), z.number().positive().max(100).default(12)),
  interest: z.preprocess((val) => Number(val), z.number().positive().max(100).default(1)),
  arrears: z.preprocess((val) => Number(val), z.number().positive().max(100).default(10)),
  waterId: z.string().trim().nullish().or(z.literal("")),
  electricityId: z.string().trim().nullish().or(z.literal("")),
  tenantId: z.string().cuid(),
  houseId: z.string().cuid(),
  witnesses: z.array(formWitnessSchema),
});

export const createContractsSchema = contractsSchema
  .omit({ witnesses: true })
  .augment({ witnesses: z.array(witnessSchema) })



export const contractsSearchOptionsSchema = z.object({
  property: z.nativeEnum({ ...Prisma.ContractScalarFieldEnum, all: 'all' } as const),
  caseSensitive: z.boolean().default(false),
  query: z.string(),
})

export type ContractSearchOptions = z.TypeOf<typeof contractsSearchOptionsSchema>;
export type CreateContractsSchema = z.TypeOf<typeof createContractsSchema>;
export type ContractsSchema = z.TypeOf<typeof contractsSchema>;

