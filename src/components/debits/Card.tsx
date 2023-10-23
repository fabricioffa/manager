import Link from 'next/link';
import { useDelete } from '../../utils/hooks';
import type { RouterOutputs } from '../../utils/trpc';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { formatCurrency, formatDate } from '../../utils/function/prod';
import BaseCard from '../BaseCard';

export type CardProps = {
  debit: NonNullable<RouterOutputs['debits']['findAll'][number]>;
};

const Card = ({ debit }: CardProps) => {
  const deleteContract = useDelete(debit.id, 'debits');

  return (
    <BaseCard
      withActions={true}
      profileLink={`/debitos/${debit.id}?id=${debit.id}`}
      editLink={`/debitos/editar?id=${debit.id}`}
      deleteFunc={deleteContract}
    >
      <FontAwesomeIcon icon='user' size='xl' className='justify-self-center' />
      <h3 className='col-start-2 line-clamp-1 text-xl font-semibold capitalize'>
        <Link
          className='hover:text-link hover:underline'
          href={`/inquilinos/${debit.contract.tenant.name}?id=${debit.contract.tenant.id}`}
        >
          {debit.contract.tenant.name}
        </Link>
      </h3>

      <FontAwesomeIcon
        icon='calendar-day'
        size='xl'
        className='justify-self-center'
      />
      <p>
        Vencimento:
        <span className='font-medium'>{formatDate(debit.dueDate)}</span>
      </p>

      <FontAwesomeIcon icon='phone' size='xl' className='justify-self-center' />
      <address>
        <a href='tel:5585988044019'>{debit.contract.tenant.primaryPhone}</a>
      </address>

      <FontAwesomeIcon
        icon='exclamation'
        size='xl'
        className='justify-self-center'
      />
      <p className='text-red-500'>
        {'Débito: ' + formatCurrency(debit.amount)}
      </p>

      <FontAwesomeIcon
        icon='file-contract'
        size='xl'
        className='justify-self-center'
      />
      <p>
        Contrato:
        <Link
          className='hover:text-link hover:underline'
          href={`/contratos/${debit.contract.id}`}
        >
          <FontAwesomeIcon icon='magnifying-glass' size='lg' className='ml-1' />
        </Link>
      </p>

      <FontAwesomeIcon
        icon='house-chimney-window'
        size='xl'
        className='justify-self-center'
      />
      <Link
        className='hover:text-link hover:underline'
        href={`/casas/${debit.contract.house.street}?id=${debit.contract.house.id}`}
      >
        {debit.contract.house.street + ', ' + debit.contract.house.number}
      </Link>
      <div className='mt-auto flex gap-2 pt-4'>
        <Link
          href={`/gerar-recibo?id=${debit.id}`}
          className='grow rounded-lg border
        border-blue-700 bg-blue-400 text-center font-semibold text-white'
        >
          Gerar Boleto
        </Link>
        <Link
          href={`/`}
          className='grow rounded-lg border
        border-blue-700 bg-blue-400 text-center font-semibold text-white'
        >
          Editar
        </Link>
      </div>
    </BaseCard>
  );
};

export default Card;
