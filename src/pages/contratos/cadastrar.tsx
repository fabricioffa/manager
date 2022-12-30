import Form from "../../components/contracts/Form";

const CreateContract = () => {
  return (
    <div className="container">
      <h1 className="text-5xl font-semibold text-center mb-14">Contratos</h1>
      <Form action={'create'} />
    </div>
  )
}

export default CreateContract;
