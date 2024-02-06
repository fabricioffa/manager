import { type RouterOutputs, trpc } from '../../utils/trpc';
import { debitSchema, type DebitSchema } from '~/server/schemas/debit.schemas';
import {
  useForm,
  type SubmitHandler,
  type SubmitErrorHandler,
} from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputContainer from '../InputContainer';
import { useRouter } from 'next/router';

interface FormProps {
  debit?: NonNullable<RouterOutputs['debits']['findOne']>;
  action: 'create' | 'edit';
}

const inputDefaultStyle =
  'mt-1 neighborhood w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-0 focus:outline-link py-2 px-3 dark:bg-slate-700 dark:border-slate-600 focus:outline focus:ring-2 dark:focus:ring-link-500';

const Form = ({ debit, action }: FormProps) => {
  const create = trpc.debits.create.useMutation();
  const { data: contracts, isSuccess: contractsIsSuccess } =
    trpc.contracts.findAll.useQuery({showDeleted: false});
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<DebitSchema>({
    resolver: zodResolver(debitSchema),
    mode: 'onBlur',
    defaultValues: debit
      ? {
          type: 'rent',
          amount: Number(debit.amount),
        }
      : {
          type: 'rent',
        },
  });

  const { debits } = trpc.useUtils();
  const { push } = useRouter();

  const onInvalid: SubmitErrorHandler<DebitSchema> = (errors: unknown) => {
    // TODO: DELENDUS
    console.log('errors', errors);
  };

  const onValid: SubmitHandler<DebitSchema> = (rawData, e) => {
    create.mutate(rawData, {
      onSuccess() {
        e?.target.reset();
        debits.findAll.invalidate();
        push('/debitos/pesquisar');
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <fieldset className='mb-4'>
        <legend className='mx-auto'>
          <h2 className='mb-12 text-center text-4xl font-semibold'>
            {action === 'create' ? 'Cadastrar' : 'Editar'} Débito
          </h2>
        </legend>

        {create.isSuccess && (
          <p className='mb-12 text-center text-3xl font-semibold text-link'>
            Débito {action === 'create' ? 'cadastrado' : 'editado'} com sucesso!
          </p>
        )}

        <div className='grid gap-x-6 gap-y-2 md:grid-cols-2 lg:grid-cols-3'>
          <InputContainer
            label='Dia de vencimento'
            id='due-date'
            errorMsg={errors?.dueDate?.message}
          >
            <input
              className={inputDefaultStyle}
              type='date'
              id='due-date'
              required
              defaultValue={debit?.dueDate.toLocaleDateString('en-CA')}
              {...register('dueDate')}
            />
          </InputContainer>

          <InputContainer
            label='Valor'
            id='amount'
            errorMsg={errors?.amount?.message}
          >
            <input
              className={inputDefaultStyle}
              type='number'
              inputMode='decimal'
              autoComplete='on'
              step={0.01}
              max={99_999}
              id='amount'
              required
              {...register('amount')}
            />
          </InputContainer>

          <InputContainer
            label='Data do pagamento'
            id='paid-at'
            errorMsg={errors?.paidAt?.message}
          >
            <input
              className={inputDefaultStyle}
              type='datetime-local'
              id='paid-at'
              defaultValue={debit?.paidAt?.toLocaleDateString('en-CA')}
              {...register('paidAt')}
            />
          </InputContainer>

          {contractsIsSuccess && (
            <InputContainer
              label='Locatário'
              id='tenant-id'
              errorMsg={errors?.contractId?.message}
            >
              <select
                className={inputDefaultStyle}
                id='tenant-id'
                required
                {...register('contractId')}
              >
                {contracts.map((contract) => (
                  <option value={contract.id} key={contract.id}>
                    {contract.tenant.name.split(' ').shift()} &harr;{' '}
                    {[contract.house.number, contract.house.street].join(', ')}
                  </option>
                ))}
              </select>
            </InputContainer>
          )}
        </div>
      </fieldset>

      <button
        className='mx-auto mt-8 block  w-1/4 min-w-min rounded-lg bg-link  px-8 py-3 text-lg font-semibold text-white disabled:bg-slate-200 dark:bg-link-700 dark:disabled:bg-link-900 dark:disabled:text-white/50'
        disabled={create.isLoading}
      >
        {action === 'create' ? 'Cadastrar' : 'Editar'}
      </button>
    </form>
  );
};

export default Form;
