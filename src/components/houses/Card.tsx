import Link from "next/link";
import { useDelete } from "../../utils/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { RouterOutputs } from "../../utils/trpc";

export type CardProps = {
  house: NonNullable<RouterOutputs['houses']['findAll'][number]>
}

const Card = ({ house }: CardProps) => {
  const deleteHouse = useDelete(house.id, 'houses')

  return (
    <li className="grid rounded-md shadow-card text-lg p-4">
      <div className="grid grid-cols-[1.5rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        <FontAwesomeIcon icon="location-dot" size="xl" className="justify-self-center" />
        <h3 className="col-start-2 text-xl font-semibold capitalize line-clamp-1">{`${house.street}, ${house.number}`}</h3>
        <FontAwesomeIcon icon="house-chimney-window" size="xl" className="justify-self-center" />
        <p className="capitalize">{house.type}</p>
        <FontAwesomeIcon icon="droplet" size="xl" className="justify-self-center" />
        <p className="line-clamp-1">{house.waterId}</p>
        <FontAwesomeIcon icon="bolt" size="xl" className="justify-self-center" />
        <p className="line-clamp-1">{house.electricityId}</p>
        {
          !!house.contracts.length &&
          <>
            <FontAwesomeIcon icon="file-contract" size="xl" className="justify-self-center" />
            <Link className="group hover:text-link hover:underline" href={`/contratos/${house.contracts.at(0)?.id}`}>
              Contrato:
              <FontAwesomeIcon icon='magnifying-glass' className="ml-2 group-hover:scale-110" />
            </Link>
          </>
        }
        {
          !!house.contracts.length &&
          <>
            <FontAwesomeIcon icon="user" size="xl" className="justify-self-center" />
            <Link className="hover:text-link hover:underline"
              href={`/inquilinos/${house.contracts.at(0)?.tenant.name}?id=${house.contracts.at(0)?.tenant.id}`}>
              Inquilino: {house.contracts.at(0)?.tenant.name.split(' ').at(0)}
            </Link>
          </>
        }
      </div>
      <div className="flex gap-2 mt-auto pt-4">
        <Link href={`/casas/${house.street}?id=${house.id}`} className="grow bg-blue-400 rounded-lg
          border border-blue-700 text-white text-center font-semibold">
          Ver
        </Link>
        <Link href={`/casas/editar?id=${house.id}`} className="grow bg-blue-400 rounded-lg
          border border-blue-700 text-white text-center font-semibold">
          Editar
        </Link>
        <button onClick={() => deleteHouse()}
          className="grow bg-red-400 rounded-lg border border-red-700 text-white font-semibold">
          Excluir
        </button>
      </div>
    </li>
  )
}

export default Card;
