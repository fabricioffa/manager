import { useState } from 'react';
import Card from '../../components/houses/Card';
import SearchForm from '../../components/houses/SearchForm';
import { ItemsList } from '../../components/ItemsList';
import Paginator from '../../components/Paginator';
import { dataFilter } from '../../utils/function/prod';
import { trpc } from '../../utils/trpc';

const perPage = 10;

const HouseSearch = () => {
  const { data, isSuccess } = trpc.houses.findAll.useQuery();
  const [query, setQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(0);

  const onFilterChange = (newQuery: typeof query) => setQuery(newQuery);
  if (isSuccess) {
    const houses = dataFilter(data, query);
    const paginatedHouses = houses.slice(currentPage, currentPage + perPage);

    const onPageChange = (index: number) => {
      if (index < 0 || index > (houses?.length ?? 0)) return;
      setCurrentPage(index);
    };

    return (
      <div>
        <h1 className='mb-14 text-center text-5xl font-semibold'>Casas</h1>

        <SearchForm onFilterChange={onFilterChange} />

        <ItemsList>
          {paginatedHouses.map((house) => (
            <Card key={house.id} house={house} />
          ))}
        </ItemsList>

        <Paginator
          currentPage={currentPage}
          perPage={perPage}
          totalCount={houses?.length ?? 0}
          onPageChange={onPageChange}
        />
      </div>
    );
  }
};

export default HouseSearch;
