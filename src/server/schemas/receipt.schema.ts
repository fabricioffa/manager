import z from "zod";
import { createTenantSchema } from "./tenant.schema";
import { createHouseSchema } from "./house.schema";
import { city, amount } from "./base.schemas";

const limits = {
    fiveYearsBefore: new Date(new Date().getFullYear() - 5, 0, 1),
    fiveYearsAfter: new Date(new Date().getFullYear() + 5, 0, 1),
};

export const receiptSchema = z.object({
    amount,
    rentingPeriod: z.date().min(limits.fiveYearsBefore).max(limits.fiveYearsAfter),
    tenant: createTenantSchema.pick({name: true, cpf: true}),
    house: createHouseSchema.pick({number: true, street: true}),
    city,
    date: z.date().min(limits.fiveYearsBefore).max(limits.fiveYearsAfter),
});

export type ReceiptSchema = z.TypeOf<typeof receiptSchema>;

