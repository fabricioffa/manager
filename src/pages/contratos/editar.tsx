import { useRouter } from "next/router";
import GoBackBtn from "../../components/goBackBtn";
import Form from "../../components/contracts/Form";
import { trpc } from "../../utils/trpc";

const EditContract = () => {
  const { query: { id } } = useRouter();
  const stringId = id as string

  const { data: contract, isLoading, isError } = trpc.useQuery(['auth.contracts.findOne', { id: stringId }])

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>

  if (isLoading) return <div>Loading...</div>

  if (contract) {
    return (
      <div className="container">
        <GoBackBtn />
        <h1 className="text-5xl font-semibold text-center mb-14">Contratos</h1>
        <Form contract={contract} action={"auth.contracts.edit"} />
      </div>
    )
  }
}

export default EditContract;
