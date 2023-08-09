import { useState } from "react";
import Card from "../../components/houses/Card";
import SearchForm from "../../components/houses/SearchForm";
import { ItemsList } from "../../components/ItemsList";
import Paginator from "../../components/Paginator";
import { dataFilter } from "../../utils/function/prod";
import { trpc } from "../../utils/trpc";
import type { HousesSearchOptions } from "../../server/schemas/house.schema";

const perPage = 10;

const HouseSearch = () => {
  const { data, isSuccess } = trpc.houses.findAll.useQuery()
  const [filter, setFilter] = useState<HousesSearchOptions>({ property: 'all', caseSensitive: false, query: '' })
  const [currentPage, setCurrentPage] = useState(0)

  const onFilterChange = (newFilter: Partial<HousesSearchOptions>) => {
    setFilter({ ...filter, ...newFilter })
  }

  if (isSuccess) {
    const houses = dataFilter<NonNullable<typeof data>[number], HousesSearchOptions>(data, filter)

    const paginatedHouses = houses.slice(currentPage, currentPage + perPage)

    const onPageChange = (index: number) => {
      if (index < 0 || index > (houses?.length ?? 0)) return
      setCurrentPage(index);
    }

    return (
      <div>
        <h1 className="text-5xl font-semibold text-center mb-14">Casas</h1>

        <SearchForm onFilterChange={onFilterChange} />

        <ItemsList>
          {
            paginatedHouses.map(house => (
              <Card key={house.id} house={house} />
            ))
          }
        </ItemsList>

        <Paginator currentPage={currentPage} perPage={perPage} totalCount={houses?.length ?? 0} onPageChange={onPageChange} />
      </div>
    )
  }
}

export default HouseSearch
