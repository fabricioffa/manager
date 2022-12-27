import GoBackBtn from "../../components/goBackBtn";
import Form from "../../components/tenants/Form";

const Create = () => {
  return (
    <div className="container">
      <GoBackBtn />
      <h1 className="text-5xl font-semibold text-center mb-14">Inquilinos</h1>
      <Form action={'auth.tenants.create'} />
    </div>
  )
}

export default Create;
