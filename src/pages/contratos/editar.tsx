import { useRouter } from 'next/router';
import Form from '../../components/contracts/Form';
import { trpc } from '../../utils/trpc';

const EditContract = () => {
  const {
    query: { id },
  } = useRouter();
  const stringId = id as string;

  const {
    data: contract,
    isLoading,
    isError,
  } = trpc.contracts.findOne.useQuery({ id: stringId });

  if (isError) return <div>Deu BO. Dá refresh... sei lá :/ </div>;

  if (isLoading) return <div>Loading...</div>;

  if (contract) {
    return (
      <div className='container'>
        <h1 className='mb-14 text-center text-5xl font-semibold'>Contratos</h1>
        <Form contract={contract} action={'edit'} />
      </div>
    );
  }
};

export default EditContract;
