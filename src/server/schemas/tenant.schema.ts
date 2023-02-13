import { CpfValidator, isValidMobileRefiner } from './../../utils/zodHelpers';
import { createPixKeysSchema } from './pixKeys.schemas';
import { MaritalStatus, Prisma } from "@prisma/client";
import z from "./../../utils/my-zod";
import { cleanValIfString } from '../../utils/function/prod';

export const createTenantSchema = z.object({
  name: z.string().trim().min(1),
  rg: z.preprocess(cleanValIfString, z.string().trim().min(5).max(15)),
  rgEmitter: z.string().trim().min(2).max(10).default("SSP/CE"),
  cpf: z.preprocess(cleanValIfString, z.string().trim().length(11).superRefine((val, ctx) => {
    const result = new CpfValidator(val).isCpfValid()
    if (!result.isCPF) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: result.message,
      });
    }
  })
  ),
  maritalStatus: z.nativeEnum(MaritalStatus).default("solteiro"),
  profession: z.string().trim().min(1).max(100),
  primaryPhone: z.preprocess(cleanValIfString, z.string().trim().min(10).max(11).refine(...isValidMobileRefiner)),
  secondaryPhone: z.preprocess(cleanValIfString, z.string().trim().min(10).max(11).nullish()).or(z.literal("")),
  email: z.string().trim().email().min(5).max(191).nullish().or(z.literal("")),
  pixKeys: z.array(createPixKeysSchema).nullish(),
  obs: z.string().trim().max(2000).nullish().or(z.literal("")),
});

export const tenantsSearchOptionsSchema = z.object({
  property: z.nativeEnum({ ...Prisma.TenantScalarFieldEnum, all: 'all' } as const),
  caseSensitive: z.boolean().default(false),
  query: z.string(),
})

export type CreateTenant = z.TypeOf<typeof createTenantSchema>;
export type TenantsSearchOptions = z.TypeOf<typeof tenantsSearchOptionsSchema>;
