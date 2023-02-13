import { KeyType } from "@prisma/client";
import z from "./../../utils/my-zod";
import { CnpjValidator, CpfValidator, isRepetitionRefiner, isValidMobileRefiner } from "../../utils/zodHelpers";
import { cleanValIfString } from "../../utils/function/prod";

export const createPixKeysSchema = z.object({
  id: z.string().cuid().or(z.literal('')),
  keyType: z.nativeEnum(KeyType),
  key: z.string().trim(),
})
  .superRefine(({ key, keyType }, ctx) => {
    if (keyType === 'email') {
      const result = z.string().email().trim().max(191).safeParse(key)
      if (!result.success) {
        const [issue] = result.error.issues
        issue?.path.push('key')
        issue && ctx.addIssue({ ...issue, fatal: true })
        return z.NEVER
      }
    }

    if (keyType === 'celular' && key.length !== 12) {
      const result = z.preprocess(cleanValIfString, z.string().trim().min(10).max(11).refine(...isValidMobileRefiner)).safeParse(key)
      if (!result.success) {
        const [issue] = result.error.issues
        issue?.path.push('key')
        issue && ctx.addIssue({ ...issue, fatal: true })
        return z.NEVER
      }
    }

    if (keyType === 'cpf') {
      const zodResult = z.preprocess(cleanValIfString, z.string().length(11).refine(...isRepetitionRefiner)).safeParse(key)
      if (!zodResult.success) {
        const [issue] = zodResult.error.issues
        issue?.path.push('key')
        issue && ctx.addIssue({ ...issue, fatal: true })
        return z.NEVER
      }
      const result = new CpfValidator(zodResult.data).isCpfValid()
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
      const zodResult = z.preprocess(cleanValIfString, z.string().length(14).refine(...isRepetitionRefiner)).safeParse(key)
      if (!zodResult.success) {
        const [issue] = zodResult.error.issues
        issue?.path.push('key')
        issue && ctx.addIssue({ ...issue, fatal: true })
        return z.NEVER
      }
      const result = new CnpjValidator(zodResult.data).isCnpjValid();
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
