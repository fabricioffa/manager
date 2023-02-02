import { KeyType } from "@prisma/client";
import z from "zod";
import { CnpjValidator , CpfValidator } from "../../utils/zodHelpers";

export const createPixKeysSchema = z.object({
  id: z.string().cuid().or(z.literal('')),
  keyType: z.nativeEnum(KeyType),
  key: z.string().trim(),
})
  .superRefine(({ key, keyType }, ctx) => {
    if (keyType === 'email') {
      const {success} = z.string().email().safeParse(key)
      !success && ctx.addIssue({
        code: z.ZodIssueCode.invalid_string,
        validation: "email",
        message: 'Formato de email inválido',
        path: ['key'],
        fatal: true
      })
      return z.NEVER
    }

    if (keyType === 'celular' && key.length !== 12) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        maximum: 12,
        type: "string",
        inclusive: true,
        message: `O celular deve ter 12 dígitos, mas tem ${key.length}.`,
        path: ['key'],
        fatal: true
      })
      return z.NEVER
    }

    if (keyType === 'cpf') {
      const result = new CpfValidator(key).isCpfValid()
      if (!result.isCPF) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.message,
          path: ['key'],
          fatal: true
        });
        return z.NEVER
      }
    }

    if (keyType === 'cnpj') {
      const result = new CnpjValidator(key).isCnpjValid();
      if (!result.isCNPJ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: result.message,
          path: ['key'],
          fatal: true
        });
        return z.NEVER
      }
  }
    if (keyType === 'aleatoria' && key.length !== 32)
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `A chave aleatória deve ter 32 dígitos, mas tem ${key.length}`,
        path: ['key'],
      })
})

export type CreatePixKeysSchema = z.TypeOf<typeof createPixKeysSchema>;
