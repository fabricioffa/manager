import z from "zod";
import { getFirstAndLastDayOfCurrentMonth } from "../../utils/function/prod";

const { firstDay, lastDay } = getFirstAndLastDayOfCurrentMonth()

export const debitSchema = z.object({
  amount: z.preprocess((val) => Number(val), z.number().positive().max(99_999.99)),
  dueDate: z.date().min(firstDay).max(lastDay),
  paidAt: z.date(),
  contractId: z.string().cuid()
});

export type DebitSchema = z.TypeOf<typeof debitSchema>;

