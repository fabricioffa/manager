import Link from 'next/link';
import { useDelete, useRestore } from '../../utils/hooks';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import type { RouterOutputs } from '../../utils/trpc';
import BaseCard from '../BaseCard';

export type CardProps = {
  house: NonNullable<RouterOutputs['houses']['findAll'][number]>;
};

const Card = ({ house }: CardProps) => {
  const deleteHouse = useDelete(house.id, 'houses');
  const restoreHouse = useRestore(house.id, 'houses');
  return (
    <BaseCard
      withActions={true}
      profileLink={`/casas/${house.street}?id=${house.id}`}
      editLink={`/casas/editar?id=${house.id}`}
      deleteFunc={house.deleted ? undefined : deleteHouse}
      restoreFunc={house.deleted ? restoreHouse : undefined}
    >
      <FontAwesomeIcon
        icon='location-dot'
        size='xl'
        className='justify-self-center'
      />
      <h3 className='col-start-2 line-clamp-1 text-xl font-semibold capitalize'>{`${house.number}, ${house.street}`}</h3>
      <FontAwesomeIcon
        icon='house-chimney-window'
        size='xl'
        className='justify-self-center'
      />
      <p className='capitalize'>{house.type}</p>
      <FontAwesomeIcon
        icon='droplet'
        size='xl'
        className='justify-self-center'
      />
      <p className='line-clamp-1'>{house.waterId}</p>
      <FontAwesomeIcon icon='bolt' size='xl' className='justify-self-center' />
      <p className='line-clamp-1'>{house.electricityId}</p>
      {!!house.contracts.length && (
        <>
          <FontAwesomeIcon
            icon='file-contract'
            size='xl'
            className='justify-self-center'
          />
          <Link
            className='group hover:text-link hover:underline'
            href={`/contratos/${house.contracts.at(0)?.id}`}
          >
            Contrato:
            <FontAwesomeIcon
              icon='magnifying-glass'
              className='ml-2 group-hover:scale-110'
            />
          </Link>
        </>
      )}
      {!!house.contracts.length && (
        <>
          <FontAwesomeIcon
            icon='user'
            size='xl'
            className='justify-self-center'
          />
          <Link
            className='hover:text-link hover:underline'
            href={`/inquilinos/${house.contracts.at(0)?.tenant.name}?id=${
              house.contracts.at(0)?.tenant.id
            }`}
          >
            Inquilino: {house.contracts.at(0)?.tenant.name.split(' ').at(0)}
          </Link>
        </>
      )}
    </BaseCard>
  );
};

export default Card;
