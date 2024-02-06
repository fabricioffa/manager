import type { RouterOutputs } from '../utils/trpc';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  buildPhoneUrl,
  buildWhatsappUrl,
  formatCurrency,
  formatDate,
} from '../utils/function/prod';

export type CardProps = {
  debit: NonNullable<RouterOutputs['debits']['lateDebits'][number]>;
};

const DebitorCard = ({ debit }: CardProps) => {
  return (
    <div className='grid min-h-[20rem] rounded-md bg-white/10 p-4 text-lg shadow-card ring'>
      <div className='grid grid-cols-[1.9rem_1fr] grid-rows-[3rem_auto] items-center gap-2'>
        <FontAwesomeIcon
          icon='user'
          size='xl'
          className='justify-self-center'
        />
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
          Venci.:{' '}
          <span className='font-medium'>{formatDate(debit.dueDate)}</span>
        </p>

        {debit.contract.tenant.primaryPhone && (
          <>
            <FontAwesomeIcon
              icon='phone'
              size='xl'
              className='justify-self-center'
            />
            <address>
              <a
                href={
                  debit.contract.tenant.hasWpp
                    ? buildWhatsappUrl(debit.contract.tenant.primaryPhone)
                    : buildPhoneUrl(debit.contract.tenant.primaryPhone)
                }
                target={debit.contract.tenant.hasWpp ? '_blank' : '_self'}
                rel={debit.contract.tenant.hasWpp ? 'noreferrer' : undefined}
              >
                {debit.contract.tenant.primaryPhone}
              </a>
            </address>
          </>
        )}

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
            <FontAwesomeIcon
              icon='magnifying-glass'
              size='lg'
              className='ml-1'
            />
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
      </div>
      <div className='mt-auto flex gap-2 pt-4'>
        <Link
          href={`/gerar-recibo?id=${debit.id}`}
          className='grow rounded-lg border border-blue-700 bg-blue-400 text-center font-semibold text-white dark:bg-link-700'
        >
          Gerar Boleto
        </Link>
        {/* <Link
          href={`/`}
          className='grow rounded-lg border border-blue-700 bg-blue-400 text-center font-semibold text-white dark:bg-link-700'
        >
          Editar
        </Link> */}
      </div>
    </div>
  );
};

export default DebitorCard;
