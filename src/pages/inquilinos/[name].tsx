import Link from "next/link";
import { useRouter } from "next/router"
import GoBackBtn from "../../components/goBackBtn";
import { useDelete } from "../../utils/hooks";
import { trpc } from "../../utils/trpc";
import { formatCurrency, formatDate } from "../../utils/functions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";


const TenantProfile = () => {
  const { query: { id } } = useRouter();
  const stringId = id as string

  const { data: tenant, isLoading, isError } = trpc.tenants.findOne.useQuery({ id: stringId })

  const deleteTenant = useDelete(stringId, 'tenants')
  const activeContracts = tenant?.contracts?.filter(contract => !contract.endingDate)
  const pastContracts = tenant?.contracts?.filter(contract => contract.endingDate)

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>

  if (isLoading) return <div>Loading...</div>


  if (tenant)
    return (
      <div className="relative mx-auto px-6">
        <GoBackBtn />

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
            </ul>
          </div>

          <div className="rounded-md border shadow-card p-4">
            <h2 className="text-2xl text-center capitalize mb-7">Locação</h2>
            <ul className="space-y-1">
              {
                tenant.debit &&
                <li>
                  <span className="font-bold capitalize">Débito: </span>
                  {formatCurrency(tenant.debit)}
                </li>
              }
              <li>
                <span className="font-bold">Número do Cliente: </span>
                {tenant.electricityId}
              </li>
              <li>
                <span className="font-bold">Número de Inscrição: </span>
                {tenant.waterId}
              </li>
              {tenant.lastPayment &&
                <li>
                  <span className="font-bold">Último pagamento: </span>
                  {formatDate(tenant.lastPayment)}
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
              {
                !!tenant.contracts.length &&
                <>
                  {
                    !!activeContracts?.length &&
                    <li>
                      <span className="font-bold">Contratos atuais: </span>
                      {
                        activeContracts.map((activeContract, i) => (
                          <ul className="flex gap-3 pl-3 even:child:border-x even:child:border-black even:child:px-3" key={activeContract.id}>
                            <li>
                              <Link href={`/contratos/${activeContract.id}`}>
                                <FontAwesomeIcon icon='magnifying-glass' className="hover:text-link hover:scale-110" />
                              </Link>
                            </li>
                            <li>
                              <span className="font-bold">Vencimento: </span> {activeContract.dueDay}
                            </li>
                            <li>
                              <span className="font-bold">Mensalidade: </span> {formatCurrency(activeContract.rent)}
                            </li>
                          </ul>
                        ))
                      }
                    </li>
                  }
                  {
                    !!pastContracts?.length &&
                    <li>
                      <span className="font-bold">Contratos passados: </span>
                      {
                        pastContracts.map((pastContract, i) => (
                          <ul className="flex gap-3 pl-3 even:child:border-x even:child:border-black even:child:px-3" key={pastContract.id}>
                            <li>
                              <Link href={`/contratos/${pastContract.id}`}>
                                <FontAwesomeIcon icon='magnifying-glass' className="hover:text-link hover:scale-110" />
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
