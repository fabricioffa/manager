import Link from 'next/link';
import { useRouter } from 'next/router';
import { trpc } from '../../utils/trpc';
import { useDelete } from '../../utils/hooks';
import { formatCurrency } from '../../utils/function/prod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Loading } from '../../components/Loading';

const HouseProfile = () => {
  const {
    query: { id },
  } = useRouter();
  const stringId = id as string;

  const {
    data: house,
    isLoading,
    isError,
  } = trpc.houses.findOne.useQuery({ id: stringId });
  const deleteHouse = useDelete(stringId, 'houses');

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>;

  if (isLoading) return <Loading />;

  if (house)
    return (
      <div className='relative mx-auto px-6'>
        <h1 className='mb-10 text-center text-4xl capitalize'>{`${house.street}, ${house.number}`}</h1>

        <div className='mx-auto w-fit rounded-md border p-4 shadow-card'>
          <ul className='space-y-1'>
            <li>
              <span className='font-bold'>Complemento: </span>
              {house.complement}
            </li>
            <li>
              <span className='font-bold'>Bairo: </span>
              {house.neighborhood}
            </li>
            <li>
              <span className='font-bold'>Cidade: </span>
              {house.city}
            </li>
            <li>
              <span className='font-bold'>Tipo: </span>
              <span className='capitalize'>{house.type}</span>
            </li>
            <li>
              <span className='font-bold'>IPTU: </span>
              {house.iptu}
            </li>
            <li>
              <span className='font-bold'>Número da Instalação: </span>
              {house.electricityId}
            </li>
            <li>
              <span className='font-bold'>Hidrômetro: </span>
              {house.waterId}
            </li>
            {!!house.description && (
              <li>
                <span className='font-bold'>Descrição: </span>
                {house.description}
              </li>
            )}
            <ul className='space-y-1'>
              {!!house.contracts.length && (
                <li>
                  <span className='font-bold'>Contratos: </span>
                  {house.contracts.map((contract) => (
                    <ul
                      className={`relative mr-5 grid w-fit grid-flow-col gap-3 pl-3
                          after:absolute after:-right-1.5 after:top-1/2  after:h-4 after:w-4
                          after:-translate-y-1/2 after:translate-x-full after:rounded-full last:child:!border-r-0 last:child:!pr-0
                          even:child:border-x even:child:border-black even:child:px-3 ${
                            contract.endingDate
                              ? 'after:bg-red-500'
                              : 'after:bg-green-500'
                          }`}
                      key={contract.id}
                    >
                      <li>
                        <Link href={`/contratos/${contract.id}`}>
                          <FontAwesomeIcon
                            icon='magnifying-glass'
                            className='hover:scale-110 hover:text-link'
                          />
                        </Link>
                      </li>
                      <li>
                        <span className='font-bold'>Vencimento: </span>{' '}
                        {contract.dueDay}
                      </li>
                      <li>
                        <span className='font-bold'>Mensalidade: </span>{' '}
                        {formatCurrency(contract.rent)}
                      </li>
                      <li>
                        <Link
                          href={`/inquilinos/${contract.tenant.name}?id=${contract.tenant.id}`}
                          className='hover:text-link hover:underline'
                        >
                          <span className='font-bold'>Inquilino: </span>{' '}
                          {contract.tenant.name}
                        </Link>
                      </li>
                    </ul>
                  ))}
                </li>
              )}
            </ul>
          </ul>
        </div>

        <menu className='flex items-center justify-around pt-10'>
          <li>
            <Link
              href={`editar?id=${house.id}`}
              className='grow rounded-lg border
            border-blue-700 bg-blue-400 px-8 py-2 text-center font-semibold text-white'
            >
              Editar
            </Link>
          </li>
          <li>
            <button
              onClick={() => deleteHouse()}
              className='grow rounded-lg border border-red-700
             bg-red-400 px-8 py-2 font-semibold text-white'
            >
              Excluir
            </button>
          </li>
        </menu>
      </div>
    );
};

export default HouseProfile;
