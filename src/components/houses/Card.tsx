import Link from "next/link";
import { useDelete } from "../../utils/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { RouterOutputs } from "../../utils/trpc";

export type CardProps = {
  house: NonNullable<RouterOutputs['houses']['findAll'][number]>
}

const Card = ({ house }: CardProps) => {
  const deleteHouse = useDelete(house.id, 'houses')

  return (
    <li className="grid bg-house border rounded-md shadow-inner text-lg p-4">
      <div className="grid grid-cols-[1.5rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        <FontAwesomeIcon icon="location-dot" size="xl" className="justify-self-center" />
        <h3 className="col-start-2 text-xl font-semibold capitalize line-clamp-1">{`${house.street}, ${house.number}`}</h3>
        <FontAwesomeIcon icon="house-chimney-window" size="xl" className="justify-self-center" />
        <p className="capitalize">{ house.type}</p>
        <FontAwesomeIcon icon="droplet" size="xl" className="justify-self-center" />
        <p className="line-clamp-1">{ house.waterId }</p>
        <FontAwesomeIcon icon="bolt" size="xl" className="justify-self-center" />
        <p className="line-clamp-1">{ house.electricityId }</p>
        <FontAwesomeIcon icon="file-contract" size="xl" className="justify-self-center" />
        <p className="flex gap-2"> Contrato atual:
          <Link className="hover:text-link hover:underline"  href={`/contratos/${house.contracts.at(0)?.id}`} key={house.contracts.at(0)?.id}>#1</Link>
        </p>
      </div>
      <div className="flex gap-2 mt-auto pt-4">
        <Link href={`casas/${house.street}?id=${house.id}`} className="grow bg-blue-400 rounded-lg
          border border-blue-700 text-white text-center font-semibold">
          Ver
        </Link>
        <Link href={`casas/editar?id=${house.id}`} className="grow bg-blue-400 rounded-lg
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
