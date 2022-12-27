import Link from "next/link";
import { useRouter } from "next/router";
import GoBackBtn from "../../components/goBackBtn";
import { trpc } from "../../utils/trpc";
import { useDeleteHouse } from "../../utils/hooks";

const HouseProfile = () => {
  const {
    query: { id },
  } = useRouter();
  const stringId = id as string;

  const {
    data: house,
    isLoading,
    isError,
  } = trpc.useQuery(["auth.houses.findOne", { id: stringId }]);

    const deleteHouse = useDeleteHouse(stringId)

    if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>;

    if (isLoading) return <div>Loading...</div>;

    if (house)
    return (
      <div className="relative mx-auto px-6">
        <GoBackBtn />

        <h1 className="text-4xl text-center capitalize">{`${house.street}, ${house.number}`}</h1>

        <div>
          <ol>
            <li>Complemento: {house.complement}</li>
            <li>Bairo: {house.neighborhood}</li>
            <li>Cidade: {house.city}</li>
            <li>Tipo: {house.type}</li>
            <li>IPTU: {house.iptu}</li>
            <li>Número da Instalação: {house.electricityId}</li>
            <li>Hidrômetro: {house.waterId}</li>
            <li>Descrição: {house.description}</li>
            {/* {house.tenant &&
              <li>
                <Link href={`inquilinos?id=${house.tenant?.id}`} >
                  <a className="hover:text-blue-700">Inquilino: {house.tenant?.name}</a>
                </Link>
              </li>
            } */}
          </ol>
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
