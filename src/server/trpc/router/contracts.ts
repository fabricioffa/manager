import { formWitnessSchema } from "./../../schemas/witnesses.schema";
import { createContractsSchema } from "./../../schemas/contracts.schemas";
import { router, protectedProcedure } from "../trpc";
import { z } from "zod";
import { daysUntilNextSaturday } from "../../../utils/functions";

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

  debitors: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.contract.findMany({
        where: {
          AND: {
            dueDay: {
              lt: new Date().getDate()
            },

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
});
