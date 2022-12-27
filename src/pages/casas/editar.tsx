import { useRouter } from "next/router";
import GoBackBtn from "../../components/goBackBtn";
import Form from "../../components/houses/Form";
import { trpc } from "../../utils/trpc";

const Create = () => {
  const { query: { id } } = useRouter();
  const stringId = id as string

  const {data: house, isLoading, isError} = trpc.useQuery(['auth.houses.findOne', {id: stringId}])

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>

  if (isLoading) return <div>Loading...</div>

  if (house) {
    return (
      <div className="container">
        <GoBackBtn />
        <h1 className="text-5xl font-semibold text-center mb-14">Casas</h1>
        <Form house={house} action={"auth.houses.edit"} />
      </div>
    )
  }
}

export default Create;
