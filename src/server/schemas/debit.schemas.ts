import z from 'zod';
import { getFirstAndLastDayOfCurrentMonth } from '../../utils/function/prod';
import { DebitType } from '@prisma/client';
import { amount } from './base.schemas';

const { firstDay, lastDay } = getFirstAndLastDayOfCurrentMonth();

export const debitSchema = z.object({
  amount,
  dueDate: z.date().min(firstDay).max(lastDay),
  type: z.nativeEnum(DebitType).default('rent'),
  paidAt: z.date(), // TODO:
  contractId: z.string().cuid(), // TODO:
});

export type DebitSchema = z.TypeOf<typeof debitSchema>;
