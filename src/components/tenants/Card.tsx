import Link from "next/link";
import { useDelete } from "../../utils/hooks";
import { RouterOutputs } from "../../utils/trpc";


export type CardProps = {
  tenant: NonNullable <RouterOutputs['tenants']['findAll'][number]>,
}

const Card = ({ tenant }: CardProps) => {
  const deleteTenant = useDelete(tenant.id, 'tenants')

  return (
    <li className="grid bg-tenant border rounded-md shadow-inner text-lg p-4">
      <div className="grid grid-cols-[1.5rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        <i className="fa-solid fa-user fa-xl justify-self-center"></i>
        <h3 className="col-start-2 text-xl font-semibold capitalize line-clamp-1">{tenant.name}</h3>
        <i className="fa-solid fa-phone fa-xl justify-self-center"></i>
        <address><a href="tel:5585988044019">{ tenant.primaryPhone}</a></address>
        {!!tenant.debit  && <i className="fa-solid fa-exclamation fa-2xl justify-self-center"></i>}
        {!!tenant.debit  && <p className="text-red-500">{'Debito: ' +  tenant.debit }</p>}
        <i className="fa-solid fa-file-contract fa-xl justify-self-center"></i>
        <p><a href="#">Contrato atual: #45</a></p>
        <i className="fa-solid fa-house-chimney-window fa-xl justify-self-center"></i>
        <p><a href="#">Casa atual: #25</a></p>
      </div>
      <div className="flex gap-2 mt-auto pt-4">
        <Link href={`/inquilinos/${tenant.name}?id=${tenant.id}`} className="grow bg-blue-400 rounded-lg
        border border-blue-700 text-white text-center font-semibold">
          Ver
        </Link>
        <Link href={`/inquilinos/editar?id=${tenant.id}`} className="grow bg-blue-400 rounded-lg
        border border-blue-700 text-white text-center font-semibold">
          Editar
        </Link>
        <button onClick={() => deleteTenant()}
          className="grow bg-red-400 rounded-lg border border-red-700 text-white font-semibold">
          Excluir
        </button>
      </div>
    </li>
  )
}

export default Card;
