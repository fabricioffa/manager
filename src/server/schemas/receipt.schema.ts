import z from "zod";
import { CpfValidator } from "../../utils/zodHelpers";

const limits = {
    fiveYearsBefore: new Date(new Date().getFullYear() - 5, 0, 1),
    fiveYearsAfter: new Date(new Date().getFullYear() + 5, 0, 1),
  };

export const receiptSchema = z.object({
    amount: z.preprocess((val) => Number(val), z.number().positive().max(99_999.99)),
    rentingPeriod: z.date().min(limits.fiveYearsBefore).max(limits.fiveYearsAfter),
    tenant: z.object({
        name: z.string().trim().min(1).max(191),
        cpf: z.string().trim().length(11).superRefine((val, ctx) => {
            const result = new CpfValidator(val).isCpfValid()
            if (!result.isCPF) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: result.message,
              });
            }
          }),
    }),
    house: z.object({
        number:  z.string().trim().min(1).max(20),
        street: z.string().trim().min(1).max(191),
    }),
    city: z.string().trim().min(1).max(50),
    date: z.date().min(limits.fiveYearsBefore).max(limits.fiveYearsAfter),
});

export type ReceiptSchema = z.TypeOf<typeof receiptSchema>;

