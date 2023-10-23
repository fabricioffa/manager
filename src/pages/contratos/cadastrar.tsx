import Form from '../../components/contracts/Form';

const CreateContract = () => {
  return (
    <div className='container'>
      <h1 className='mb-14 text-center text-5xl font-semibold'>Contratos</h1>
      <Form action={'create'} />
    </div>
  );
};

export default CreateContract;
