import { tenantsRouter } from './tenants';
import { housesRouter } from './houses';
import { router } from "../trpc";
import { contractsRouter } from "./contracts";

export const appRouter = router({
  contracts: contractsRouter,
  houses: housesRouter,
  tenants: tenantsRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
