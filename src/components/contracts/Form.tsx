import { trpc } from "../../utils/trpc";
import type { RouterOutputs } from "../../utils/trpc";
import { contractsSchema } from "../../server/schemas/contracts.schemas";
import type { ContractsSchema } from "../../server/schemas/contracts.schemas";
import { useForm, useFormState } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputContainer from "../InputContainer";
import { getDirtyValues } from "../../utils/zodHelpers";
import { useRouter } from "next/router";

const inputDefaultStyle =
  "mt-1 neighborhood  w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 focus:outline-link py-2 px-3";
interface FormProps {
  contract?: NonNullable<RouterOutputs['contracts']['findOne']>;
  action: "create" | "edit";
}

const fiveYearsBack = `${new Date().getFullYear() - 5}-01-01`;
const fiveYearsAfter = `${new Date().getFullYear() + 5}-01-01`;
const today = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(Date.now())

const Form = ({ contract, action }: FormProps) => {
  const create = trpc.contracts.create.useMutation();
  const edit = trpc.contracts.edit.useMutation();

  const { data: tenants, isSuccess: loadedTenants } = trpc.tenants.selectData.useQuery()
  const { data: houses, isSuccess: loadedHouses } = trpc.houses.selectData.useQuery()

  const { register, handleSubmit, formState: { errors }, control, } = useForm<ContractsSchema>({
    resolver: zodResolver(contractsSchema),
    mode: "onBlur",
    defaultValues: {
      dueDay: contract?.dueDay || undefined,
      duration: contract?.duration || 12,
      rent: Number(contract?.rent),
      bail: Number(contract?.bail),
      interest: Number(contract?.interest) || 1,
      arrears: Number(contract?.arrears) || 10,
      electricityId: contract?.electricityId,
      waterId: contract?.waterId,
      houseId: contract?.houseId,
      tenantId: contract?.tenantId,
      witnesses: contract?.witnesses
    }
  });

  const { contracts } = trpc.useContext();
  const { dirtyFields, isDirty } = useFormState({ control })
  const { push } = useRouter()

  const onInvalid: SubmitErrorHandler<ContractsSchema> = (errors) => { // TODO: DELENDUS
    console.log('errors', errors);
  }

  const onValid: SubmitHandler<ContractsSchema> = (rawData, e) => {
    if (action === "edit" && contract) {
      const { witnesses: witnessesData, ...contractData } = getDirtyValues<ContractsSchema>(dirtyFields, rawData)

      edit.mutate({ contractData, witnessesData, contractId: contract.id }, {
        onSuccess() {
          contracts.findAll.invalidate()
          contracts.findOne.invalidate({ id: contract.id })
        }
      })
      return
    }

    create.mutate(rawData, {
      onSuccess() {
        e?.target.reset();
        contracts.findAll.invalidate()
        push('/contratos/pesquisar')
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <fieldset className="mb-4">
        <legend className="mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-12">
            {action === "create" ? "Cadastrar" : "Editar"}{" "}
            Contrato
          </h2>
        </legend>

        {(edit.isSuccess || create.isSuccess) && (
          <p className="text-3xl font-semibold text-center text-link mb-12">
            Contrato{" "}
            {action === "create" ? "cadastrado" : "editado"} com
            sucesso!
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
          <InputContainer label="Dia de pagamento" id="due-day" errorMsg={errors?.dueDay?.message} >
            <input className={inputDefaultStyle} type="number" autoComplete="on" min={1} max={31}
              placeholder="05" id="due-day" required {...register("dueDay")} />
          </InputContainer>

          <InputContainer label="Aluguel" id="rent" errorMsg={errors?.rent?.message} >
            <input className={inputDefaultStyle} type="number" autoComplete="on" id="rent" required {...register("rent")} />
          </InputContainer>

          <InputContainer label="Caução" id="bail" errorMsg={errors?.bail?.message} >
            <input className={inputDefaultStyle} type="number" autoComplete="on" id="bail" required {...register("bail")} />
          </InputContainer>

          <InputContainer label="Duração" id="duration" errorMsg={errors?.duration?.message} >
            <input className={inputDefaultStyle} type="number" autoComplete="on" id="duration" required {...register("duration")} />
          </InputContainer>

          <InputContainer label="Juros" id="interest" errorMsg={errors?.interest?.message} >
            <input className={inputDefaultStyle} type="number" autoComplete="on" id="interest" required {...register("interest")} />
          </InputContainer>

          <InputContainer label="Mora" id="arrears" errorMsg={errors?.arrears?.message} >
            <input className={inputDefaultStyle} type="number" autoComplete="on" id="arrears" required {...register("arrears")} />
          </InputContainer>

          <InputContainer label="Data inicial" id="initial-date" errorMsg={errors?.initialDate?.message} >
            <input className={inputDefaultStyle} type="date" min={fiveYearsBack} max={fiveYearsAfter}
              defaultValue={contract?.initialDate.toLocaleDateString('en-CA') || today} id="initial-date" required {...register("initialDate", { valueAsDate: true })} />
          </InputContainer>

          {loadedTenants &&
            <InputContainer label="Locatário" id="tenant-id" errorMsg={errors?.tenantId?.message} >
              <select className={inputDefaultStyle} id="tenant-id" required {...register("tenantId")} >
                {
                  tenants.map(tenant => (
                    <option value={tenant.id} key={tenant.id}>{tenant.name}</option>
                  ))
                }
              </select>
            </InputContainer>
          }

          {loadedHouses &&
            <InputContainer label="Casa" id="house-id" errorMsg={errors?.houseId?.message} >
              <select className={inputDefaultStyle} id="house-id" required {...register("houseId")} >
                {
                  houses.map(house => (
                    <option value={house.id} key={house.id}>{`${house.street}, ${house.number}`}</option>
                  ))
                }
              </select>
            </InputContainer>
          }

          <InputContainer label="Número do Cliente" id="electricity-id" errorMsg={errors?.electricityId?.message} >
            <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={255}
              placeholder="006599975" id="electricity-id" required {...register("electricityId")} />
          </InputContainer>

          <InputContainer label="Número de Inscrição" id="water-id" errorMsg={errors?.waterId?.message} >
            <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={255}
              placeholder="006599975" id="water-id" required {...register("waterId")} />
          </InputContainer>

        </div>
      </fieldset>

      <div className="flex flex-col md:flex-row gap-6">
        {
          [0, 1].map(index => (
            <fieldset key={index}>
              <legend className="mx-auto">
                <h3 className="text-2xl font-semibold text-center mb-5">Testemunha 0{index + 1}</h3>
              </legend>

              <div className="grid md:grid-cols-2 gap-x-6 gap-y-2">
                <InputContainer parentClasses="col-span-full" label="Nome" id="name" errorMsg={errors?.witnesses?.[index]?.name?.message}>
                  <input className={inputDefaultStyle} type="text" autoComplete="name" maxLength={255}
                    placeholder="Fulano da Silva" id="name" required {...register(`witnesses.${index}.name` as const)} />
                </InputContainer>

                <InputContainer label="RG" id="rg" errorMsg={errors?.witnesses?.[index]?.rg?.message}>
                  <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={255}
                    placeholder="220436629" id="rg" required {...register(`witnesses.${index}.rg` as const)} />
                </InputContainer>

                <InputContainer label="Orgão emissor" id="rgEmitter" errorMsg={errors?.witnesses?.[index]?.rgEmitter?.message} >
                  <input className={inputDefaultStyle + ' uppercase'} type="text" autoComplete="on" maxLength={255} defaultValue="SSP/CE"
                    placeholder="SSP/CE" id="rgEmitter" required {...register(`witnesses.${index}.rgEmitter` as const)} />
                </InputContainer>

                <InputContainer label="CPF" id="cpf" errorMsg={errors?.witnesses?.[index]?.cpf?.message} >
                  <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={255}
                    placeholder="22610091001" id="cpf" required {...register(`witnesses.${index}.cpf` as const)} />
                </InputContainer>

                <InputContainer label="Telefone principal" id="primary-phone" errorMsg={errors?.witnesses?.[index]?.primaryPhone?.message} >
                  <input className={inputDefaultStyle} type="tel" inputMode="tel" autoComplete="tel" maxLength={255}
                    placeholder="85985964823" id="primary-phone" required {...register(`witnesses.${index}.primaryPhone` as const)} />
                </InputContainer>

                <InputContainer label="Telefone secundário" id="secondary-phone" errorMsg={errors?.witnesses?.[index]?.secondaryPhone?.message} >
                  <input className={inputDefaultStyle} type="tel" inputMode="tel" autoComplete="tel" maxLength={255}
                    placeholder="85985964823" id="secondary-phone" {...register(`witnesses.${index}.secondaryPhone` as const)} />
                </InputContainer>

                <InputContainer parentClasses="md:col-span-full lg:col-span-1" label="Email" id="email" errorMsg={errors?.witnesses?.[index]?.email?.message} >
                  <input className={inputDefaultStyle} type="email" inputMode="email" autoComplete="email" maxLength={255}
                    placeholder="fulano@email.com" id="email" {...register(`witnesses.${index}.email` as const)} />
                </InputContainer>

                {contract?.witnesses[index]?.id &&
                  <input className="hidden" type="text" id="witness-id" readOnly {...register(`witnesses.${index}.id` as const)} />
                }
              </div>
            </fieldset>
          ))
        }

      </div>
      <button className="block w-1/4 min-w-min bg-link disabled:bg-slate-200 rounded-lg text-lg font-semibold text-white mt-8 mx-auto py-3 px-8"
        disabled={(edit.isLoading || create.isLoading) || !isDirty}>
        {action === "create" ? "Cadastrar" : "Editar"}
      </button>
    </form>
  );
};

export default Form;
