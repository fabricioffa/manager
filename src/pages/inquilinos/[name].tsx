import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDelete } from '../../utils/hooks';
import { trpc } from '../../utils/trpc';
import { formatCpf, formatCurrency } from '../../utils/function/prod';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Loading } from '../../components/Loading';

const TenantProfile = () => {
  const {
    query: { id },
  } = useRouter(); //TODO: USE ZOD
  const stringId = id as string;

  const {
    data: tenant,
    isLoading,
    isError,
  } = trpc.tenants.findOne.useQuery({ id: stringId });
  const deleteTenant = useDelete(stringId, 'tenants');

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>;

  if (isLoading) return <Loading />;

  if (tenant)
    return (
      <div className='relative mx-auto px-6'>
        <h1 className='text-center text-4xl capitalize'>{tenant.name}</h1>

        <div className='mt-20 flex flex-wrap justify-around gap-20 child:min-w-[22.5rem] child:flex-1'>
          <div className='rounded-md border p-4 shadow-card'>
            <h2 className='mb-7 text-center text-2xl capitalize'>
              Informações Pessoais
            </h2>
            <ul className='space-y-1'>
              <li>
                <span className='font-bold uppercase'>RG: </span>
                {tenant?.rg} /{' '}
                <span className='uppercase'>{tenant.rgEmitter}</span>
              </li>
              <li>
                <span className='font-bold uppercase'>CPF: </span>
                {formatCpf(tenant.cpf)}
              </li>
              <li>
                <span className='font-bold capitalize'>Estado Civil: </span>
                <span className='capitalize'>{tenant.maritalStatus}</span>
              </li>
              <li>
                <span className='font-bold capitalize'>Profissão: </span>
                <span className='capitalize'>{tenant.profession}</span>
              </li>
              {tenant.obs && (
                <li>
                  <span className='font-bold capitalize'>Observação: </span>
                  <span className='line-clamp-3 capitalize'>{tenant.obs}</span>
                </li>
              )}
              <li>
                <span className='font-bold capitalize'>
                  Telefone Principal:{' '}
                </span>
                {tenant.primaryPhone}
              </li>
              {tenant.secondaryPhone && (
                <li>
                  <span className='font-bold capitalize'>
                    Telefone Secundário:{' '}
                  </span>
                  {tenant.secondaryPhone}
                </li>
              )}
              {tenant.email && (
                <li>
                  <span className='font-bold capitalize'>Email: </span>
                  <span className='capitalize'>{tenant.email}</span>
                </li>
              )}
              {tenant.pixKeys && (
                <li>
                  <span className='font-bold'>Chaves Pix:</span>
                  <ul className='list-inside list-disc pl-3'>
                    {tenant.pixKeys.map((pixKey) => (
                      <li key={pixKey.id}>
                        <span className='font-medium capitalize'>
                          {pixKey.keyType}:{' '}
                        </span>
                        <span>{pixKey.key}</span>
                      </li>
                    ))}
                  </ul>
                </li>
              )}
            </ul>
          </div>

          <div className='rounded-md border p-4 shadow-card'>
            <h2 className='mb-7 text-center text-2xl capitalize'>Locações</h2>
            <ul className='space-y-1'>
              {!!tenant.contracts.length && (
                <li>
                  <span className='font-bold'>Contratos: </span>
                  {tenant.contracts.map((contract) => (
                    <ul
                      className='relative flex w-fit items-center gap-3 pl-3 last:child:!border-r-0 even:child:border-x even:child:border-black even:child:px-3'
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
                      <li className='flex items-center gap-1.5'>
                        <span className='font-bold'>Vencimento: </span>{' '}
                        {contract.dueDay}
                      </li>
                      <li className='flex items-center gap-1.5'>
                        <span className='font-bold'>Mensalidade: </span>{' '}
                        {formatCurrency(contract.rent)}
                      </li>
                      <li className='flex items-center gap-1.5'>
                        <Link
                          href={`/casas/${contract.house.street}?id=${contract.house.id}`}
                          className='whitespace-nowrap hover:text-link hover:underline'
                        >
                          <span className='font-bold'>Casa: </span>{' '}
                          {`${contract.house.street}, ${contract.house.number}`}
                        </Link>
                      </li>
                      <li
                        className={`h-4 w-4 rounded-full ${
                          contract.endingDate ? 'bg-red-500' : 'bg-green-500'
                        }`}
                      ></li>
                    </ul>
                  ))}
                </li>
              )}
            </ul>
          </div>
        </div>

        <menu className='flex items-center justify-around pt-10'>
          <li>
            <Link
              href={`editar?id=${tenant.id}`}
              className='grow rounded-lg border border-blue-700
             bg-blue-400 px-8 py-2 text-center font-semibold text-white'
            >
              Editar
            </Link>
          </li>
          <li>
            <button
              onClick={() => deleteTenant()}
              className='grow rounded-lg border border-red-700 bg-red-400 px-8 py-2 font-semibold text-white'
            >
              Excluir
            </button>
          </li>
        </menu>
      </div>
    );
};

export default TenantProfile;
