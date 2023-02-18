import type { Decimal } from "@prisma/client/runtime/library";
import type { ChangeEvent } from "react";
import type { FieldPath, FieldValues, UseFormReturn, FieldPathValue } from "react-hook-form";

type BaseFilter = {
  property: string
  caseSensitive: boolean
  query: string
}

export const dataFilter = <Item extends Record<string, unknown>, Filter extends BaseFilter>(entities: Item[], filter: Filter,) => {
  return filter.query === ""
    ? entities
    : entities?.filter((entity) => {
      const property = filter.property
      const query = filter.caseSensitive
        ? filter.query
        : filter.query.toLowerCase();

      if (property === "all") {
        return Object.values(entity).some((property) =>
          filter.caseSensitive
            ? property?.toString().includes(query)
            : property?.toString().toLowerCase().includes(query)
        );
      }

      return filter.caseSensitive
        ? entity[property]?.toString().includes(query)
        : entity[property]?.toString().toLocaleLowerCase().includes(query);
    });
};

export const injectCharAt = (str: string, char: string, pos: number) => str.slice(0, pos) + char + str.slice(pos)
export const castToNumbersArray = (str: string) =>
  Array.from(str, (char) => Number(char));

export const isRepetition = (str: string) =>
  !str.split('').every(char => char === str.charAt(0))

export const hasRightLength = (str: string | unknown[], targetLength: number) =>
  str.length === targetLength

export const daysUntilNextSaturday = () => {
  const today = new Date();
  const numberOfDaysUntilSaturday = 7 - today.getDay()
  return Array.from({ length: numberOfDaysUntilSaturday }).map((day, i) => {
    if (i) today.setDate(today.getDate() + 1);
    return today.getDate()
  })
}

export const formatCurrency = (val: string | number | Decimal) =>
  Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val))

export const formatDate = (date: Date, options?: Intl.DateTimeFormatOptions) => {
  return new Intl.DateTimeFormat('pt-BR', options).format(date)
}

export const pastMonthDate = (date: Date = new Date()) => {
  const newDate = new Date(date);
  newDate.setMonth(date.getMonth() - 1);
  return newDate
}

export function getFirstAndLastDayOfCurrentMonth() {
  const today = new Date();
  const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
  const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
  return {
    firstDay: firstDay,
    lastDay: lastDay
  }
}

export const pastMonthLastDay = () => {
  const today = new Date();
  return new Date(today.getFullYear(), today.getMonth(), 0)
}

export const currentDueDate = (dueDay: number) => {
  const today = new Date()
  return new Date(today.getFullYear(), today.getMonth(), dueDay)
}

// export const diffDays = (minuend: Date, subtrahend: Date) => {
//   const utcMinuend = Date.UTC(minuend.getFullYear(), minuend.getMonth(), minuend.getDate(), minuend.getHours(), minuend.getMinutes(), minuend.getSeconds(), minuend.getMilliseconds());
//   const utcSubtrahend = Date.UTC(subtrahend.getFullYear(), subtrahend.getMonth(), subtrahend.getsubtrahend(), subtrahend.getHours(), subtrahend.getMinutes(), subtrahend.getSeconds(), subtrahend.getMilliseconds());
//   return minuend
// }

export const calculateLateDebit = (rent: number, arreas: number, interest: number, dueDate: Date) => {
  const today = new Date();
  if (today < dueDate) return rent
  const lateMonths = today.getMonth() - dueDate.getMonth() + (12 * (today.getFullYear() - dueDate.getFullYear()));
  const arreasAmount = rent * (arreas / 100)
  const interestAmount = rent * (interest * lateMonths / 100);
  const totalAmountDue = rent + arreasAmount + interestAmount;
  return totalAmountDue;
}

export const toMonthInputFormat = (date: Date = new Date()) =>
  new Intl.DateTimeFormat('pt-BR').format(date).slice(3).split('/').reverse().join('-')

export const slugfy = (str: string) => str
  .normalize("NFD")
  .replace(/\p{Diacritic}/gu, "")
  .toLowerCase()
  .replaceAll(' ', '-')


export const stripOfNonNumeric = <T>(val: T) => typeof val === 'string' ? val.replace(/\D/gi, '') : val
export const nullifyEmptyStr = (val: unknown) => typeof val === 'string' && val === '' ? null : val
export const stripOfNonNumericOrNullifyEmptyStr = <T>(val: T) => {
  if (typeof val === 'string')
    return val === '' ? null : val.replace(/\D/gi, '')
  return val
}

export const formatCpf = (cpf: string) => {
  return [9, 6, 3]
    .reduce(
      (formattedCpf, position) => formattedCpf.charAt(position)
        ? injectCharAt(formattedCpf, position < 9 ? '.' : '-', position)
        : formattedCpf
      , cpf.replace(/\D/gi, ''))
    .slice(0, 14)
}

export const formatPhone = (phone: string) => {
  const cleanPhone = phone.replace(/\D/gi, '')
  let formattedPhone = cleanPhone
  if (cleanPhone.charAt(7)) formattedPhone = injectCharAt(formattedPhone, '-', 7)
  if (cleanPhone.charAt(2)) formattedPhone = '(' + injectCharAt(formattedPhone, ') ', 2)
  return formattedPhone.slice(0, 15)
}

export const formatCnpj = (cnpj: string) => {
  const cleanCnpj = cnpj.replace(/\D/gi, '')
  let formattedCnpj = cleanCnpj
  if (cleanCnpj.charAt(12)) formattedCnpj = injectCharAt(formattedCnpj, '-', 12)
  if (cleanCnpj.charAt(8)) formattedCnpj = injectCharAt(formattedCnpj, '/', 8)
  if (cleanCnpj.charAt(5)) formattedCnpj = injectCharAt(formattedCnpj, '.', 5)
  if (cleanCnpj.charAt(2)) formattedCnpj = injectCharAt(formattedCnpj, '.', 2)
  return formattedCnpj.slice(0, 18)
}

export const validateMobile = (phone: string) => phone.length === 11
  ? phone.charAt(2) === '9'
  : true

type FieldName<TFieldValues extends FieldValues> = FieldPath<TFieldValues>
type formatOnChangeProps<TFieldValues extends FieldValues> = {
  field: FieldPath<TFieldValues>,
  formatFunc: (str: string) => FieldPathValue<TFieldValues, FieldName<TFieldValues>>,
  setValue: Pick<UseFormReturn<TFieldValues>, 'setValue'>['setValue']
}

export const formatOnChange = <TFieldValues extends FieldValues>({ field, formatFunc, setValue }: formatOnChangeProps<TFieldValues>) =>
  ({ target }: ChangeEvent<HTMLInputElement>) => {
    const prevCursorPos = target.selectionStart || 0
    const prevLenght = target.value.length
    setValue(field, formatFunc(target.value), { shouldDirty: false, shouldTouch: false, shouldValidate: false })
    const nextCursorPos = ((prevCursorPos < target.value.length) && (prevLenght === target.value.length))
      ? prevCursorPos
      : target.value.length
    target.setSelectionRange(nextCursorPos, nextCursorPos)
  }
