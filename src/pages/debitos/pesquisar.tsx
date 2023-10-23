import { useState } from 'react';
import { ItemsList } from '../../components/ItemsList';
import Paginator from '../../components/Paginator';
import Card from '../../components/debits/Card';
import SearchForm from '../../components/debits/SearchForm';
import { dataFilter } from '../../utils/function/prod';
import { trpc } from '../../utils/trpc';

const perPage = 10;

const SearchDebit = () => {
  const { data: debits, isSuccess } = trpc.debits.findAll.useQuery();
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const onFilterChange = (newQuery: typeof query) => setQuery(newQuery);
  if (isSuccess) {
    const filteredDebits = dataFilter(debits, query);
    const paginatedDebits = filteredDebits.slice(
      currentPage,
      currentPage + perPage
    );

    const onPageChange = (index: number) => {
      if (index < 0 || index > (filteredDebits?.length ?? 0)) return;
      setCurrentPage(index);
    };

    return (
      <div>
        <h1 className='mb-16 text-center text-5xl font-semibold'>Débitos</h1>

        <SearchForm onFilterChange={onFilterChange} />

        <ItemsList>
          {paginatedDebits.map((debit) => (
            <Card key={debit.id} debit={debit} />
          ))}
        </ItemsList>

        {!!filteredDebits?.length && <Paginator
          currentPage={currentPage}
          perPage={perPage}
          totalCount={filteredDebits?.length ?? 0}
          onPageChange={onPageChange}
        />}
      </div>
    );
  }
};

export default SearchDebit;
