import { createPixKeysSchema } from './pixKeys.schemas';
import { MaritalStatus, Prisma } from "@prisma/client";
import z from "./../../utils/my-zod";
import { nullifyEmptyStr } from '../../utils/function/prod';

import { secondaryPhone, name, rg, rgEmitter, cpf, primaryPhone, email } from './base.schemas';

export const createTenantSchema = z.object({
  name,
  rg,
  rgEmitter,
  cpf,
  maritalStatus: z.nativeEnum(MaritalStatus).default("solteiro"),
  profession: z.string().trim().min(1).max(100),
  primaryPhone,
  secondaryPhone,
  email,
  pixKeys: z.array(createPixKeysSchema).nullish(),
  obs: z.preprocess(nullifyEmptyStr, z.string().trim().max(2000).nullish()),
});

export const tenantsSearchOptionsSchema = z.object({
  property: z.nativeEnum({ ...Prisma.TenantScalarFieldEnum, all: 'all' } as const),
  caseSensitive: z.boolean().default(false),
  query: z.string(),
})

export type CreateTenant = z.TypeOf<typeof createTenantSchema>;
export type TenantsSearchOptions = z.TypeOf<typeof tenantsSearchOptionsSchema>;
