import Form from '../../components/houses/Form';

const Create = () => {
  return (
    <div className='container'>
      <h1 className='mb-14 text-center text-5xl font-semibold'>Casas</h1>
      <Form action={'create'} />
    </div>
  );
};

export default Create;
