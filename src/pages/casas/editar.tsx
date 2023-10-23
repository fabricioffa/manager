import { useRouter } from 'next/router';
import Form from '../../components/houses/Form';
import { trpc } from '../../utils/trpc';

const Create = () => {
  const {
    query: { id },
  } = useRouter();
  const stringId = id as string;

  const {
    data: house,
    isLoading,
    isError,
  } = trpc.houses.findOne.useQuery({ id: stringId });

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>;

  if (isLoading) return <div>Loading...</div>;

  if (house) {
    return (
      <div className='container'>
        <h1 className='mb-14 text-center text-5xl font-semibold'>Casas</h1>
        <Form house={house} action={'edit'} />
      </div>
    );
  }
};

export default Create;
