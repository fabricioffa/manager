import { House } from "@prisma/client";
import Link from "next/link";
import { useDelete } from "../../utils/hooks";

export type CardProps = {
  house: House
}

const Card = ({ house }: CardProps) => {
  const deleteHouse = useDelete(house.id, 'houses')

  return (
    <li className="grid bg-house border rounded-md shadow-inner text-lg p-4">
      <div className="grid grid-cols-[1.5rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        <i className="fa-solid fa-house-chimney-window fa-xl justify-self-center"></i>
        <h3 className="col-start-2 text-xl font-semibold capitalize line-clamp-1">{`${house.street}, ${house.number}`}</h3>
        <i className="fa-solid fa-phone fa-xl justify-self-center"></i>
        <p>{ house.type}</p>
        <i className="fa-solid fa-exclamation fa-2xl justify-self-center"></i>
        <p className="line-clamp-1">{ house.waterId }</p>
        <i className="fa-solid fa-exclamation fa-2xl justify-self-center"></i>
        <p className="line-clamp-1">{ house.electricityId }</p>
        <i className="fa-solid fa-file-contract fa-xl justify-self-center"></i>
        <p><a href="#">Contrato atual: #45</a></p>
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
