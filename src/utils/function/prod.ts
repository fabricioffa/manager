import type { Decimal } from "@prisma/client/runtime";

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

export const castToNumbersArray = (str: string) =>
  Array.from(str, (char) => Number(char));

export const isRepetition = (numbersList: number[]) =>
  numbersList.every((number) => number === numbersList[0]);

export const hasRightLength = (str: string | unknown[], targetLength: number) =>
  str.length === targetLength

export const noRepetition = (val: string) => {
  const arrayVal = castToNumbersArray(val)
  return !isRepetition(arrayVal)
}

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

export const formatCpf = (cpf: string) => `${cpf.slice(0,3)}.${cpf.slice(3,6)}.${cpf.slice(6,9)}-${cpf.slice(9)}`

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

export const toMonthInputFormat = (date: Date = new Date()) => new Intl.DateTimeFormat('en-CA').format(date).slice(0, -3)
export const slugfy = (str: string) => str
 .normalize("NFD")
 .replace(/\p{Diacritic}/gu, "")
 .toLowerCase()
 .replaceAll(' ', '-')
