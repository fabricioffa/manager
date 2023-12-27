import { createPixKeysSchema } from './../../schemas/pixKeys.schemas';
import { createTenantSchema } from './../../schemas/tenant.schema';
import { router, protectedProcedure } from './../trpc';
import { z } from 'zod';
import { pagination } from '../../schemas/base.schemas';
import { isPrimaError } from '../../../utils/function/prod';
import { TRPCError } from '@trpc/server';

export const tenantsRouter = router({
  create: protectedProcedure
    .input(createTenantSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { pixKeys, ...tenantData } = input;
        if (pixKeys?.length) {
          await ctx.prisma.tenant.create({
            data: {
              ...tenantData,
              pixKeys: {
                createMany: {
                  data: pixKeys,
                },
              },
            },
          });
          return;
        }
        await ctx.prisma.tenant.create({ data: tenantData });
      } catch (error) {
        console.log('%c error', 'color: blue', error);
        if (isPrimaError(error) && error.code === 'P2002') {
          throw new TRPCError({
            code: 'BAD_REQUEST',
            message: 'Unique contraint violation',
            cause: JSON.stringify(error),
          });
        }
        return JSON.stringify(error);
      }
    }),

  findOne: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .query(async ({ ctx, input: { id } }) => {
      return await ctx.prisma.tenant.findUnique({
        where: { id },
        include: {
          pixKeys: {
            select: {
              id: true,
              key: true,
              keyType: true,
            },
          },
          contracts: {
            select: {
              id: true,
              dueDay: true,
              rent: true,
              endingDate: true,
              house: {
                select: {
                  id: true,
                  street: true,
                  number: true,
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
      return await ctx.prisma.tenant.findMany({
        include: {
          contracts: {
            select: {
              id: true,
              dueDay: true,
              initialDate: true,
              house: {
                select: {
                  id: true,
                  street: true,
                  number: true,
                },
              },
            },
          },
        },
        orderBy: {
          name: 'asc',
        },

        where: {
          deleted: showDeleted,
        },
      });
    }),

  filter: protectedProcedure
    .input(
      z.object({
        pagination,
      })
    )
    .query(async ({ ctx }) => {
      const [count] = await Promise.all([
        ctx.prisma.tenant.findMany({
          select: {
            id: true,
            name: true,
            primaryPhone: true,
            _count: true,
            contracts: {
              select: {
                id: true,
                dueDay: true,
                house: {
                  select: {
                    id: true,
                    street: true,
                    number: true,
                  },
                },
              },
            },
          },
        }),
      ]);

      return { count };
    }),

  selectData: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.tenant.findMany({
      select: {
        id: true,
        name: true,
      },
      where: {
        deleted: false,
      },
    });
  }),

  edit: protectedProcedure
    .input(
      z.object({
        tenantData: createTenantSchema.omit({ pixKeys: true }).partial(),
        tenantId: z.string().cuid(),
        pixKeysData: z.array(createPixKeysSchema).nullish(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        await ctx.prisma.$transaction(async (tx) => {
          await tx.tenant.update({
            where: { id: input.tenantId },
            data: input.tenantData,
          });
          if (!input.pixKeysData) return;
          await Promise.all(
            input.pixKeysData.map((pixKey) =>
              tx.pixKey.upsert({
                where: { id: pixKey.id },
                update: {
                  key: pixKey.key,
                  keyType: pixKey.keyType,
                },
                create: {
                  key: pixKey.key,
                  keyType: pixKey.keyType,
                  clientId: input.tenantId,
                },
              })
            )
          );
        });
      } catch (error) {
        return error;
      }
    }),

  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(
      async ({ ctx, input: { id } }) =>
        await ctx.prisma.tenant.update({
          where: { id },
          data: {
            deleted: true,
            contracts: {
              updateMany: {
                where: {
                  deleted: false,
                },
                data: {
                  deleted: true,
                },
              },
            },
          },
        })
    ),

  restore: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(
      async ({ ctx, input: { id } }) =>
        await ctx.prisma.tenant.update({
          where: { id },
          data: {
            deleted: false,
          },
        })
    ),

  exists: protectedProcedure
    .input(
      z.object({
        cpf: z.string().transform((cpf) => cpf.replace(/\D/gi, '')),
      })
    )
    .query(
      async ({ ctx, input: { cpf } }) =>
        !!(await ctx.prisma.tenant.findUnique({
          where: { cpf },
        }))
    ),
});
