import type { ReceiptSchema } from '../../server/schemas/receipt.schema';
import type { SubmitHandler, SubmitErrorHandler } from 'react-hook-form';
import type { RouterOutputs } from '../../utils/trpc';
import { trpc } from '../../utils/trpc';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import InputContainer from '../InputContainer';
import { receiptSchema } from '../../server/schemas/receipt.schema';
import {
  formatCpf,
  formatOnChange,
  pastMonthDate,
  slugfy,
  toMonthInputFormat,
} from '../../utils/function/prod';
import Receipt from '../../utils/Receipt';
// import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const inputDefaultStyle = `mt-1 w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white dark:focus:bg-slate-700 focus:ring-0 focus:outline-link py-2 px-3 dark:bg-slate-700 dark:border-slate-600 focus:outline focus:ring-2 dark:focus:ring-link-500`;

const fiveYearsBack = `${new Date().getFullYear() - 5}-01-01`;
const fiveYearsAfter = `${new Date().getFullYear() + 5}-01-01`;

interface FormProps {
  debit: NonNullable<RouterOutputs['debits']['findOne']>;
}

const Form = ({ debit }: FormProps) => {
  const { data: pastPaidDebitsCount } =
    trpc.debits.pastPaidDebitsCount.useQuery({ contractId: debit.contract.id });

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<ReceiptSchema>({
    resolver: zodResolver(receiptSchema),
    mode: 'onBlur',
    defaultValues: {
      amount: Number(debit.amount),
      city: 'Fortaleza',
      house: debit.contract.house,
      tenant: {
        name: debit.contract.tenant.name,
        cpf: formatCpf(debit.contract.tenant.cpf),
      },
    },
  });

  const onInvalid: SubmitErrorHandler<ReceiptSchema> = (errors) => {
    // TODO: DELENDUS
    console.log('%c errors', 'color: red', errors);
  };

  const onValid: SubmitHandler<ReceiptSchema> = async (receiptData) => {
    console.log('%c receiptData', 'color: green', receiptData);
    receiptData.rentingPeriod;
    const receipt = new Receipt(receiptData, pastPaidDebitsCount);

    const pdf = receipt.makePdf();
    // pdf.save(
    //   `recibo-${slugfy(receiptData.tenant.name)}-${toMonthInputFormat(
    //     pastMonthDate(receiptData.rentingPeriod)
    //   )}.pdf`
    // );
    const pdfUrl = pdf.output('bloburi');
    const iframe =
      "<iframe class='h-[100vh]' width='100%' height='100%' src='" +
      pdfUrl +
      "'></iframe>";
    document.getElementById('pdf-preview')!.innerHTML = iframe;
  };

  // const styles = StyleSheet.create({
  //   page: {
  //     display: 'flex',
  //     flexDirection: 'column',
  //     backgroundColor: 'white',
  //     color: 'black',
  //     width: '800px',
  //   },
  //   section: {
  //     margin: 10,
  //     padding: 10,
  //     flexGrow: 1,
  //     border: '2px solid black',
  //     borderRadius: '5px'
  //   },
  //   subSection: {
  //     display: 'flex'
  //   },
  //   dynamicText: {
  //     fontWeight: 'bold',
  //     marginHorizontal: '2px'
  //   },
  // });

  return (
    <>
      <form onSubmit={handleSubmit(onValid, onInvalid)}>
        <fieldset>
          <legend className='mx-auto'>
            <h2 className='sr-only'>Gerar Recibo</h2>
          </legend>

          <div className='grid gap-x-6 gap-y-2 md:grid-cols-2 lg:grid-cols-3'>
            <InputContainer
              label='Valor'
              id='amount'
              errorMsg={errors?.amount?.message}
            >
              <input
                className={inputDefaultStyle}
                type='number'
                autoComplete='on'
                step={0.01}
                max={99_999.99}
                placeholder='687,00'
                id='amount'
                autoFocus
                {...register('amount')}
              />
            </InputContainer>

            <InputContainer
              label='CPF'
              id='cpf'
              errorMsg={errors?.tenant?.cpf?.message}
            >
              <input
                className={inputDefaultStyle}
                type='text'
                autoComplete='on'
                maxLength={11}
                placeholder='775'
                id='cpf'
                {...register('tenant.cpf', {
                  onChange: formatOnChange<ReceiptSchema>({
                    field: 'tenant.cpf',
                    formatFunc: formatCpf,
                    setValue: setValue,
                  }),
                })}
              />
            </InputContainer>

            <InputContainer
              label='Nome'
              id='name'
              errorMsg={errors?.tenant?.name?.message}
            >
              <input
                className={inputDefaultStyle}
                type='text'
                autoComplete='name'
                maxLength={191}
                placeholder='Fulano da Silva'
                id='name'
                {...register('tenant.name')}
              />
            </InputContainer>

            <InputContainer
              label='Périodo'
              id='renting-period'
              errorMsg={errors?.rentingPeriod?.message}
            >
              <input
                className={inputDefaultStyle}
                type='month'
                min={fiveYearsBack}
                max={fiveYearsAfter}
                defaultValue={toMonthInputFormat(pastMonthDate(debit.dueDate))}
                id='renting-period'
                {...register('rentingPeriod')}
              />
            </InputContainer>

            <InputContainer
              label='Rua'
              id='street'
              errorMsg={errors?.house?.street?.message}
            >
              <input
                className={inputDefaultStyle}
                type='text'
                autoComplete='address-level3'
                maxLength={191}
                placeholder='Zé Valter'
                id='street'
                {...register('house.street')}
              />
            </InputContainer>

            <InputContainer
              label='Número'
              id='number'
              errorMsg={errors?.house?.number?.message}
            >
              <input
                className={inputDefaultStyle}
                type='text'
                autoComplete='address-level4'
                maxLength={20}
                placeholder='Fortaleza'
                id='number'
                {...register('house.number')}
              />
            </InputContainer>

            <InputContainer
              label='Cidade'
              id='city'
              errorMsg={errors?.city?.message}
            >
              <input
                className={inputDefaultStyle}
                type='text'
                autoComplete='address-level2'
                maxLength={20}
                placeholder='Fortaleza'
                id='city'
                {...register('city')}
              />
            </InputContainer>

            <InputContainer
              label='Data de emissão'
              id='date'
              errorMsg={errors?.date?.message}
            >
              <input
                className={inputDefaultStyle}
                type='date'
                min={fiveYearsBack}
                max={fiveYearsAfter}
                defaultValue={new Date().toLocaleDateString('fr-CA')}
                id='date'
                {...register('date', { valueAsDate: true })}
              />
            </InputContainer>

            <button
              className='mb-2 rounded-lg bg-link
            px-8 py-2 text-lg font-semibold text-white disabled:bg-slate-200 md:mt-7'
            >
              Gerar
            </button>
          </div>
        </fieldset>
      </form>

      {/* <Document>
        <Page size='A4' style={styles.page}>
          <View style={styles.section}>
            <View style={{ display: 'flex' ,marginBottom: '15px' }}>
              <Text>
                Recebi de <Text style={styles.dynamicText}>Van Lubowitz</Text>,
                inscrito no CPF <Text style={styles.dynamicText}>804.818.285-80</Text>, o valor de {' '}
                <Text style={styles.dynamicText}>R$ 1.180,00 (mil cento e oitenta reais)</Text>,
                correspondente ao aluguel do mês de <Text style={styles.dynamicText}>setembro de 2023</Text>{' '}
                do imóvel situado em <Text style={styles.dynamicText}>Hodkiewicz Plains, 438</Text>.
              </Text>
            </View>
            <View style={styles.subSection}>
              <Text>
                E para clareza confirmo o presente na cidade de <Text style={styles.dynamicText}>Fortaleza</Text>
                , no dia <Text style={styles.dynamicText}>30 de outubro de 2023</Text>.
              </Text>
            </View>
          </View>
          <View style={styles.section}>
            <View>
              <Text>Assinatura:</Text>
            </View>
            <View style={styles.subSection}>
              <Text>Nome por extenso: <Text style={styles.dynamicText}>Francisco Isaac Agostinho</Text></Text>
            </View>
          </View>
        </Page>
      </Document> */}
    </>
  );
};

export default Form;
