import Link from "next/link";
import { useRouter } from "next/router";
import { trpc } from "../../utils/trpc";
import { useDelete } from "../../utils/hooks";
import { formatCurrency } from "../../utils/function/prod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Loading } from "../../components/Loading";

const HouseProfile = () => {
  const {
    query: { id },
  } = useRouter();
  const stringId = id as string;

  const { data: house, isLoading, isError } = trpc.houses.findOne.useQuery({ id: stringId });
  const deleteHouse = useDelete(stringId, 'houses')

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>;

  if (isLoading) return <Loading />

  if (house)
    return (
      <div className="relative mx-auto px-6">

        <h1 className="text-4xl text-center capitalize mb-10">{`${house.street}, ${house.number}`}</h1>

        <div className="w-fit rounded-md border shadow-card mx-auto p-4">
          <ul className="space-y-1">
            <li>
              <span className="font-bold">Complemento: </span>
              {house.complement}
            </li>
            <li>
              <span className="font-bold">Bairo: </span>
              {house.neighborhood}
            </li>
            <li>
              <span className="font-bold">Cidade: </span>
              {house.city}
            </li>
            <li>
              <span className="font-bold">Tipo: </span>
              <span className="capitalize">{house.type}</span>
            </li>
            <li>
              <span className="font-bold">IPTU: </span>
              {house.iptu}
            </li>
            <li>
              <span className="font-bold">Número da Instalação: </span>
              {house.electricityId}
            </li>
            <li>
              <span className="font-bold">Hidrômetro: </span>
              {house.waterId}
            </li>
            {
              !!house.description &&
              <li>
                <span className="font-bold">Descrição: </span>
                {house.description}
              </li>
            }
            <ul className="space-y-1">
              {
                !!house.contracts.length &&
                <li>
                  <span className="font-bold">Contratos: </span>
                  {
                    house.contracts.map(contract => (
                      <ul className={`relative grid grid-flow-col gap-3 w-fit pl-3 mr-5
                          even:child:border-x last:child:!border-r-0 last:child:!pr-0  even:child:border-black even:child:px-3
                          after:absolute after:top-1/2 after:-right-1.5 after:-translate-y-1/2 after:translate-x-full
                          after:w-4 after:h-4 after:rounded-full ${contract.endingDate ? 'after:bg-red-500' : 'after:bg-green-500'}`}
                        key={contract.id}>
                        <li>
                          <Link href={`/contratos/${contract.id}`}>
                            <FontAwesomeIcon icon='magnifying-glass' className="hover:text-link hover:scale-110" />
                          </Link>
                        </li>
                        <li>
                          <span className="font-bold">Vencimento: </span> {contract.dueDay}
                        </li>
                        <li>
                          <span className="font-bold">Mensalidade: </span> {formatCurrency(contract.rent)}
                        </li>
                        <li>
                          <Link href={`/inquilinos/${contract.tenant.name}?id=${contract.tenant.id}`} className="hover:text-link hover:underline">
                            <span className="font-bold">Inquilino: </span> {contract.tenant.name}
                          </Link>
                        </li>
                      </ul>
                    ))
                  }
                </li>
              }
            </ul>
          </ul>
        </div>

        <menu className="flex items-center justify-around pt-10">
          <li>
            <Link href={`editar?id=${house.id}`} className="grow bg-blue-400 rounded-lg
            border border-blue-700 text-white text-center font-semibold py-2 px-8">
              Editar
            </Link>
          </li>
          <li>
            <button onClick={() => deleteHouse()} className="grow bg-red-400 rounded-lg border
             border-red-700 text-white font-semibold py-2 px-8">
              Excluir
            </button>
          </li>
        </menu>
      </div>
    );
};

export default HouseProfile;
