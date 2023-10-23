import { useState } from 'react';
import { ItemsList } from '../../components/ItemsList';
import Paginator from '../../components/Paginator';
import Card from '../../components/contracts/Card';
import SearchForm from '../../components/contracts/SearchForm';
import { dataFilter } from '../../utils/function/prod';
import { trpc } from '../../utils/trpc';

const perPage = 10;

const SearchContract = () => {
  const { data: contracts, isSuccess } = trpc.contracts.findAll.useQuery();
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const onFilterChange = (newQuery: typeof query) => setQuery(newQuery);
  if (isSuccess) {
    const filteredContracts = dataFilter(contracts, query);
    const paginatedContracts = filteredContracts.slice(
      currentPage,
      currentPage + perPage
    );

    const onPageChange = (index: number) => {
      if (index < 0 || index > (filteredContracts?.length ?? 0)) return;
      setCurrentPage(index);
    };

    return (
      <div>
        <h1 className='mb-16 text-center text-5xl font-semibold'>Contratos</h1>

        <SearchForm onFilterChange={onFilterChange} />

        <ItemsList>
          {paginatedContracts.map((contract) => (
            <Card key={contract.id} contract={contract} />
          ))}
        </ItemsList>

        <Paginator
          currentPage={currentPage}
          perPage={perPage}
          totalCount={filteredContracts?.length ?? 0}
          onPageChange={onPageChange}
        />
      </div>
    );
  }
};

export default SearchContract;
