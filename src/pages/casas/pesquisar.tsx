import { useState } from "react";
import Card from "../../components/houses/Card";
import SearchForm from "../../components/houses/SearchForm";
import { ItemsList } from "../../components/ItemsList";
import Paginator from "../../components/Paginator";
import { filterHouses } from "../../utils/functions";
import { trpc } from "../../utils/trpc";

export type Filter = {
  property: string, caseSensitive: boolean, query: string
}
const perPage = 10;


const HouseSearch = () => {
  const { data, isSuccess } = trpc.useQuery(['auth.houses.findAll'])
  const [filter, setFilter] = useState({property: 'all', caseSensitive: false, query: ''})
  const [currentPage, setCurrentPage] = useState(0)

  const onFilterChange = (newFilterProperty: Partial<typeof filter>) => {
    setFilter({...filter, ...newFilterProperty})
  }

  if (isSuccess) {
    const houses = filterHouses(filter, data)

    const paginatedHouses = houses.slice(currentPage, currentPage + perPage)

    const onPageChange = (index: number) => {
      if (index < 0 || index > (houses?.length ?? 0)) return
      setCurrentPage(index);
    }

  return (
    <div className="max-h-screen">
      <h1 className="text-5xl font-semibold text-center mb-20">Casas</h1>

      <SearchForm onFilterChange={onFilterChange}/>

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
