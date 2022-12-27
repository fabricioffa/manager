import Form from "../../components/houses/Form";

const Create = () => {
  return (
    <div className="container">
      <h1 className="text-5xl font-semibold text-center mb-14">Casas</h1>
      <Form action={'create'} />
    </div>
  )
}

export default Create;
