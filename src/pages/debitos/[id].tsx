import Link from 'next/link';
import { useRouter } from 'next/router';
import { useDelete } from '../../utils/hooks';
import { trpc } from '../../utils/trpc';
import { formatCurrency } from '../../utils/function/prod';
import { Loading } from '../../components/Loading';

const dateToString = (date: Date) =>
  new Intl.DateTimeFormat('pt-BR').format(date);

const ContractProfile = () => {
  const {
    query: { id },
  } = useRouter();
  const stringId = id as string;

  const {
    data: contract,
    isLoading,
    isError,
  } = trpc.contracts.findOne.useQuery({ id: stringId });

  const deleteContract = useDelete(stringId, 'contracts');

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>;

  if (isLoading) return <Loading />;

  if (contract)
    return (
      <div className='relative mx-auto px-6'>
        <h1 className='text-center text-4xl capitalize'>
          {contract.tenant.name} /{' '}
          {[contract.house.street, contract.house.number].join(' - ')}
        </h1>

        <div className='mt-20 flex flex-wrap justify-around gap-20 child:min-w-[22.5rem] child:flex-1'>
          <div className='rounded-md border p-4 shadow-card'>
            <h2 className='mb-7 text-center text-2xl capitalize'>Contrato</h2>
            <ul className='space-y-1'>
              <li>
                <span className='font-bold capitalize'>Locatário: </span>
                <Link
                  href={`/inquilinos/${contract.tenant.name}?id=${contract.tenant.id}`}
                  className='capitalize hover:text-link hover:underline'
                >
                  {contract.tenant.name}
                </Link>
              </li>
              <li>
                <span className='font-bold capitalize'>Casa: </span>
                <Link
                  href={`/casas/${contract.house.street}?id=${contract.house.id}`}
                  className='capitalize hover:text-link hover:underline'
                >
                  {`${contract.house.street}, ${contract.house.number}`}
                </Link>
              </li>
              <li>
                <span className='font-bold capitalize'>Data initial: </span>
                <span className='capitalize'>
                  {dateToString(contract.initialDate)}
                </span>
              </li>
              {contract.endingDate && (
                <li>
                  <span className='font-bold capitalize'>Data final: </span>
                  <span className='capitalize'>
                    {dateToString(contract.endingDate)}
                  </span>
                </li>
              )}
              <li>
                <span className='font-bold capitalize'>Aluguel: </span>
                {formatCurrency(contract.rent)}
              </li>
              <li>
                <span className='font-bold capitalize'>Caução: </span>
                {formatCurrency(contract.bail)}
              </li>
              <li>
                <span className='font-bold capitalize'>Duração: </span>
                <span className='capitalize'>{contract.duration} meses</span>
              </li>
              <li>
                <span className='font-bold capitalize'>Juros: </span>
                <span className='capitalize'>{Number(contract.interest)}%</span>
              </li>
              <li>
                <span className='font-bold capitalize'>Multa: </span>
                <span className='capitalize'>{Number(contract.arrears)}%</span>
              </li>
              {!!contract.electricityId && (
                <li>
                  <span className='font-bold'>Número do Cliente: </span>
                  {contract.electricityId}
                </li>
              )}
              {!!contract.waterId && (
                <li>
                  <span className='font-bold'>Número de Inscrição: </span>
                  {contract.waterId}
                </li>
              )}
            </ul>
          </div>

          {!!contract.witnesses.length &&
            contract.witnesses.map((witness, i) => (
              <div
                className='rounded-md border p-4 shadow-card'
                key={witness.cpf}
              >
                <h2 className='mb-7 text-center text-2xl capitalize'>
                  {i === 0 ? 'Primeira' : 'Segunda'} Testemunha
                </h2>
                <ul className='space-y-1'>
                  <li>
                    <span className='font-bold capitalize'>Nome: </span>
                    {witness.name}
                  </li>
                  <li>
                    <span className='font-bold uppercase'>RG: </span>
                    {witness.rg} /{' '}
                    <span className='uppercase'>{witness.rgEmitter}</span>
                  </li>
                  <li>
                    <span className='font-bold uppercase'>CPF: </span>
                    {witness.rg}
                  </li>
                  <li>
                    <span className='font-bold capitalize'>
                      Telefone Principal:{' '}
                    </span>
                    {witness.primaryPhone}
                  </li>
                  {witness.secondaryPhone && (
                    <li>
                      <span className='font-bold capitalize'>
                        Telefone Secundário:{' '}
                      </span>
                      {witness.secondaryPhone}
                    </li>
                  )}
                  {witness.email && (
                    <li>
                      <span className='font-bold capitalize'>Email: </span>
                      <span className='capitalize'>{witness.email}</span>
                    </li>
                  )}
                </ul>
              </div>
            ))}
        </div>

        <menu className='flex items-center justify-around pt-10'>
          <li>
            <Link
              href={`editar?id=${contract.id}`}
              className='grow rounded-lg border
            border-blue-700 bg-blue-400 px-8 py-2 text-center font-semibold text-white'
            >
              Editar
            </Link>
          </li>
          <li>
            <button
              onClick={() => deleteContract()}
              className='grow rounded-lg border border-red-700 bg-red-400 px-8 py-2 font-semibold text-white'
            >
              Excluir
            </button>
          </li>
        </menu>
      </div>
    );
};

export default ContractProfile;
