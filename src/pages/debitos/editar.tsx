import { useRouter } from 'next/router';
import Form from '../../components/debits/Form';
import { trpc } from '../../utils/trpc';

const EditContract = () => {
  const {
    query: { id },
  } = useRouter();
  const stringId = id as string;

  const {
    data: debit,
    isLoading,
    isError,
  } = trpc.debits.findOne.useQuery({ id: stringId });

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>;

  if (isLoading) return <div>Loading...</div>;

  if (debit) {
    return (
      <div className='container'>
        <h1 className='mb-14 text-center text-5xl font-semibold'>Débitos</h1>
        <Form debit={debit} action={'edit'} />
      </div>
    );
  }
};

export default EditContract;
