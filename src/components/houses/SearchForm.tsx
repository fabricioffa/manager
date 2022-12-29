import { HousesSearchOptions, housesSearchOptionsSchema } from "../../server/schemas/house.schema";

type SearchFormProps = {
  onFilterChange: (newFilterProperty: Partial<HousesSearchOptions>) => void
}

const isValidOption = (opt: string): opt is HousesSearchOptions['property'] => {
  const { success } = housesSearchOptionsSchema.pick({ property: true }).safeParse(opt)
  return success
}

const SearchForm = ({ onFilterChange }: SearchFormProps) => {
  return (
    <form>
      <fieldset>
        <legend className="sr-only">
          <h2>Procurar casa</h2>
        </legend>

        <div className="flex flex-col items-center  gap-4">
          <div className="">
            <label className="text-2xl whitespace-nowrap cursor-pointer" htmlFor="tenant-search">Procurar casa:</label>
            <input className="border rounded-md text-lg py-1 px-3" type="search" maxLength={255}
              placeholder="Fulano de tal" name="tenant-search" id="tenant-search"
              onChange={({ target: { value } }) => onFilterChange({ query: value })} />
          </div>
          <div className="flex flex-col items-center gap-2">
            <div>
              <label htmlFor="search-options">Opções de busca</label>
              <select className="border" name="search-options" id="search-options"
                   onChange={({ target: { value } }) => {
                    if (!isValidOption(value)) return  
                    onFilterChange({ property: value })
                  }}>
                <option value="all">Tudo</option>
                <option value="number">Número</option>
                <option value="street">Rua</option>
                <option value="complement">Complemento</option>
                <option value="city">Cidade</option>
                <option value="type">Tipo</option>
                <option value="electricityId">Id da Enel</option>
                <option value="waterId">Id da Cagece</option>
              </select>
            </div>
            <div>
              <label htmlFor="case-sensitive">Case Sensitive</label>
              <input type="checkbox" name="case-sensitive" id="case-sensitive"
                onChange={({ target: { checked } }) => onFilterChange({ caseSensitive: checked })} />
            </div>
          </div>
        </div>
      </fieldset>
    </form>
  )
}

export default SearchForm;
