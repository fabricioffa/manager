import Link from "next/link";
import { useRouter } from "next/router"
import GoBackBtn from "../../components/goBackBtn";
import { useDelete } from "../../utils/hooks";
import { trpc } from "../../utils/trpc";


const TenantProfile = () => {
  const { query: { id } } = useRouter();
  const stringId = id as string

  const {data: tenant, isLoading, isError} = trpc.tenants.findOne.useQuery({id: stringId})

  const deleteTenant = useDelete(stringId, 'tenants')

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>

  if (isLoading) return <div>Loading...</div>


  if (tenant)
    return (
      <div className="relative mx-auto px-6">
        <GoBackBtn />

        <h1 className="text-4xl text-center capitalize">{tenant.name}</h1>

        <div className="flex flex-wrap justify-around gap-20 mt-20">
          <div>
            <h2 className="text-2xl text-center capitalize mb-7">Informação Pessoal</h2>
            <ul className="space-y-1">
              <li>
                <span className="font-bold uppercase">RG: </span>
                {tenant?.rg} — <span className="uppercase">{tenant.rgEmitter}</span>
              </li>
              <li>
                <span className="font-bold uppercase">CPF: </span>
                {tenant.rg}
              </li>
              <li>
                <span className="font-bold capitalize">Estado Civil: </span>
                <span className="capitalize">{tenant.maritalStatus}</span>
              </li>
              <li>
                <span className="font-bold capitalize">Profissão: </span>
                <span className="capitalize">{tenant.profession}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl text-center capitalize mb-7">Contatos</h2>
            <ul className="space-y-1">
              <li>
                <span className="font-bold capitalize">Telefone Principal: </span>
                {tenant.primaryPhone}
              </li>
              {tenant.secondaryPhone && <li>
                <span className="font-bold capitalize">Telefone Secundário: </span>
                {tenant.secondaryPhone}
              </li>}
              <li>
                <span className="font-bold capitalize">Email: </span>
                <span className="capitalize">{tenant.email}</span>
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl text-center capitalize mb-7">Locação</h2>
            <ul className="space-y-1">
              <li>
                <span className="font-bold capitalize">Débito: </span>
                {Intl.NumberFormat('pt-BR', {style: 'currency' ,currency: 'BRL'}).format(Number(tenant.debit))}
              </li>
              <li>
                <span className="font-bold">Id da Enel: </span>
                {tenant.electricityId}
              </li>
              <li>
                <span className="font-bold">Id da CAGECE: </span>
                {tenant.waterId}
              </li>
            </ul>
          </div>

        </div>

        <menu className="flex items-center justify-around pt-10">
          <li>
            <Link href={`editar?id=${tenant.id}`} className="grow bg-blue-400 rounded-lg border
             border-blue-700 text-white text-center font-semibold py-2 px-8">
              Editar
            </Link>
          </li>
          <li>
            <button onClick={() => deleteTenant()}
              className="grow bg-red-400 rounded-lg border border-red-700 text-white font-semibold py-2 px-8">
              Excluir
            </button>
          </li>
        </menu>
      </div>
    )
}

export default TenantProfile
