import Link from "next/link";
import { useDelete } from "../../utils/hooks";
import type { RouterOutputs } from "../../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatCurrency, formatDate } from "../../utils/function/prod";

export type CardProps = {
  contract: NonNullable<RouterOutputs["contracts"]["findAll"][number]>;
};

const Card = ({ contract }: CardProps) => {
  const deleteContract = useDelete(contract.id, "contracts");

  return (
    <li className="grid rounded-md bg-white/10 p-4 text-lg shadow-card ring">
      <div className="grid grid-cols-[1.9rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        <FontAwesomeIcon
          icon="user"
          size="xl"
          className="justify-self-center"
        />
        <Link
          href={`/inquilinos/${contract.tenant.name}?id=${contract.tenant.id}`}
          className="line-clamp-1 hover:text-link"
        >
          <h3 className="col-start-2 line-clamp-1 text-lg font-semibold capitalize">
            {contract.tenant.name}
          </h3>
        </Link>
        <FontAwesomeIcon
          icon="house-chimney-window"
          size="lg"
          className="justify-self-center"
        />
        <Link
          href={`/casas/${contract.house.street}?id=${contract.house.id}`}
          className="line-clamp-1 hover:text-link"
        >
          <p>{`${contract.house.number}, ${contract.house.street}`}</p>
        </Link>
        <FontAwesomeIcon
          icon="circle-dollar-to-slot"
          size="lg"
          className="justify-self-center"
        />
        <p>Aluguel: {formatCurrency(contract.rent)}</p>
        <FontAwesomeIcon
          icon="calendar-day"
          size="lg"
          className="justify-self-center"
        />
        <p>Início: {formatDate(contract.initialDate)}</p>
        <FontAwesomeIcon
          icon="calendar-day"
          size="lg"
          className="justify-self-center"
        />
        <p>Vencimento: {contract.dueDay}</p>
        {!!contract.endingDate && (
          <>
            <FontAwesomeIcon
              icon="calendar-day"
              size="lg"
              className="justify-self-center"
            />
            <p>Término: {formatDate(contract.endingDate)}</p>
          </>
        )}
        <FontAwesomeIcon
          icon="droplet"
          size="lg"
          className="justify-self-center"
        />
        <p className="line-clamp-1">{contract.waterId}</p>
        <FontAwesomeIcon
          icon="bolt"
          size="lg"
          className="justify-self-center"
        />
        <p className="line-clamp-1">{contract.electricityId}</p>
      </div>
      <div className="mt-auto flex gap-2 pt-4">
        <Link
          href={`/contratos/${contract.id}?id=${contract.id}`}
          className="grow rounded-lg border
        border-blue-700 bg-blue-400 text-center font-semibold text-white"
        >
          Ver
        </Link>
        <Link
          href={`/contratos/editar?id=${contract.id}`}
          className="grow rounded-lg border
        border-blue-700 bg-blue-400 text-center font-semibold text-white"
        >
          Editar
        </Link>
        <button
          onClick={() => deleteContract()}
          className="grow rounded-lg border border-red-700 bg-red-400 font-semibold text-white"
        >
          Excluir
        </button>
      </div>
    </li>
  );
};

export default Card;
