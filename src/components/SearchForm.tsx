type SearchFormProps = {
  onFilterChange: (newFilterProperty: string) => void;
  id: string,
  placeholder: string
};

const SearchForm = ({ onFilterChange, id, placeholder }: SearchFormProps) => {
  return (
    <form className='mb-4'>
      <fieldset>
        <legend className='sr-only'>Procurar { id }</legend>

        <div className='flex items-center justify-center gap-2'>
          <label
            className='cursor-pointer whitespace-nowrap text-2xl'
            htmlFor={`${id}-search`}
          >
            Busca:
          </label>
          <input
            className='rounded-md border px-3 py-1 text-lg focus:outline focus:ring-2 dark:border-slate-600 dark:bg-slate-700 dark:focus:ring-link-500'
            type='search'
            maxLength={255}
            placeholder={placeholder}
            name={`${id}-search`}
            id={`${id}-search`}
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
