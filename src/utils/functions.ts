type BaseFilter = {
  property: string
  caseSensitive: boolean
  query: string
}

export const dataFilter = <Item extends Record<string, unknown>, Filter extends BaseFilter>(entities: Item[], filter: Filter,) => {
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

export const getDayInFuture = (days: number) => {
  const today = new Date();
  today.setDate(today.getDate() + days);
  return today.getDate()
}
