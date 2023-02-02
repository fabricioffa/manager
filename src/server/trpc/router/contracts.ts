import { formWitnessSchema } from "./../../schemas/witnesses.schema";
import { createContractsSchema } from "./../../schemas/contracts.schemas";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { currentDueDate, daysUntilNextSaturday, pastMonthLastDay } from "../../../utils/function/prod";

export const contractsRouter = router({
  create: protectedProcedure
    .input(createContractsSchema)
    .mutation(async ({ ctx, input }) => {
      const { witnesses, ...contractData } = input;
      await ctx.prisma.contract.create({
        data: {
          ...contractData,
          witnesses: {
            createMany: {
              data: witnesses, //TODO: remover id BUG!
            },
          },
        },
      });
    }),

  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.contract.findUnique({
        where: { id },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
            },
          },
          house: {
            select: {
              id: true,
              street: true,
              number: true,
            },
          },
          witnesses: {
            select: {
              id: true,
              name: true,
              cpf: true,
              rg: true,
              rgEmitter: true,
              primaryPhone: true,
              secondaryPhone: true,
              email: true
            }
          },
        },
      });
    }),

  findAll: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.contract.findMany({
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
            },
          },
          house: {
            select: {
              id: true,
              street: true,
              number: true,
            },
          },
          witnesses: {
            select: {
              id: true,
              name: true,
            }
          }
        },
      });
    }),

  dueToThisWeek: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.contract.findMany({
        where: {
          dueDay: {
            in: daysUntilNextSaturday()
          }
        },
        include: {
          tenant: {
            select: {
              id: true,
              name: true,
            },
          },
          house: {
            select: {
              id: true,
              street: true,
              number: true,
            },
          },
          witnesses: {
            select: {
              id: true,
              name: true,
            }
          }
        },
      });
    }),

  edit: protectedProcedure
    .input(
      z.object({
        contractData: createContractsSchema.omit({ witnesses: true }).partial(),
        contractId: z.string().cuid(),
        witnessesData: z.array(formWitnessSchema).nullish(),
      })
    )
    .mutation(
      async ({ ctx, input: { contractData, contractId, witnessesData } }) => {
        try {
          await ctx.prisma.$transaction(async (tx) => {
            await tx.contract.update({
              where: { id: contractId },
              data: contractData,
            });
            if (!witnessesData) return;
            await Promise.all(
              witnessesData.map((witness) => {
                const { id, ...witnessData } = witness;
                return tx.witness.upsert({
                  where: { id },
                  update: witnessData,
                  create: { ...witnessData, contractId },
                });
              })
            );
          });
        } catch (error) {
          return error;
        }
      }
    ),

  delete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.prisma.contract.delete({
        where: { id },
      });
    }),

  createDebits: protectedProcedure
    .mutation(async ({ ctx }) => {
      const contractsMissingDebits = await ctx.prisma.contract.findMany({
        select: {
          rent: true,
          dueDay: true,
          id: true,
        },
        where: {
          debits: {
            none: {
              dueDate: {
                gt: pastMonthLastDay()
              }
            }
          }
        }
      })

      // if (!contractsMissingDebits.length) return
      if (!contractsMissingDebits.length) return 'No contracts missing debits'

      const debitsData = contractsMissingDebits.map(contract => ({
        amount: Number(contract.rent),
        dueDate: currentDueDate(contract.dueDay),
        contractId: contract.id
      }))

      const debits = await ctx.prisma.debit.createMany({
        data: debitsData, skipDuplicates: true
      })

      return { debits }
    }),
});
