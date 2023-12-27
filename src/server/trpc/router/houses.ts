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

  findAll: protectedProcedure
    .input(
      z.object({
        showDeleted: z.boolean().default(false),
      })
    )
    .query(async ({ ctx, input: { showDeleted } }) => {
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
        where: {
          deleted: showDeleted,
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

  avaiableHouses: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.house.findMany({
      where: {
        NOT: {
          contracts: {
            some: {
              endingDate: {
                equals: null,
              },
            },
          },
        },
      },
      select: {
        id: true,
        street: true,
        number: true,
        contracts: {
          select: {
            endingDate: true,
          },
        },
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
      await ctx.prisma.house.update({
        data: {
          deleted: true,
          contracts: {
            updateMany: {
              data: {
                deleted: true,
              },
              where: {
                houseId: id,
              },
            },
          },
        },
        where: { id },
      });
    }),

  restore: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.prisma.house.update({
        data: {
          deleted: false,
        },
        where: { id },
      });
    }),
});
