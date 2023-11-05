import z from 'zod';
import { createTenantSchema } from './tenant.schema';
import { createHouseSchema } from './house.schema';
import { city, amount } from './base.schemas';

export const receiptSchema = z.object({
  amount,
  rentingPeriod: z.preprocess(val => typeof val === 'string' ? new Date(val + '-2') : null, z.date()),
  tenant: createTenantSchema.pick({ name: true, cpf: true }),
  house: createHouseSchema.pick({ number: true, street: true }),
  city,
  date: z.date(),
});

export type ReceiptSchema = z.TypeOf<typeof receiptSchema>;
