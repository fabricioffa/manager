import z from "zod";
import { CpfValidator } from "../../utils/zodHelpers";
import { createTenantSchema } from "./tenant.schema";

const limits = {
    fiveYearsBefore: new Date(new Date().getFullYear() - 5, 0, 1),
    fiveYearsAfter: new Date(new Date().getFullYear() + 5, 0, 1),
};



export const receiptSchema = z.object({
    amount: z.preprocess((val) => Number(val), z.number().positive().max(99_999.99)),
    rentingPeriod: z.date().min(limits.fiveYearsBefore).max(limits.fiveYearsAfter),
    tenant: createTenantSchema.pick({name: true, cpf: true}),
    house: z.object({
        number:  z.string().trim().min(1).max(20),
        street: z.string().trim().min(1).max(191),
    }),
    city: z.string().trim().min(1).max(50),
    date: z.date().min(limits.fiveYearsBefore).max(limits.fiveYearsAfter),
});

export type ReceiptSchema = z.TypeOf<typeof receiptSchema>;

