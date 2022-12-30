import Link from "next/link";
import { useRouter } from "next/router"
import { useDelete } from "../../utils/hooks";
import { trpc } from "../../utils/trpc";

const dateToString = (date: Date) => new Intl.DateTimeFormat('pt-BR').format(date)

const ContractProfile = () => {
  const { query: { id } } = useRouter();
  const stringId = id as string

  const {data: contract, isLoading, isError} = trpc.contracts.findOne.useQuery({id: stringId})

  const deleteContract = useDelete(stringId, 'contracts')

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>

  if (isLoading) return <div>Loading...</div>


  if (contract)
    return (
      <div className="relative mx-auto px-6">

        <h1 className="text-4xl text-center capitalize">{contract.id}</h1>

        <div className="flex flex-wrap justify-around gap-20 mt-20">
          <div>
            <h2 className="text-2xl text-center capitalize mb-7">Título 1</h2>
            <ul className="space-y-1">
              <li>
                <span className="font-bold uppercase">Locatário: </span>
                <Link href={`${contract.tenant.name}?id=${contract.tenant.id}`} className="capitalize">
                  {contract.tenant.name}
                </Link>
              </li>
              <li>
                <span className="font-bold uppercase">Casa: </span>
                <Link href={`${contract.house.street}?id=${contract.house.id}`} className="capitalize">
                    {`${contract.house.street}, ${contract.house.number}`}
                </Link>
              </li>
              <li>
                <span className="font-bold capitalize">Data initial: </span>
                <span className="capitalize">{ dateToString(contract.initialDate)}</span>
              </li>
              {contract.endingDate &&
                <li>
                  <span className="font-bold capitalize">Data final: </span>
                  <span className="capitalize">{ dateToString(contract.endingDate)}</span>
                </li>
              }
            </ul>
          </div>

          <div>
            <h2 className="text-2xl text-center capitalize mb-7">Título 2</h2>
            <ul className="space-y-1">
              <li>
                <span className="font-bold capitalize">Aluguel: </span>
                {Number(contract.rent)}
              </li>
              <li>
                <span className="font-bold capitalize">Caução: </span>
                {Number(contract.bail)}
              </li>
              <li>
                <span className="font-bold capitalize">Duração: </span>
                <span className="capitalize">{contract.duration}</span>
              </li>
              <li>
                <span className="font-bold capitalize">Juros: </span>
                <span className="capitalize">{Number(contract.interest)}</span>
              </li>
              <li>
                <span className="font-bold capitalize">Multa: </span>
                <span className="capitalize">{Number(contract.arrears)}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl text-center capitalize mb-7">Testemunhas</h2>
            <ul className="space-y-1">
            {
                contract.witnesses.map((witness, i) => (
                  <li key={witness.id}>
                    <span className="font-bold">Testemunha {i + 1}: </span>
                    {witness.name}
                  </li>
              ))
            }

            </ul>
          </div>

        </div>

        <menu className="flex items-center justify-around pt-10">
          <li>
            <Link href={`editar?id=${contract.id}`} className="grow bg-blue-400 rounded-lg
            border border-blue-700 text-white text-center font-semibold py-2 px-8">
              Editar
            </Link>
          </li>
          <li>
            <button onClick={() => deleteContract()}
              className="grow bg-red-400 rounded-lg border border-red-700 text-white font-semibold py-2 px-8">
              Excluir
            </button>
          </li>
        </menu>
      </div>
    )



}

export default ContractProfile
