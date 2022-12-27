import GoBackBtn from "../../components/goBackBtn";
import Form from "../../components/contracts/Form";

const CreateContract = () => {
  return (
    <div className="container">
      <GoBackBtn />
      <h1 className="text-5xl font-semibold text-center mb-14">Contratos</h1>
      <Form action={'auth.contracts.create'} />
    </div>
  )
}

export default CreateContract;
