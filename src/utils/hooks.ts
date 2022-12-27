import { useRouter } from "next/router";
import { trpc } from "./trpc";

export const useDelete = (id: string, entityName: 'houses' | 'contracts' | 'tenants') => {
  const router = useRouter();
  const { [entityName]: entity } = trpc.useContext();

  const { mutate } = trpc[entityName].delete.useMutation()
  return () =>
    mutate(
      { id },
      {
        onSuccess: () => {
          entity.findOne.invalidate({ id })
          entity.findAll.invalidate()
          router.push(`/${entityName}/pesquisar`);
        },
      }
    );
};

// export const useDeleteHouse = (id: string) => {
//   const router = useRouter();
//   const { invalidateQueries } = trpc.useContext();
//   const { mutate } = trpc.useMutation(["auth.houses.delete"]);
//   return () =>
//     mutate(
//       { id },
//       {
//         onSuccess: () => {
//           invalidateQueries("auth.houses.findAll");
//           invalidateQueries(["auth.houses.findOne", { id }]);
//           router.push("/casas/pesquisar");
//         },
//       }
//     );
// };

// export const useDeleteTenant = (id: string) => {
//   const router = useRouter();
//   const { invalidateQueries } = trpc.useContext();
//   const { mutate } = trpc.useMutation(["auth.tenants.delete"]);
//   return () =>
//     mutate(
//       { id },
//       {
//         onSuccess: () => {
//           invalidateQueries("auth.tenants.findAll");
//           invalidateQueries(["auth.tenants.findOne", { id }]);
//           router.push("/tenants/pesquisar");
//         },
//       }
//     );
// };

// export const useDeleteContract = (id: string) => {
//   const router = useRouter();
//   const { invalidateQueries } = trpc.useContext();
//   const { mutate } = trpc.useMutation(["auth.contracts.delete"]);
//   return () =>
//     mutate(
//       { id },
//       {
//         onSuccess: () => {
//           invalidateQueries("auth.contracts.findAll");
//           invalidateQueries(["auth.contracts.findOne", { id }]);
//           router.push("/contracts/pesquisar");
//         },
//       }
//     );
// };
