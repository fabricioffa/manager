import { CpfValidator } from './../../utils/zodHelpers';
import { createPixKeysSchema } from './pixKeys.schemas';
import { MaritalStatus, Prisma } from "@prisma/client";
import z from "zod";

export const createTenantSchema = z.object({
  name: z.string().trim().min(1),
  rg: z.string().trim().min(1),
  rgEmitter: z.string().trim().min(1).default("SSP/CE"),
  cpf: z.string().trim().length(11).superRefine((val, ctx) => {
    const result = new CpfValidator().isCpfValid(val)
    if (!result.isCPF) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.message,
      });
    }
  }),
  maritalStatus: z.nativeEnum(MaritalStatus).default("solteiro"),
  profession: z.string().trim().min(1),
  primaryPhone: z.string().trim().min(1),
  secondaryPhone: z.string().trim().nullish().or(z.literal("")),
  email: z.string().trim().email().nullish().or(z.literal("")),
  pixKeys: z.array(createPixKeysSchema).nullish(),
  obs: z.string().trim().nullish().or(z.literal("")),
});

export const tenantsSearchOptionsSchema = z.object({
  property: z.nativeEnum({ ...Prisma.TenantScalarFieldEnum, all: 'all' } as const),
  caseSensitive: z.boolean().default(false),
  query: z.string(),
})

const tenantWithPixKeys = Prisma.validator<Prisma.TenantArgs>()({
  include: {
    pixKeys: {
      select: {
        id: true,
        key: true,
        keyType: true
      }
    }
  },
})

export type TenantWithPixKeys = Prisma.TenantGetPayload<typeof tenantWithPixKeys>

export type CreateTenant = z.TypeOf<typeof createTenantSchema>;
export type TenantsSearchOptions = z.TypeOf<typeof tenantsSearchOptionsSchema>;
