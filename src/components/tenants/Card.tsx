import Link from "next/link";
import { useDelete } from "../../utils/hooks";
import type { RouterOutputs } from "../../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export type CardProps = {
  tenant: NonNullable<RouterOutputs["tenants"]["findAll"][number]>;
};

const Card = ({ tenant }: CardProps) => {
  const deleteTenant = useDelete(tenant.id, "tenants");

  return (
    <li className="grid rounded-md bg-white/10 p-4 text-lg shadow-card ring">
      <div className="grid grid-cols-[1.9rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        <FontAwesomeIcon
          icon="user"
          size="xl"
          className="justify-self-center"
        />
        <h3 className="col-start-2 line-clamp-1 text-xl font-semibold capitalize">
          {tenant.name}
        </h3>
        {tenant.contracts && (
          <>
            <FontAwesomeIcon
              icon="calendar-day"
              size="xl"
              className="justify-self-center"
            />
            <p>
              Vencimentos:
              <span className="font-medium ">
                {" "}
                {tenant.contracts
                  .map(({ dueDay }) => dueDay?.toString().padStart(2, "0"))
                  .join(" ,")}
              </span>
            </p>
          </>
        )}
        <FontAwesomeIcon
          icon="phone"
          size="xl"
          className="justify-self-center"
        />
        <address>
          <a href="tel:5585988044019">{tenant.primaryPhone}</a>
        </address>
        {/* { tenant.debit &&
          <>
            <FontAwesomeIcon icon="exclamation" size="xl" className="justify-self-center" />
            <p className="text-red-500">{'Débito: ' + formatCurrency(tenant.debit)}</p>
          </>
        } */}
        {!!tenant.contracts.length && (
          <>
            <FontAwesomeIcon
              icon="file-contract"
              size="xl"
              className="justify-self-center"
            />
            <div className="flex gap-2">
              {" "}
              Contratos atuais:
              {tenant.contracts.map((contract, i) => (
                <Link
                  className="hover:text-link hover:underline"
                  href={`/contratos/${contract.id}`}
                  key={contract.id}
                >
                  <div className="relative">
                    <span className="absolute left-6  text-xs">#{i + 1}</span>
                    <FontAwesomeIcon
                      icon="magnifying-glass"
                      size="lg"
                      className="ml-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
        {!!tenant.contracts.length && (
          <>
            <FontAwesomeIcon
              icon="house-chimney-window"
              size="xl"
              className="justify-self-center"
            />
            <div className="flex gap-2">
              <p>Casas atuais:</p>
              {tenant.contracts.map(({ house }, i) => (
                <Link
                  className="hover:text-link hover:underline"
                  href={`/casas/${house.street}?id=${house.id}`}
                  key={house.id}
                >
                  <div className="relative">
                    <span className="absolute left-6  text-xs">#{i + 1}</span>
                    <FontAwesomeIcon
                      icon="magnifying-glass"
                      size="lg"
                      className="ml-1"
                    />
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
      <div className="mt-auto flex gap-2 pt-4">
        <Link
          href={`/inquilinos/${tenant.name}?id=${tenant.id}`}
          className="grow rounded-lg border
        border-blue-700 bg-blue-400 text-center font-semibold text-white"
        >
          Ver
        </Link>
        <Link
          href={`/inquilinos/editar?id=${tenant.id}`}
          className="grow rounded-lg border
        border-blue-700 bg-blue-400 text-center font-semibold text-white"
        >
          Editar
        </Link>
        <button
          onClick={() => deleteTenant()}
          className="grow rounded-lg border border-red-700 bg-red-400 font-semibold text-white"
        >
          Excluir
        </button>
      </div>
    </li>
  );
};

export default Card;
