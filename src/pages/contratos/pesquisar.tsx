import { useState } from "react";
import { ItemsList } from "../../components/ItemsList";
import Paginator from "../../components/Paginator";
import Card from "../../components/contracts/Card"
import SearchForm from "../../components/contracts/SearchForm";
import { filterContracts } from "../../utils/functions";
import { trpc } from "../../utils/trpc";

const perPage = 10;
const defaultFilter = { property: 'all', caseSensitive: false, query: '' };

export type Filter = typeof defaultFilter;

const SearchContract = () => {
  const { data: contracts, isSuccess } = trpc.useQuery(['auth.contracts.findAll'])
  const [filter, setFilter] = useState(defaultFilter)
  const [currentPage, setCurrentPage] = useState(0)

  const onFilterChange = (newFilterProperty: Partial<typeof filter>) => {
    setFilter({...filter, ...newFilterProperty})
  }

  if (isSuccess) {
    const filteredContracts = filterContracts(filter, contracts)
    const paginatedContracts = filteredContracts.slice(currentPage, currentPage + perPage)

    const onPageChange = (index: number) => {
      if (index < 0 || index > (filteredContracts?.length ?? 0)) return
      setCurrentPage(index);
    }

  return (
    <div className="max-h-screen">
      <h1 className="text-5xl font-semibold text-center mb-20">Contratos</h1>

      <SearchForm onFilterChange={onFilterChange}/>

      <ItemsList>
        {
        paginatedContracts.map(contract => (
            <Card key={contract.id} contract={contract}  />
          ))
        }
      </ItemsList>

      <Paginator currentPage={currentPage} perPage={perPage} totalCount={filteredContracts?.length ?? 0} onPageChange={onPageChange} />
    </div>
  )
}
}

export default SearchContract
