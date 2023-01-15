import type { Decimal } from "@prisma/client/runtime";
import { date } from "zod";

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

export const formatDate = (date: Date) => new Intl.DateTimeFormat('pt-BR').format(date)


export const pastMonthDate = () => {
  const pastMonth = new Date();
  pastMonth.setMonth(pastMonth.getMonth() - 1);
  return pastMonth
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
  let today = new Date();
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

export const calculateLateDebit = (rent: number, arreas: number, interest: number, dueDate: Date) =>  {
  const today = new Date();
  if (today < dueDate) return rent
  const lateMonths = today.getMonth() - dueDate.getMonth() + (12 * (today.getFullYear() - dueDate.getFullYear()));
  const arreasAmount = rent * (arreas / 100)
  const interestAmount = rent * (interest * lateMonths / 100);
  const totalAmountDue = rent + arreasAmount + interestAmount;
  return totalAmountDue;
}



// const format = (date) => new Intl.DateTimeFormat('pt-BR').format(date)


// console.log('lastPayment', new Intl.DateTimeFormat('pt-BR').format(lastPayment))

// const isOK = (dueDay, lastPayment) => {
//   console.log(format(lastPayment),'>' , format(new Date(pastMonthDate().getFullYear(), pastMonthDate().getMonth(), dueDay)), lastPayment > new Date(pastMonthDate().getFullYear(), pastMonthDate().getMonth(), dueDay))
//   console.log(format(lastPayment),'<' , format(new Date(new Date().getFullYear(), new Date().getMonth(), dueDay)), lastPayment < new Date(new Date().getFullYear(), new Date().getMonth(), dueDay))

//   return lastPayment > new Date(pastMonthDate().getFullYear(), pastMonthDate().getMonth(), dueDay) &&
//   lastPayment < new Date(new Date().getFullYear(), new Date().getMonth(), dueDay)
// }

// console.log('isLate(dueDate, lastPayment)', isOK(dueDate, lastPayment))