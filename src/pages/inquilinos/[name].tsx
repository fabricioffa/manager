import Link from "next/link";
import { useRouter } from "next/router"
import { useDelete } from "../../utils/hooks";
import { trpc } from "../../utils/trpc";
import { formatCurrency } from "../../utils/function/prod";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Loading } from "../../components/Loading";


const TenantProfile = () => {
  const { query: { id } } = useRouter(); //TODO: USE ZOD
  const stringId = id as string

  const { data: tenant, isLoading, isError } = trpc.tenants.findOne.useQuery({ id: stringId })
  const deleteTenant = useDelete(stringId, 'tenants')

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>

  if (isLoading) return <Loading />

  if (tenant)
    return (
      <div className="relative mx-auto px-6">

        <h1 className="text-4xl text-center capitalize">{tenant.name}</h1>

        <div className="flex flex-wrap justify-around gap-20 child:flex-1 child:min-w-[22.5rem] mt-20">
          <div className="rounded-md border shadow-card p-4">
            <h2 className="text-2xl text-center capitalize mb-7">Informações Pessoais</h2>
            <ul className="space-y-1">
              <li>
                <span className="font-bold uppercase">RG: </span>
                {tenant?.rg} / <span className="uppercase">{tenant.rgEmitter}</span>
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
              {
                tenant.obs &&
                <li>
                  <span className="font-bold capitalize">Observação: </span>
                  <span className="capitalize line-clamp-3">{tenant.obs}</span>
                </li>
              }
              <li>
                <span className="font-bold capitalize">Telefone Principal: </span>
                {tenant.primaryPhone}
              </li>
              {tenant.secondaryPhone && <li>
                <span className="font-bold capitalize">Telefone Secundário: </span>
                {tenant.secondaryPhone}
              </li>}
              {tenant.email &&
                <li>
                  <span className="font-bold capitalize">Email: </span>
                  <span className="capitalize">{tenant.email}</span>
                </li>
              }
              {tenant.pixKeys &&
                <li>
                  <span className="font-bold">Chaves Pix:</span>
                  <ul className="list-inside list-disc pl-3">
                    {
                      tenant.pixKeys.map(pixKey => (
                        <li key={pixKey.id}>
                          <span className="font-medium capitalize">{pixKey.keyType}: </span>
                          <span>{pixKey.key}</span>
                        </li>
                      ))
                    }
                  </ul>
                </li>
              }
            </ul>
          </div>

          <div className="rounded-md border shadow-card p-4">
            <h2 className="text-2xl text-center capitalize mb-7">Locações</h2>
            <ul className="space-y-1">
              {
                !!tenant.contracts.length &&
                <li>
                  <span className="font-bold">Contratos: </span>
                  {
                    tenant.contracts.map(contract => (
                      <ul className={`relative flex gap-3 w-fit pl-3 even:child:border-x last:child:!border-r-0 even:child:border-black even:child:px-3
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
                          <Link href={`/casas/${contract.house.street}?id=${contract.house.id}`} className="hover:text-link hover:underline">
                            <span className="font-bold">Casa: </span> {`${contract.house.street}, ${contract.house.number}`}
                          </Link>
                        </li>
                      </ul>
                    ))
                  }
                </li>
              }
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
