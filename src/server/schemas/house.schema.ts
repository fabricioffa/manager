import { HouseType, Prisma } from "@prisma/client";
import z from "zod";

export const createHouseSchema = z.object({
  number:  z.string().trim().min(1),
  street: z.string().trim().min(1),
  complement: z.string().trim().min(1),
  neighborhood: z.string().trim().min(1),
  city: z.string().trim().min(1),
  iptu: z.string().trim().min(10),
  type: z.nativeEnum(HouseType),
  waterId: z.string().trim().min(1),
  electricityId: z.string().trim().min(1),
  description: z.string().trim().max(4000).nullish().transform(val => val === '' ? null : val)
});

export const housesSearchOptionsSchema = z.object({
  property: z.nativeEnum({ ...Prisma.HouseScalarFieldEnum, all: 'all' } as const),
  caseSensitive: z.boolean().default(false),
  query: z.string(),
})

export type HousesSearchOptions = z.TypeOf<typeof housesSearchOptionsSchema>;
export type CreateHouseSchema = z.TypeOf<typeof createHouseSchema>;

