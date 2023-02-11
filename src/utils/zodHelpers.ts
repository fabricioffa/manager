import type { FieldNamesMarkedBoolean, FieldValues } from "react-hook-form";
import { castToNumbersArray, isRepetition, validateMobile } from "./function/prod";


export const isValidMobileRefiner = [validateMobile, { message: 'Celular inválido. Terceiro dígito incorreto' }] as const
export const isRepetitionRefiner = [isRepetition, { message: 'Caracteres repetidos são inválidos' }] as const
export class CpfValidator { //TODO: refactor
  result = { isCPF: true, message: "CPF válido!" }
  public cpf: number[]

  constructor(cpf: string) {
    this.cpf = castToNumbersArray(cpf)
  }

  getCtrlDigit(position: 'first' | 'second') {
    const total = this.getCtrlTotal(position)
    return 11 - (total % 11) > 9 ? 0 : 11 - (total % 11)
  }

  public getCtrlTotal(position: 'first' | 'second') {
    return this.cpf
      .slice(0, position === 'first' ? -2 : -1)
      .reduce((ac, curr, i) => ac + curr * (10 - i), 0);
  }

  public validateCtrlDigit(position: 'first' | 'second') {
    const validCtrlDigit = this.getCtrlDigit(position);
    const ctrlDigitPosition = position === 'first' ? 9 : 10
    if (validCtrlDigit !== this.cpf[ctrlDigitPosition])
      this.result = { isCPF: false, message: `${position === 'first' ? 'Penúltimo' : 'Último'} número inválido. Deveria ser: ${validCtrlDigit}` };
  }

  isCpfValid() {
    this.validateCtrlDigit("first")
    if (!this.result.isCPF) return this.result

    this.validateCtrlDigit("second")
    return this.result
  }
}
export class CnpjValidator {
  private readonly cnpj: number[]
  private result = { isCNPJ: true, message: "CNPJ válido!" }
  constructor(cnpj: string) {
    this.cnpj = castToNumbersArray(cnpj)
  }

  private isCtrlDigitValid(position: 'first' | 'last') {
    const ctrlNumbers = position === 'first'
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2] as const

    const ctrlDigit = this.cnpj.at(position === 'first' ? -2 : -1)
    const total = this.cnpj
      .slice(0, position === 'first' ? -2 : -1)
      .reduce((ac, cur, i) => ac + cur * ctrlNumbers[i]!, 0); //TODO: refactor
    const remainder = total % 11;
    const msgSubject = position === 'first' ? 'Penúltimo' : 'Último'

    if ((remainder === 0 || remainder === 1) && ctrlDigit !== 0)
      return {
        isCNPJ: false,
        message: `${msgSubject} número deveria ser 0`
      }

    if ((remainder > 1 || remainder <= 10) && ctrlDigit !== (11 - remainder))
      return {
        isCNPJ: false,
        message: `${msgSubject} número deveria ser ${11 - remainder}`
      }
    return this.result
  }

  isCnpjValid() {
    this.result = this.isCtrlDigitValid('first')
    if (!this.result.isCNPJ) return this.result

    this.result = this.isCtrlDigitValid('last')
    if (!this.result.isCNPJ) return this.result
    return this.result
  }
}

export function getDirtyValues<T extends FieldValues>(dirtyFields: FieldNamesMarkedBoolean<T>, allValues: T): Partial<T> {
  return Object.keys(dirtyFields).reduce((dirtyValues, field) => {
    const dirtyField = dirtyFields[field as keyof FieldNamesMarkedBoolean<T>]
    let fieldValue = allValues[field as keyof T]

    if (Array.isArray(dirtyField)) {
      fieldValue = fieldValue.filter(
        (item: object, i: number) => dirtyField.at(i) && Object.values(dirtyField.at(i)).some((value) => value))
    }

    if (dirtyField === false) return dirtyValues

    return { ...dirtyValues, [field as keyof T]: fieldValue } // TODO:  versão anterior tinha bug com valores falsy. Devem ser permitidos
  }, {} as Partial<T>)
}


