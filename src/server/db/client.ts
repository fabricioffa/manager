import { PrismaClient } from '@prisma/client';

import { env } from '../../env/server.mjs';

const prismaClientSingleton = () => {
  const client = new PrismaClient({
    log:
      env.NODE_ENV === 'development'
        ? ['query', 'error', 'warn', 'info']
        : ['error'],
  });


  return client;
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
