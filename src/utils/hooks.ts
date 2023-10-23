import { useRouter } from 'next/router';
import { trpc } from './trpc';

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
          router.push(`/${entityName}/pesquisar`);
        },
      }
    );
};
