import type { FieldNamesMarkedBoolean, FieldValues } from "react-hook-form";
import { castToNumbersArray, hasRightLength, isRepetition } from "./function/prod";

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
      this.result = { isCPF: false, message: `Penúltimo número inválido. Deveria ser: ${validCtrlDigit}` };
  }

  isCpfValid() {
    if (isRepetition(this.cpf))
      return { isCPF: false, message: "O CPF não pode ser uma sequência de números iguais." };

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
      ? [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
      : [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]

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
    if (!hasRightLength(this.cnpj, 14))
      return { isCNPJ: false, message: `O CNPJ deve ter 14 dígitos, mas tem ${this.cnpj.length}.` };

    if (isRepetition(this.cnpj))
      return { isCNPJ: false, message: "O CNPJ não pode ser uma sequência de números iguais." };

    this.result = this.isCtrlDigitValid('first')
    if (!this.result.isCNPJ) return this.result

    this.result = this.isCtrlDigitValid('last')
    if (!this.result.isCNPJ) return this.result

    return this.result
  }
}


// export function nullifyEmptyString <T extends FieldValues>(data: T ) { //TODO: check if 11 becomes null by default
//   let newData: T = data;
//   for (const field in data) {
//     if (data[field] === '') {
//       newData = { ...newData, [field]: null};
//     }
//   }
//   return newData;
// }


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
