import Link from "next/link";
import { useDelete } from "../../utils/hooks";
import type { RouterOutputs } from "../../utils/trpc";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import BaseCard from "../BaseCard";
import { buildPhoneUrl, formatDate } from "../../utils/function/prod";

export type CardProps = {
  tenant: NonNullable<RouterOutputs["tenants"]["findAll"][number]>;
};

const Card = ({ tenant }: CardProps) => {
  const deleteTenant = useDelete(tenant.id, "tenants");
  return (
    <BaseCard
      withActions={true}
      profileLink={`/inquilinos/${tenant.name}?id=${tenant.id}`}
      editLink={`/inquilinos/editar?id=${tenant.id}`}
      deleteFunc={deleteTenant}
    >
      <FontAwesomeIcon icon="user" size="xl" className="justify-self-center" />
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
      <FontAwesomeIcon icon="phone" size="xl" className="justify-self-center" />
      <a href={buildPhoneUrl(tenant.primaryPhone)}>{tenant.primaryPhone}</a>
      {!!tenant.contracts.length && (
        <>
          <FontAwesomeIcon
            icon="file-contract"
            size="xl"
            className="justify-self-center"
          />
          <Link
            className="grid grid-cols-[17ch_min-content] gap-1.5 hover:text-link hover:underline"
            href={`/contratos/${tenant.contracts.at(0)?.id}`}
            key={tenant.contracts.at(0)?.id}
          >
            <span className="line-clamp-1">
              {formatDate(tenant.contracts.at(0)!.initialDate)}
            </span>
            {tenant.contracts.length > 1 && (
              <span>
                {`+${tenant.contracts.length - 1}`}
              </span>
            )}
          </Link>
        </>
      )}
      {!!tenant.contracts.length && (
        <>
          <FontAwesomeIcon
            icon="house-chimney-window"
            size="xl"
            className="justify-self-center"
          />
          <Link
            className=" grid grid-cols-[17ch_min-content] gap-1.5 hover:text-link hover:underline"
            href={`/casas/${tenant.contracts.at(0)?.house.street}?id=${
              tenant.contracts.at(0)?.house.id
            }`}
            key={tenant.contracts.at(0)?.house.id}
          >
            <span className="line-clamp-1">
              {tenant.contracts.at(0)?.house.number},{" "}
              {tenant.contracts.at(0)?.house.street}
            </span>
            {tenant.contracts.length > 1 && (
              <span>{`+${tenant.contracts.length - 1}`}</span>
            )}
          </Link>
        </>
      )}
    </BaseCard>
  );
};

export default Card;
