type SearchFormProps = {
  onFilterChange: (newFilterProperty: string) => void;
};

const SearchForm = ({ onFilterChange }: SearchFormProps) => {
  return (
    <form>
      <fieldset>
        <legend className='sr-only'>Procurar inquilino</legend>

        <div className='mb-6 flex items-center justify-center gap-2'>
          <label
            className='cursor-pointer whitespace-nowrap text-2xl'
            htmlFor='tenant-search'
          >
            Busca:{' '}
          </label>
          <input
            className='rounded-md border px-3 py-1 text-lg focus:outline focus:ring-2 dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-link-500'
            type='search'
            maxLength={255}
            placeholder='Fulano de tal'
            name='tenant-search'
            id='tenant-search'
            onChange={({ target: { value } }) =>
              onFilterChange(value)
            }
          />
        </div>
      </fieldset>
    </form>
  );
};

export default SearchForm;
