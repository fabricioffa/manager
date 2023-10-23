import { createPixKeysSchema } from './pixKeys.schemas';
import { MaritalStatus, Prisma } from '@prisma/client';
import z from './../../utils/my-zod';
import { ppNullifyEmptyStr } from '../../utils/function/prod';

import {
  secondaryPhone,
  name,
  rg,
  rgEmitter,
  cpf,
  primaryPhone,
  email,
} from './base.schemas';

export const createTenantSchema = z.object({
  name,
  rg,
  rgEmitter,
  cpf,
  maritalStatus: z.nativeEnum(MaritalStatus).default('solteiro'),
  profession: z.string().trim().min(1).max(100),
  primaryPhone,
  hasWpp: z.coerce.boolean().optional().default(false),
  secondaryPhone,
  email,
  pixKeys: z.array(createPixKeysSchema).nullish(),
  obs: z.preprocess(ppNullifyEmptyStr, z.string().trim().max(2000).nullish()),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { id, updatedAt, createdAt, maritalStatus, ...rest } =
  Prisma.TenantScalarFieldEnum;
export const tenantSearchablePropertiesEnum = rest;

export type CreateTenant = z.TypeOf<typeof createTenantSchema>;
