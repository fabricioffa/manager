import { useRouter } from "next/router";
import { trpc } from "./trpc";

export const useDeleteHouse = (id: string) => {
  const router = useRouter();
  const { invalidateQueries } = trpc.useContext();
  const { mutate } = trpc.useMutation(["auth.houses.delete"]);
  return () =>
    mutate(
      { id },
      {
        onSuccess: () => {
          invalidateQueries("auth.houses.findAll");
          invalidateQueries(["auth.houses.findOne", { id }]);
          router.push("/casas/pesquisar");
        },
      }
    );
};

export const useDeleteTenant = (id: string) => {
  const router = useRouter();
  const { invalidateQueries } = trpc.useContext();
  const { mutate } = trpc.useMutation(["auth.tenants.delete"]);
  return () =>
    mutate(
      { id },
      {
        onSuccess: () => {
          invalidateQueries("auth.tenants.findAll");
          invalidateQueries(["auth.tenants.findOne", { id }]);
          router.push("/tenants/pesquisar");
        },
      }
    );
};

export const useDeleteContract = (id: string) => {
  const router = useRouter();
  const { invalidateQueries } = trpc.useContext();
  const { mutate } = trpc.useMutation(["auth.contracts.delete"]);
  return () =>
    mutate(
      { id },
      {
        onSuccess: () => {
          invalidateQueries("auth.contracts.findAll");
          invalidateQueries(["auth.contracts.findOne", { id }]);
          router.push("/contracts/pesquisar");
        },
      }
    );
};
