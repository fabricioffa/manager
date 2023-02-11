import { z } from "zod";
import { calculateLateDebit } from "../../../utils/function/prod";
import { router, protectedProcedure } from "../trpc";

export const debitsRouter = router({
  findOne: protectedProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(({ ctx, input: { id } }) => {
      return ctx.prisma.debit.findUnique({
        where: { id },
        select: {
          id: true,
          amount: true,
          dueDate: true,
          contract: {
            select: {
              id: true,
              initialDate: true,
              house: {
                select: {
                  street: true,
                  number: true
                }
              },
              tenant: {
                select: {
                  name: true,
                  cpf: true,
                },
              }
            }
          }
        }
      })
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

      // if (!lateDebits.length) return
      if (!lateDebits.length) return 'No late debits'

      const updates = await Promise.all(
        lateDebits.map(debit => {
          const newAmout = calculateLateDebit(
            Number(debit.contract.rent),
            Number(debit.contract.arrears),
            Number(debit.contract.interest),
            debit.dueDate)
          if (Number(debit.amount) === newAmout) return `No need to update. Current amount: ${Number(debit.amount)}. Calculated amount: ${newAmout}`
          return ctx.prisma.debit.update({
            where: {
              id: debit.id
            },
            data: {
              amount: newAmout
            }
          })
        })
      )

      return { updates }
    }),

  lateDebits: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.debit.findMany({
        where: {
          dueDate: {
            lt: new Date()
          },
          paidAt: null,
        },
        orderBy: {
          amount: 'desc',
        },
        select: {
          id: true,
          amount: true,
          dueDate: true,
          contract: {
            select: {
              id: true,
              electricityId: true,
              waterId: true,
              endingDate: true,
              tenant: {
                select: {
                  id: true,
                  name: true,
                  primaryPhone: true
                },
              },
              house: {
                select: {
                  id: true,
                  street: true,
                  number: true,
                },
              },
            }
          }
        },
      });
    }),

  pastPaidDebitsCount: protectedProcedure
    .input(z.object({
      contractId: z.string().cuid()
    }))
    .query(async ({ ctx, input: { contractId } }) => {
      return await ctx.prisma.debit.count({
        where: {
          contract: {
            id: contractId
          },
          paidAt: {
            not: null
          }
        },
      })
    })
});
