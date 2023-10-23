import { protectedProcedure, router } from './../trpc';
import { createHouseSchema } from './../../schemas/house.schema';
import { z } from 'zod';

export const housesRouter = router({
  create: protectedProcedure
    .input(createHouseSchema)
    .mutation(async ({ ctx, input: data }) => {
      await ctx.prisma.house.create({ data });
    }),

  findOne: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.house.findUnique({
        where: { id },
        include: {
          contracts: {
            select: {
              id: true,
              endingDate: true,
              dueDay: true,
              rent: true,
              tenant: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      });
    }),

  findAll: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.house.findMany({
      include: {
        contracts: {
          where: {
            endingDate: null,
          },
          select: {
            id: true,
            tenant: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  }),

  selectData: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.house.findMany({
      select: {
        id: true,
        street: true,
        number: true,
      },
    });
  }),

  edit: protectedProcedure
    .input(
      z.object({
        houseData: createHouseSchema.partial(),
        houseId: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      await ctx.prisma.house.update({
        where: { id: input.houseId },
        data: input.houseData,
      });
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.prisma.house.delete({
        where: { id },
      });
    }),
});
