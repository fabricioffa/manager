import { KeyType } from "@prisma/client";
import z from "./../../utils/my-zod";
import { returnIssueToPath } from "../../utils/zodHelpers";
import { ppUndefineEmptyStr } from "../../utils/function/prod";
import { cnpj, cpf, mobile, requiredEmail } from "./base.schemas";

export const createPixKeysSchema = z
  .object({
    id: z.preprocess(ppUndefineEmptyStr, z.string().cuid().optional()),
    keyType: z.nativeEnum(KeyType),
    key: z.string().trim(),
  })
  .superRefine(({ key, keyType }, ctx) => {
    if (keyType === "email")
      returnIssueToPath(requiredEmail.safeParse(key), ctx, "key");

    if (keyType === "celular")
      returnIssueToPath(mobile.safeParse(key), ctx, "key");

    if (keyType === "cpf") returnIssueToPath(cpf.safeParse(key), ctx, "key");

    if (keyType === "cnpj") returnIssueToPath(cnpj.safeParse(key), ctx, "key");

    if (keyType === "aleatoria")
      returnIssueToPath(
        z.string().trim().length(32).safeParse(key),
        ctx,
        "key"
      );
  });

export type CreatePixKeysSchema = z.TypeOf<typeof createPixKeysSchema>;
