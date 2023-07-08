import { isMaritalStatus } from "./../../utils/function/prod";
import { createPixKeysSchema } from "./pixKeys.schemas";
import { MaritalStatus, Prisma } from "@prisma/client";
import z from "./../../utils/my-zod";
import { ppNullifyEmptyStr } from "../../utils/function/prod";

import {
  secondaryPhone,
  name,
  rg,
  rgEmitter,
  cpf,
  primaryPhone,
  email,
  baseSearchOptionsSchema,
} from "./base.schemas";

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
  obs: z.preprocess(ppNullifyEmptyStr, z.string().trim().max(2000).nullish()),
});

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { id, updatedAt, createdAt, maritalStatus, ...rest } =
  Prisma.TenantScalarFieldEnum;
export const tenantSearchablePropertiesEnum = rest;

export const tenantsSearchOptionsSchema = baseSearchOptionsSchema(
  Prisma.TenantScalarFieldEnum
);
export type CreateTenant = z.TypeOf<typeof createTenantSchema>;
export type TenantsSearchOptions = z.TypeOf<typeof tenantsSearchOptionsSchema>;

export const buildTenantWhereObj = ({
  property,
  query,
}: TenantsSearchOptions) => {
  const where: Prisma.TenantWhereInput = {
    OR: [],
  };

  if (isMaritalStatus(query))
    Array.isArray(where.OR) &&
      where.OR.push({ maritalStatus: { equals: query } });
  if (property === "all")
    Object.values(tenantSearchablePropertiesEnum).forEach((ppt) => {
      Array.isArray(where.OR) && where.OR.push({ [ppt]: { contains: query } });
    });

  return where;
};
