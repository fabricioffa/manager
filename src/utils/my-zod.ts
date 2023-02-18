import * as z from "zod";

const customErrorMap: z.ZodErrorMap = (error, ctx) => {
  switch (error.code) {
    case z.ZodIssueCode.invalid_type:
      if (error.received === "undefined") {
        return { message: `Campo obrigatório.` };
      }
      if (error.expected === "string") {
        return { message: `O campo deve conter apenas texto.` };
      }
      break;
    case z.ZodIssueCode.too_small:
      if (error.type === "string")
        return error.minimum === 1
          ? { message: 'Campo obrigatório' }
          : { message: `O mínimo de caracteres é ${error.inclusive ? error.minimum : error.minimum - 1}.`};
      if (error.type === "number")
        return {
          message: `O mínimo é ${error.inclusive ? error.minimum : error.minimum + 1}.`,
        };
      break;
    case z.ZodIssueCode.too_big:
      if (error.type === "string")
        return {
          message: `O máximo de caracteres é ${error.inclusive ? error.maximum : error.maximum - 1
            }.`,
        };
      if (error.type === "number")
        return {
          message: `O máximo é ${error.inclusive ? error.maximum : error.maximum - 1
            }.`,
        };
      break;
    case z.ZodIssueCode.invalid_string:
      if (error.validation === "email")
        return { message: "Formato de email inválido." };
      break;
    case z.ZodIssueCode.invalid_literal:
      if (error.expected === true)
        return { message: "É preciso aceitar os termos." };
      break;
    case z.ZodIssueCode.invalid_enum_value:
      if (error.received === "") return { message: 'Campo obrigatório.' };
      return { message: 'Opção inválida.' };
  }
  return { message: ctx.defaultError };
};

z.setErrorMap(customErrorMap);

export default z;
