import { contractsSearchOptionsSchema } from "../../server/schemas/contracts.schemas";
import type { ContractSearchOptions } from "../../server/schemas/contracts.schemas";

type SearchFormProps = {
  onFilterChange: (newFilterProperty: Partial<ContractSearchOptions>) => void
}

const isValidOption = (opt: string): opt is ContractSearchOptions['property'] => {
  const { success } = contractsSearchOptionsSchema.pick({ property: true }).safeParse(opt)
  return success
}

const SearchForm = ({ onFilterChange }: SearchFormProps) => {
  return (
    <form className="mb-4">
      <fieldset>
        <legend className="sr-only">
          <h2>Procurar contrato</h2>
        </legend>

        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-2xl whitespace-nowrap cursor-pointer" htmlFor="tenant-search">Busca:</label>
            <input className="border rounded-md text-lg py-1 px-3" type="search" maxLength={255}
              placeholder="Fulano de tal" name="tenant-search" id="tenant-search"
              onChange={({ target: { value } }) => onFilterChange({ query: value })} />
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="search-options">Filtros</label>
            <select className="border" name="search-options" id="search-options"
              onChange={({ target: { value } }) => {
                if (!isValidOption(value)) return
                onFilterChange({ property: value })
              }}>
              <option value="all">Tudo</option>
              <option value="dueDay">Vencimento</option>
              <option value="initialDate">Data de início</option>
              <option value="rent">Aluguel</option>
              <option value="endingDate">Data do fim</option>
              <option value="duration">Duração</option>
              <option value="bail">Caução</option>
              <option value="interest">Jurus</option>
              <option value="arrear">Mora</option>
              <option value="lastPayment">Data do último pagamento</option>
              <option value="waterId">Número do Cliente</option>
              <option value="electricityId">Número de Inscrição</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
            <label htmlFor="case-sensitive">Case Sensitive</label>
            <input type="checkbox" name="case-sensitive" id="case-sensitive"
              onChange={({ target: { checked } }) => onFilterChange({ caseSensitive: checked })} />
          </div>
        </div>
      </fieldset>
    </form>
  )
}

export default SearchForm;
