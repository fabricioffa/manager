import Link from "next/link";
import { useDelete } from "../../utils/hooks";
import type { RouterOutputs } from "../../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatCurrency, formatDate } from "../../utils/functions";

export type CardProps = {
  contract: NonNullable<RouterOutputs['contracts']['findAll'][number]>,
}

const Card = ({ contract }: CardProps) => {

  const deleteContract = useDelete(contract.id, 'contracts')

  return (
    <li className="grid bg-tenant border rounded-md shadow-inner text-lg p-4">
      <div className="grid grid-cols-[1.5rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        <FontAwesomeIcon icon="user" size="xl" className="justify-self-center" />
        <Link href={`/inquilinos/${contract.tenant.name}?id=${contract.tenant.id}`} className="hover:text-link">
          <h3 className="col-start-2 text-xl font-semibold capitalize line-clamp-1">{contract.tenant.name}</h3>
        </Link>
        <FontAwesomeIcon icon="house-chimney-window" size="xl" className="justify-self-center" />
        <Link href={`/casas/${contract.house.street}?id=${contract.house.id}`} className="hover:text-link">
          <p>{`${contract.house.street}, ${contract.house.number}`}</p>
        </Link>
        <FontAwesomeIcon icon="circle-dollar-to-slot" size="xl" className="justify-self-center" />
        <p>Aluguel: {formatCurrency(contract.rent)}</p>
        <FontAwesomeIcon icon="calendar-day" size="xl" className="justify-self-center" />
        <p>Início: {formatDate(contract.initialDate)}</p>
        {
          !!contract.endingDate &&
          <>
            <FontAwesomeIcon icon="calendar-day" size="xl" className="justify-self-center" />
            <p>Término: {formatDate(contract.endingDate)}</p>
          </>
        }
      </div>
      <div className="flex gap-2 mt-auto pt-4">
        <Link href={`/contratos/${contract.id}?id=${contract.id}`} className="grow bg-blue-400 rounded-lg
        border border-blue-700 text-white text-center font-semibold">
          Ver
        </Link>
        <Link href={`/contratos/editar?id=${contract.id}`} className="grow bg-blue-400 rounded-lg
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
