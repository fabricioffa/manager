import { useRouter } from 'next/router';
import { trpc } from './trpc';

const routesMap = {
  houses: 'casas',
  contracts: 'contratos',
  tenants: 'inquilinos',
  debits: 'debitos',
}

export const useDelete = (
  id: string,
  entityName: 'houses' | 'contracts' | 'tenants' | 'debits'
) => {
  const router = useRouter();
  const { [entityName]: entity } = trpc.useUtils();

  const { mutate } = trpc[entityName].delete.useMutation();
  return () =>
    mutate(
      { id },
      {
        onSuccess: () => {
          entity.findOne.invalidate({ id });
          entity.findAll.invalidate();
          router.push(`/${routesMap[entityName]}/pesquisar`);
        },
      }
    );
};

export const useRestore = (
  id: string,
  entityName: 'houses' | 'contracts' | 'tenants' | 'debits'
) => {
  const router = useRouter();
  const { [entityName]: entity } = trpc.useUtils();

  const { mutate } = trpc[entityName].restore.useMutation();
  return () =>
    mutate(
      { id },
      {
        onSuccess: () => {
          entity.findOne.invalidate({ id });
          entity.findAll.invalidate();
          router.push(`/${routesMap[entityName]}/pesquisar`);
        },
      }
    );
};
