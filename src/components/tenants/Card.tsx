import Link from "next/link";
import { useDelete } from "../../utils/hooks";
import type { RouterOutputs } from "../../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { formatCurrency } from "../../utils/functions";


export type CardProps = {
  tenant: NonNullable<RouterOutputs['tenants']['findAll'][number]>,
}

const Card = ({ tenant }: CardProps) => {
  const deleteTenant = useDelete(tenant.id, 'tenants')

  return (
    <li className="grid rounded-md shadow-card text-lg p-4">
      <div className="grid grid-cols-[1.5rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        <FontAwesomeIcon icon="user" size="xl" className="justify-self-center" />
        <h3 className="col-start-2 text-xl font-semibold capitalize line-clamp-1">{tenant.name}</h3>
        {tenant.contracts &&
          <>
            <FontAwesomeIcon icon="calendar-day" size="xl" className="justify-self-center" />
            <p>Vencimentos:
              <span className="font-medium "> {tenant.contracts.map(({ dueDay }) => dueDay?.toString().padStart(2, '0')).join(' ,')}</span>
            </p>
          </>
        }
        <FontAwesomeIcon icon="phone" size="xl" className="justify-self-center" />
        <address><a href="tel:5585988044019">{tenant.primaryPhone}</a></address>
        { tenant.debit &&
          <>
            <FontAwesomeIcon icon="exclamation" size="xl" className="justify-self-center" />
            <p className="text-red-500">{'Debito: ' + formatCurrency(tenant.debit)}</p>
          </>
        }
        {tenant.contracts &&
          <>
            <FontAwesomeIcon icon="file-contract" size="xl" className="justify-self-center" />
            <div className="flex gap-2"> Contratos atuais:
              {
                tenant.contracts.map((contract, i) => (
                  <Link className="hover:text-link hover:underline" href={`/contratos/${contract.id}`} key={contract.id}>
                    <div className="relative">
                      <span className="absolute left-6  text-xs">#{i + 1}</span>
                      <FontAwesomeIcon icon='magnifying-glass' size="lg" className="ml-1"  />
                    </div>
                  </Link>
                ))
              }
            </div>
          </>
        }
        {tenant.contracts &&
          <>
            <FontAwesomeIcon icon="house-chimney-window" size="xl" className="justify-self-center" />
            <p className="flex gap-2"> Casas atuais:
              {
                tenant.contracts.map(({ house }, i) => (
                  <Link className="hover:text-link hover:underline" href={`/casas/${house.street}?id=${house.id}`} key={house.id}>
                    <div className="relative">
                      <span className="absolute left-6  text-xs">#{i + 1}</span>
                      <FontAwesomeIcon icon='magnifying-glass' size="lg" className="ml-1" />
                    </div>
                  </Link>
                ))
              }
            </p>
          </>
        }
        <FontAwesomeIcon icon="droplet" size="xl" className="justify-self-center" />
        <p className="line-clamp-1">{tenant.waterId}</p>
        <FontAwesomeIcon icon="bolt" size="xl" className="justify-self-center" />
        <p className="line-clamp-1">{tenant.electricityId}</p>
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
