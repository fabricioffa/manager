import Link from 'next/link';
import { useDelete, useRestore } from '../../utils/hooks';
import type { RouterOutputs } from '../../utils/trpc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCurrency, formatDate } from '../../utils/function/prod';
import BaseCard from '../BaseCard';

export type CardProps = {
  contract: NonNullable<RouterOutputs['contracts']['findAll'][number]>;
};

const Card = ({ contract }: CardProps) => {
  const deleteContract = useDelete(contract.id, 'contracts');
  const restoreContract = useRestore(contract.id, 'contracts');
  
  return (
    <BaseCard
      withActions={true}
      profileLink={`/contratos/${contract.id}?id=${contract.id}`}
      editLink={`/contratos/editar?id=${contract.id}`}
      deleteFunc={contract.deleted ? undefined : deleteContract}
      restoreFunc={contract.deleted ? restoreContract : undefined}
    >
      <FontAwesomeIcon icon='user' size='xl' className='justify-self-center' />
      <Link
        href={`/inquilinos/${contract.tenant.name}?id=${contract.tenant.id}`}
        className='line-clamp-1 hover:text-link'
      >
        <h3 className='col-start-2 line-clamp-1 text-lg font-semibold capitalize'>
          {contract.tenant.name}
        </h3>
      </Link>
      <FontAwesomeIcon
        icon='house-chimney-window'
        size='lg'
        className='justify-self-center'
      />
      <Link
        href={`/casas/${contract.house.street}?id=${contract.house.id}`}
        className='line-clamp-1 hover:text-link'
      >
        <p>{`${contract.house.number}, ${contract.house.street}`}</p>
      </Link>
      <FontAwesomeIcon
        icon='circle-dollar-to-slot'
        size='lg'
        className='justify-self-center'
      />
      <p>Aluguel: {formatCurrency(contract.rent)}</p>
      <FontAwesomeIcon
        icon='calendar-day'
        size='lg'
        className='justify-self-center'
      />
      <p>Início: {formatDate(contract.initialDate)}</p>
      <FontAwesomeIcon
        icon='calendar-day'
        size='lg'
        className='justify-self-center'
      />
      <p>Vencimento: {contract.dueDay.toString().padStart(2, '0')}</p>
      {!!contract.endingDate && (
        <>
          <FontAwesomeIcon
            icon='calendar-day'
            size='lg'
            className='justify-self-center'
          />
          <p>Término: {formatDate(contract.endingDate)}</p>
        </>
      )}
      <FontAwesomeIcon
        icon='droplet'
        size='lg'
        className='justify-self-center'
      />
      <p className='line-clamp-1'>{contract.waterId}</p>
      <FontAwesomeIcon icon='bolt' size='lg' className='justify-self-center' />
      <p className='line-clamp-1'>{contract.electricityId}</p>
    </BaseCard>
  );
};

export default Card;
