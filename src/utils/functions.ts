import { ContractWithRelations } from "./../server/schemas/contracts.schemas";
import { Contract, House, Tenant } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { TenantsSearchOptions } from "../server/schemas/tenant.schema";

// TODO : change all this and use server side pagination
type BaseFilter<T> = {
  property: keyof T
  caseSensitive: boolean
  query: string
}

export type Filter = {
  property: string
  caseSensitive: boolean
  query: string
}

export const isOfKeyofHouse = (key: string): key is keyof House => {
  return Object.values(Prisma.HouseScalarFieldEnum).some(
    (field) => field === key
  );
};

export const isOfKeyofContract = (key: string): key is keyof Contract => {
  return Object.values(Prisma.ContractScalarFieldEnum).some(
    (field) => field === key
  );
};

export const filterContracts = (
  filter: Filter,
  contracts: ContractWithRelations[]
) => {
  return filter.query === ""
    ? contracts
    : contracts?.filter((tenant) => {
      const property = isOfKeyofContract(filter.property)
        ? filter.property
        : "all";
      const query = filter.caseSensitive
        ? filter.query
        : filter.query.toLowerCase();

      if (property === "all") {
        return Object.values(tenant).some((property) =>
          filter.caseSensitive
            ? property?.toString().includes(query)
            : property?.toString().toLowerCase().includes(query)
        );
      }

      return filter.caseSensitive
        ? tenant[property]?.toString().includes(query)
        : tenant[property]?.toString().toLocaleLowerCase().includes(query);
    });
};

export const dataFilter = <Item extends Record<string, unknown>, Filter extends BaseFilter<Item>>(entities: Item[], filter: Filter,) => {
  return filter.query === ""
    ? entities
    : entities?.filter((entity) => {
      const property = filter.property
      const query = filter.caseSensitive
        ? filter.query
        : filter.query.toLowerCase();

      if (property === "all") {
        return Object.values(entity).some((property) =>
          filter.caseSensitive
            ? property?.toString().includes(query)
            : property?.toString().toLowerCase().includes(query)
        );
      }

      return filter.caseSensitive
        ? entity[property]?.toString().includes(query)
        : entity[property]?.toString().toLocaleLowerCase().includes(query);
    });
};

export const filterTenants = (filter: TenantsSearchOptions, tenants: Tenant[]): Tenant[] => {
  return filter.query === ""
    ? tenants
    : tenants?.filter((tenant) => {
        const property = filter.property
        const query = filter.caseSensitive
          ? filter.query
          : filter.query.toLowerCase();

        if (property === "all") {
          return Object.values(tenant).some((property) =>
            filter.caseSensitive
              ? property?.toString().includes(query)
              : property?.toString().toLowerCase().includes(query)
          );
        }

        return filter.caseSensitive
          ? tenant[property]?.toString().includes(query)
          : tenant[property]?.toString().toLocaleLowerCase().includes(query);
      });
};

export const filterHouses = (filter: Filter, houses: House[]): House[] => {
  return filter.query === ""
    ? houses
    : houses?.filter((house) => {
      const property = isOfKeyofHouse(filter.property)
        ? filter.property
        : "all";
      const query = filter.caseSensitive
        ? filter.query
        : filter.query.toLowerCase();

      if (property === "all") {
        return Object.values(house).some((property) =>
          filter.caseSensitive
            ? property?.toString().includes(query)
            : property?.toString().toLowerCase().includes(query)
        );
      }

      return filter.caseSensitive
        ? house[property]?.toString().includes(query)
        : house[property]?.toString().toLocaleLowerCase().includes(query);
    });
};

export const getRandomKey = <T>(targetArray: T[]) => {
  return targetArray[Math.floor(Math.random() * targetArray.length)];
};

export const getDayInFuture = (days: number) => {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today.getDate()
}
