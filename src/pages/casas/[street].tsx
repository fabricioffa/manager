import Link from "next/link";
import { useRouter } from "next/router";
import GoBackBtn from "../../components/goBackBtn";
import { trpc } from "../../utils/trpc";
import { useDelete } from "../../utils/hooks";
import { formatCurrency } from "../../utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const HouseProfile = () => {
  const {
    query: { id },
  } = useRouter();
  const stringId = id as string;

  const { data: house, isLoading, isError } = trpc.houses.findOne.useQuery({ id: stringId });
  const activeContract = house?.contracts.find(({ endingDate }) => !endingDate)
  const pastContracts = house?.contracts.filter(({ endingDate }) => endingDate)
  const deleteHouse = useDelete(stringId, 'houses')
  console.log(activeContract);
  
  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>;

  if (isLoading) return <div>Loading...</div>;

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
            {
              !!house.contracts.length &&
              <>
                {
                  !!activeContract &&
                  <>
                    <li>
                      <span className="font-bold">Inquilino: </span>
                      <Link className="hover:text-blue-700" href={`inquilinos?id=${activeContract.tenant.id}`} >
                        {activeContract.tenant.name}
                      </Link>
                    </li>
                    <li>
                      <span className="font-bold">Contrato Atual: </span>
                      <ul className="flex gap-3 pl-3 even:child:border-x even:child:border-black even:child:px-3" key={activeContract.id}>
                        <li>
                          <Link href={`/contratos/${activeContract.id}`}>
                            <FontAwesomeIcon icon='magnifying-glass' className="hover:text-link hover:scale-110"/>
                          </Link>
                        </li>
                        <li>
                          <span className="font-bold">Vencimento: </span> {activeContract.dueDay}
                        </li>
                        <li>
                          <span className="font-bold">Mensalidade: </span> {formatCurrency(activeContract.rent)}
                        </li>
                      </ul>
                    </li>
                    {
                    !!pastContracts?.length &&
                    <li>
                      <span className="font-bold">Contratos passados: </span>
                      {
                        pastContracts.map((pastContract, i) => (
                          <ul className="flex gap-3 pl-3 even:child:border-x even:child:border-black even:child:px-3" key={pastContract.id}>
                            <li>
                              <Link href={`/contratos/${pastContract.id}`}>
                                <FontAwesomeIcon icon='magnifying-glass' className="hover:text-link hover:scale-110"/>
                              </Link>
                            </li>
                            <li>
                              <span className="font-bold">Vencimento: </span> {pastContract.dueDay}
                            </li>
                            <li>
                              <span className="font-bold">Mensalidade: </span> {formatCurrency(pastContract.rent)}
                            </li>
                          </ul>
                        ))
                      }
                    </li>
                  }
                  </>
                }
              </>
            }
            {/* {house.tenant &&
              <li>
              </li>
            } */}
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
