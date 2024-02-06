import Link from 'next/link';
import { useDelete, useRestore } from '../../utils/hooks';
import type { RouterOutputs } from '../../utils/trpc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import BaseCard from '../BaseCard';
import {
  buildPhoneUrl,
  buildWhatsappUrl,
  formatDate,
} from '../../utils/function/prod';

export type CardProps = {
  tenant: NonNullable<RouterOutputs['tenants']['findAll'][number]>;
};

const Card = ({ tenant }: CardProps) => {
  const deleteTenant = useDelete(tenant.id, 'tenants');
  const restoreTenant = useRestore(tenant.id, 'tenants');
  const firstContract = tenant.contracts.at(0);
  return (
    <BaseCard
      withActions={true}
      profileLink={`/inquilinos/${tenant.name}?id=${tenant.id}`}
      editLink={`/inquilinos/editar?id=${tenant.id}`}
      deleteFunc={tenant.deleted ? undefined : deleteTenant}
      restoreFunc={tenant.deleted ? restoreTenant : undefined}
    >
      <FontAwesomeIcon icon='user' size='xl' className='justify-self-center' />
      <h3 className='col-start-2 line-clamp-1 text-xl font-semibold capitalize'>
        {tenant.name}
      </h3>
      {firstContract && (
        <>
          <FontAwesomeIcon
            icon='calendar-day'
            size='xl'
            className='justify-self-center'
          />
          <p>
            Vencimento:
            <span className='font-medium '>
              {' '}
              {firstContract.dueDay?.toString().padStart(2, '0')}
            </span>
          </p>
        </>
      )}

      {tenant.primaryPhone && (
        <>
          <FontAwesomeIcon
            icon='phone'
            size='xl'
            className='justify-self-center'
          />
          <a
            href={
              tenant.hasWpp
                ? buildWhatsappUrl(tenant.primaryPhone)
                : buildPhoneUrl(tenant.primaryPhone)
            }
            target={tenant.hasWpp ? '_blank' : '_self'}
            rel={tenant.hasWpp ? 'noreferrer' : undefined}
          >
            {tenant.primaryPhone}
          </a>
        </>
      )}

      {!!firstContract && (
        <>
          <FontAwesomeIcon
            icon='file-contract'
            size='xl'
            className='justify-self-center'
          />
          <Link
            className='grid grid-cols-[17ch_min-content] gap-1.5 hover:text-link hover:underline'
            href={`/contratos/${tenant.contracts.at(0)?.id}`}
            key={tenant.contracts.at(0)?.id}
          >
            <span className='line-clamp-1'>
              {formatDate(firstContract.initialDate)}
            </span>
            {tenant.contracts.length > 1 && (
              <span>{`+${tenant.contracts.length - 1}`}</span>
            )}
          </Link>
        </>
      )}
      {!!firstContract && (
        <>
          <FontAwesomeIcon
            icon='house-chimney-window'
            size='xl'
            className='justify-self-center'
          />
          <Link
            className={`${
              tenant.contracts.length > 1
                ? 'grid grid-cols-[17ch_min-content] gap-1.5'
                : ''
            } hover:text-link hover:underline`}
            href={`/casas/${firstContract.house.street}?id=${firstContract.house.id}`}
            key={firstContract.house.id}
          >
            <span className='line-clamp-1'>
              {firstContract.house.number}, {firstContract.house.street}
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
