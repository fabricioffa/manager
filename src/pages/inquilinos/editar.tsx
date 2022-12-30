import { useRouter } from "next/router";
import Form from "../../components/tenants/Form";
import { trpc } from "../../utils/trpc";

const Create = () => {
  const { query: { id } } = useRouter();
  const stringId = id as string

  const { data: tenant, isLoading, isError } = trpc.tenants.findOne.useQuery({ id: stringId })

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>

  if (isLoading) return <div>Loading...</div>

  if (tenant) {
    return (
      <div className="container">
        <h1 className="text-5xl font-semibold text-center mb-14">Inquilinos</h1>
        <Form tenant={tenant} action={"edit"} />
      </div>
    )
  }
}

export default Create;
