import { router } from '../trpc';
import { contractsRouter } from './contracts';
import { housesRouter } from './houses';
import { tenantsRouter } from './tenants';
import { debitsRouter } from './debits';

export const appRouter = router({
  contracts: contractsRouter,
  houses: housesRouter,
  tenants: tenantsRouter,
  debits: debitsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
