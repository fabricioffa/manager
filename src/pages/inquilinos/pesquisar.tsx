import { useState } from "react";
import { ItemsList } from "../../components/ItemsList";
import Paginator from "../../components/Paginator";
import Card from "../../components/tenants/Card"
import SearchForm from "../../components/tenants/SearchForm";
// import { dataFilter } from "../../utils/functions";
import { filterTenants } from "../../utils/functions";
import { trpc } from "../../utils/trpc";
import { TenantsSearchOptions } from "../../server/schemas/tenant.schema";

const perPage = 10;

const defaultFilter: TenantsSearchOptions = { property: 'all', caseSensitive: false, query: '' };

const Search = () => {
  const [filter, setFilter] = useState<TenantsSearchOptions>(defaultFilter)
  const [currentPage, setCurrentPage] = useState(0)
  const { data, isSuccess } = trpc.tenants.findAll.useQuery()

  const onFilterChange = (newFilterProperty: Partial<TenantsSearchOptions>) => {
    setFilter({ ...filter, ...newFilterProperty })
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

        <SearchForm onFilterChange={onFilterChange} />

        <ItemsList>
          {
            paginatedTenants.map(tenant => (
              <Card key={tenant.id} tenant={tenant} />
            ))
          }
        </ItemsList>

        <Paginator currentPage={currentPage} perPage={perPage} totalCount={tenants?.length ?? 0} onPageChange={onPageChange} />
      </div>
    )
  }
}

export default Search
