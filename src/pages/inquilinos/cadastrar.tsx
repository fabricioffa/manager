import Form from '../../components/tenants/Form';

const Create = () => {
  return (
    <div className='container'>
      <h1 className='mb-14 text-center text-5xl font-semibold'>Inquilinos</h1>
      <Form action={'create'} />
    </div>
  );
};

export default Create;
