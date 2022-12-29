import { Prisma } from "@prisma/client";
import z from "zod";
import { formWitnessSchema, witnessSchema } from "./witnesses.schema";

const limits = {
  fiftyYearsBefore: new Date(new Date().getFullYear() - 5, 0, 1),
  fiftyYearsAfter: new Date(new Date().getFullYear() + 5, 0, 1),
};

export const contractsSchema = z.object({
  dueDay: z.preprocess((val) => Number(val), z.number().positive().max(31)),
  initialDate: z.date().min(limits.fiftyYearsBefore).max(limits.fiftyYearsAfter),
  endingDate: z.date().min(limits.fiftyYearsBefore).max(limits.fiftyYearsAfter).nullish(),
  rent: z.preprocess((val) => Number(val), z.number().positive().max(99999)),
  bail: z.preprocess((val) => Number(val), z.number().positive().max(99999)),
  duration: z.preprocess((val) => Number(val),z.number().positive().max(100).default(12)),
  interest: z.preprocess((val) => Number(val),z.number().positive().max(100).default(1)),
  arrears: z.preprocess((val) => Number(val),z.number().positive().max(100).default(10)),
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

const contractWithRelations = Prisma.validator<Prisma.ContractArgs>()({
  include: {
    tenant: {
      select: {
        id: true,
        name: true,
      },
    },
    house: {
      select: {
        id: true,
        street: true,
        number: true,
      },
    },
  },
});

const contractWithAllRelations = Prisma.validator<Prisma.ContractArgs>()({
  include: {
    tenant: {
      select: {
        id: true,
        name: true,
      },
    },
    house: {
      select: {
        id: true,
        street: true,
        number: true,
      },
    },
    witnesses: true,
  },
});

export type ContractWithRelations = Prisma.ContractGetPayload<
  typeof contractWithRelations
>;
export type ContractWithAllRelations = Prisma.ContractGetPayload<
  typeof contractWithAllRelations
>;

export type CreateContractsSchema = z.TypeOf<typeof createContractsSchema>;
export type ContractsSchema = z.TypeOf<typeof contractsSchema>;

