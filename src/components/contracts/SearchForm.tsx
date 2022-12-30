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
              <option value="name">Nome</option>
              <option value="profession">Profissão</option>
              <option value="maritalStatus">Estado Civíl</option>
              <option value="rg">RG</option>
              <option value="rgEmitter">Orgão Emisor</option>
              <option value="cpf">CPF</option>
              <option value="primaryPhone">Telefone Principal</option>
              <option value="secondaryPhone">Telefone Secundário</option>
              <option value="email">Email</option>
              <option value="electricityId">Id da Enel</option>
              <option value="waterId">Id da Cagece</option>
              <option value="obs">Observação</option>
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
