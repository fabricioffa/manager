import { calculateLateDebit } from "../../../utils/functions";
import { router, protectedProcedure } from "../trpc";

export const debitsRouter = router({
  findall: protectedProcedure.
    query(async ({ ctx }) => {
      return await ctx.prisma.debit.findMany()
    }),

  update: protectedProcedure
    .mutation(async ({ ctx }) => {
      const lateDebits = await ctx.prisma.debit.findMany({
        where: {
          dueDate: {
            lt: new Date()
          },
          paidAt: null
          ,
        },
        select: {
          id: true,
          dueDate: true,
          amount: true,
          contract: {
            select: {
              arrears: true,
              interest: true,
              rent: true,
            }
          }
        }
      });

      if (!lateDebits.length) return 'No late debits'

      const updates = lateDebits.map(debit => {
        const newAmout = calculateLateDebit(
          Number(debit.contract.rent),
          Number(debit.contract.arrears),
          Number(debit.contract.interest),
          debit.dueDate)
        if (Number(debit.amount) === newAmout) return `No need to update. Current amount: ${Number(debit.amount)}. Calculated amount: ${newAmout}`
        ctx.prisma.debit.update({
          where: {
            id: debit.id
          },
          data: {
            amount: newAmout
          }
        })
      })
      return {updates: await Promise.all(updates), lateDebits}
    }),
});
