import { PrismaClient } from '@prisma/client';

import { env } from '../../env/server.mjs';

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log:
      env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });
  const extendedClient = client.$extends({
    name: 'soft-delete',
    query: {
      house: {
        async delete({ args }) {
          return client.house.update({
            ...args,
            data: {
              deleted: true,
            },
            where: args.where,
          });
        },
      },
      tenant: {
        async delete({ args }) {
          return client.tenant.update({
            ...args,
            data: {
              deleted: true,
            },
            where: args.where,
          });
        },
      },
      contract: {
        async delete({ args }) {
          return client.contract.update({
            data: {
              deleted: true,
            },
            where: {
              id: args.where.id,
            },
          });
        },
      },
      debit: {
        async delete({ args }) {
          return client.debit.update({
            data: {
              deleted: true,
            },
            where: {
              id: args.where.id,
            },
          });
        },
      },
      $allModels: {
        async findMany({ args, query }) {
          args.where = { deleted: false, ...args.where };
          return query(args);
        },
      },
    },
  });

  return extendedClient;
};

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClientSingleton | undefined;
}

type PrismaClientSingleton = ReturnType<typeof prismaClientSingleton>;

// const globalForPrisma = globalThis as unknown as {
//   prisma: PrismaClientSingleton | undefined;
// };

export const prisma = global.prisma ?? prismaClientSingleton();

if (env.NODE_ENV !== 'production') global.prisma = prisma;
