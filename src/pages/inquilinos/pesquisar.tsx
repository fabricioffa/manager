import { useState } from 'react';
import { ItemsList } from '~/components/ItemsList';
import Paginator from '~/components/Paginator';
import Card from '~/components/tenants/Card';
import SearchForm from '~/components/SearchForm';
import { dataFilter } from '../../utils/function/prod';
import { trpc } from '../../utils/trpc';

const perPage = 10;

const Search = () => {
  const [query, setQuery] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [currentPage, setCurrentPage] = useState(0);
  const { data } = trpc.tenants.findAll.useQuery({ showDeleted });

  const onFilterChange = (newQuery: typeof query) => setQuery(newQuery);

  if (data) {
    const tenants = dataFilter(data, query);
    const paginatedTenants = tenants.slice(currentPage, currentPage + perPage);

    const onPageChange = (index: number) => {
      if (index < 0 || index > (tenants?.length ?? 0)) return;
      setCurrentPage(index);
    };

    return (
      <div>
        <h1 className='mb-14 text-center text-5xl font-semibold'>Inquilinos</h1>

        <div className='flex items-start justify-center gap-8'>
          <SearchForm
            onFilterChange={onFilterChange}
            placeholder='Fulano da Silva'
            id='tenant '
          />
          <div className='flex items-center gap-4 text-center'>
            <label htmlFor='show-deleted'>
              Mostrar <br /> excluídos
            </label>
            <input
              onChange={(e) => setShowDeleted(e.currentTarget.checked)}
              checked={showDeleted}
              type='checkbox'
              name='show-deleted'
              id='show-deleted'
            />
          </div>
        </div>

        <ItemsList>
          {paginatedTenants.map((tenant) => (
            <Card key={tenant.id} tenant={tenant} />
          ))}
        </ItemsList>

        {tenants?.length > 1 && (
          <Paginator
            currentPage={currentPage}
            perPage={perPage}
            totalCount={tenants?.length ?? 0}
            onPageChange={onPageChange}
          />
        )}
      </div>
    );
  }
};

export default Search;
