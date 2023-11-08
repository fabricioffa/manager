import Form from '../../components/debits/Form';

const CreateContract = () => {
  return (
    <div className='container'>
      <h1 className='mb-14 text-center text-5xl font-semibold'>Débitos</h1>
      <Form action={'create'} />
    </div>
  );
};

export default CreateContract;
