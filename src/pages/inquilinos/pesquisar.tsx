import { useState } from "react";
import { ItemsList } from "../../components/ItemsList";
import Paginator from "../../components/Paginator";
import Card from "../../components/tenants/Card"
import SearchForm from "../../components/tenants/SearchForm";
import { dataFilter } from "../../utils/function/prod";
import { trpc } from "../../utils/trpc";
import type { TenantsSearchOptions } from "../../server/schemas/tenant.schema";

const perPage = 10;

const defaultFilter = { property: 'all', caseSensitive: false, query: '' } as const;

const Search = () => {
  const [filter, setFilter] = useState<TenantsSearchOptions>(defaultFilter)
  const [currentPage, setCurrentPage] = useState(0)
  const { data } = trpc.tenants.findAll.useQuery()

  const onFilterChange = (newFilterProperty: Partial<TenantsSearchOptions>) => {
    setFilter({ ...filter, ...newFilterProperty })
  }

  if (data) {
    const tenants = dataFilter(data, filter)
    const paginatedTenants = tenants.slice(currentPage, currentPage + perPage)

    const onPageChange = (index: number) => {
      if (index < 0 || index > (tenants?.length ?? 0)) return
      setCurrentPage(index);
    }

    return (
      <div>
        <h1 className="text-5xl font-semibold text-center mb-14">Inquilinos</h1>

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
