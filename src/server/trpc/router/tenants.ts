import { createPixKeysSchema } from './../../schemas/pixKeys.schemas';
import { CreateTenantSchema } from './../../schemas/tenant.schema';
import { router, protectedProcedure } from './../trpc';
import { z } from "zod";


export const contractRouter = router({
  create: protectedProcedure
    .input(CreateTenantSchema)
    .mutation(async ({ ctx, input }) => {
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
    }),
  
  findOne: protectedProcedure
    .input(z.object({
      id: z.string(),
    }))
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
        },
      });
    }),
  
  findAll: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.tenant.findMany();
    }),
  
  selectData: protectedProcedure
    .query(async ({ ctx }) => {
      return await ctx.prisma.tenant.findMany({
        select: {
          id: true,
          name: true,
        }
      });
    }),
  
  edit: protectedProcedure
    .input(z.object({
        tenantData: CreateTenantSchema.omit({ pixKeys: true }).partial(),
        tenantId: z.string().cuid(),
        pixKeysData: z.array(createPixKeysSchema).nullish(),
    }))
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
    .input(z.object({
      id: z.string(),
    }))
    .mutation(async ({ ctx, input: { id } }) => {
      await ctx.prisma.tenant.delete({
        where: { id },
      });
    }),
  
})