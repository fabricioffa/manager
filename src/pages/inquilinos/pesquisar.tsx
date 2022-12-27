import { useState } from "react";
import { ItemsList } from "../../components/ItemsList";
import Paginator from "../../components/Paginator";
import Card from "../../components/tenants/Card"
import SearchForm from "../../components/tenants/SearchForm";
import { filterTenants } from "../../utils/functions";
import { trpc } from "../../utils/trpc";

const perPage = 10;
const defaultFilter = { property: 'all', caseSensitive: false, query: '' };

export type Filter = typeof defaultFilter;

const Search = () => {
  const { data, isSuccess } = trpc.useQuery(['auth.tenants.findAll'])
  const [filter, setFilter] = useState(defaultFilter)
  const [currentPage, setCurrentPage] = useState(0)

  const onFilterChange = (newFilterProperty: Partial<typeof filter>) => {
    setFilter({...filter, ...newFilterProperty})
  }

  if (isSuccess) {
    const tenants = filterTenants(filter, data)
    const paginatedTenants = tenants.slice(currentPage, currentPage + perPage)

    const onPageChange = (index: number) => {
      if (index < 0 || index > (tenants?.length ?? 0)) return
      setCurrentPage(index);
    }

  return (
    <div className="max-h-screen">
      <h1 className="text-5xl font-semibold text-center mb-20">Inquilinos</h1>

      <SearchForm onFilterChange={onFilterChange}/>

      <ItemsList>
        {
        paginatedTenants.map(tenant => (
            <Card key={tenant.id} tenant={tenant}  />
          ))
        }
      </ItemsList>

      <Paginator currentPage={currentPage} perPage={perPage} totalCount={tenants?.length ?? 0} onPageChange={onPageChange} />
    </div>
  )
}
}

export default Search
