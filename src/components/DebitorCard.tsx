import type { RouterOutputs } from "../utils/trpc";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatCurrency, formatDate } from "../utils/function/prod";

export type CardProps = {
  debit: NonNullable<RouterOutputs['debits']['lateDebits'][number]>,
}

const DebitorCard = ({ debit }: CardProps) => {
  return (
    <div className="grid rounded-md shadow-card text-lg p-4">
      <div className="grid grid-cols-[1.5rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        <FontAwesomeIcon icon="user" size="xl" className="justify-self-center" />
        <h3 className="col-start-2 text-xl font-semibold capitalize line-clamp-1">
          <Link className="hover:text-link hover:underline" href={`/inquilinos/${debit.contract.tenant.name}?id=${debit.contract.tenant.id}`}>
            {debit.contract.tenant.name}
          </Link>
        </h3>

        <FontAwesomeIcon icon="calendar-day" size="xl" className="justify-self-center" />
        <p>Vencimento:
          <span className="font-medium">{formatDate(debit.dueDate)}</span>
        </p>

        <FontAwesomeIcon icon="phone" size="xl" className="justify-self-center" />
        <address><a href="tel:5585988044019">{debit.contract.tenant.primaryPhone}</a></address>

        <FontAwesomeIcon icon="exclamation" size="xl" className="justify-self-center" />
        <p className="text-red-500">{'Débito: ' + formatCurrency(debit.amount)}</p>

        <FontAwesomeIcon icon="file-contract" size="xl" className="justify-self-center" />
        <p>Contrato:
          <Link className="hover:text-link hover:underline" href={`/contratos/${debit.contract.id}`}>
            <FontAwesomeIcon icon='magnifying-glass' size="lg" className="ml-1" />
          </Link>
        </p>

        <FontAwesomeIcon icon="house-chimney-window" size="xl" className="justify-self-center" />
        <Link className="hover:text-link hover:underline" href={`/casas/${debit.contract.house.street}?id=${debit.contract.house.id}`}>
          {debit.contract.house.street + ', ' + debit.contract.house.number}
        </Link>

      </div>
      <div className="flex gap-2 mt-auto pt-4">
        <Link href={`/gerar-recibo?id=${debit.id}`} className="grow bg-blue-400 rounded-lg
        border border-blue-700 text-white text-center font-semibold">
          Gerar Boleto
        </Link>
        <Link href={`/`} className="grow bg-blue-400 rounded-lg
        border border-blue-700 text-white text-center font-semibold">
          Editar
        </Link>
      </div>
    </div>
  )
}

export default DebitorCard;
