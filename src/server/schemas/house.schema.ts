import { HouseType } from '@prisma/client';
import z from './../../utils/my-zod';
import { city, waterId, electricityId } from './base.schemas';

export const createHouseSchema = z.object({
  number: z.string().trim().min(1).max(20),
  street: z.string().trim().min(1).max(191),
  complement: z.string().trim().min(1).max(191),
  neighborhood: z.string().trim().min(3).max(100),
  city,
  iptu: z.string().trim().min(5).max(20),
  type: z.nativeEnum(HouseType),
  waterId,
  electricityId,
  description: z.string().trim().max(4000).nullish(),
});

export type CreateHouseSchema = z.TypeOf<typeof createHouseSchema>;
