import Link from "next/link";
import { ContractWithRelations } from "../../server/schemas/contracts.schemas";
import { useDelete } from "../../utils/hooks";

const dateToString = (date: Date) => new Intl.DateTimeFormat('pt-BR').format(date)

export type CardProps = {
  contract: ContractWithRelations,
}

const Card = ({ contract }: CardProps) => {

  const deleteContract = useDelete(contract.id, 'contracts')

  return (
    <li className="grid bg-tenant border rounded-md shadow-inner text-lg p-4">
      <div className="grid grid-cols-[1.5rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        <i className="fa-solid fa-user fa-xl justify-self-center"></i>
        <h3 className="col-start-2 text-xl font-semibold capitalize line-clamp-1">{contract.tenant.name}</h3>
        <i className="fa-solid fa-house-chimney-window fa-xl justify-self-center"></i>
        <p>{ `${contract.house.street}, ${contract.house.number}` }</p>
        <i className="fa-solid fa-house-chimney-window fa-xl justify-self-center"></i>
        <p>Aluguel: { Number(contract.rent)}</p>
        <i className="fa-solid fa-house-chimney-window fa-xl justify-self-center"></i>
        <p>Início: { dateToString(contract.initialDate)}</p>
      </div>
      <div className="flex gap-2 mt-auto pt-4">
        <Link href={`${contract.id}?id=${contract.id}`} className="grow bg-blue-400 rounded-lg
        border border-blue-700 text-white text-center font-semibold">
          Ver
        </Link>
        <Link href={`editar?id=${contract.id}`} className="grow bg-blue-400 rounded-lg
        border border-blue-700 text-white text-center font-semibold">
          Editar
        </Link>
        <button onClick={() => deleteContract()}
          className="grow bg-red-400 rounded-lg border border-red-700 text-white font-semibold">
          Excluir
        </button>
      </div>
    </li>
  )
}

export default Card;
