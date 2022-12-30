import type { CreateTenant, TenantWithPixKeys } from "../../server/schemas/tenant.schema";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { createTenantSchema } from "../../server/schemas/tenant.schema";
import { trpc } from "../../utils/trpc";
import { useForm, useFieldArray, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputContainer from "../InputContainer";
import { getDirtyValues } from "../../utils/zodHelpers";
import { useRouter } from "next/router";

const inputDefaultStyle =
  "mt-1 neighborhood  w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 focus:outline-link py-2 px-3";
interface FormProps {
  tenant?: TenantWithPixKeys;
  action: "create" | "edit";
}

const today = new Intl.DateTimeFormat("fr-CA", { year: "numeric", month: "2-digit", day: "2-digit" }).format(Date.now())
const lastYear = `${new Date().getFullYear()}-01-01`;

const Form = ({ tenant, action }: FormProps) => {
  const create = trpc.tenants.create.useMutation();
  const edit = trpc.tenants.edit.useMutation();

  const { register, handleSubmit, formState: { errors }, control } = useForm<CreateTenant>({
    resolver: zodResolver(createTenantSchema),
    mode: "onBlur",
    defaultValues: {
      name: tenant?.name,
      email: tenant?.email,
      maritalStatus: tenant?.maritalStatus,
      profession: tenant?.profession,
      cpf: tenant?.cpf,
      rg: tenant?.rg,
      rgEmitter: tenant?.rgEmitter || 'SSP/CE',
      primaryPhone: tenant?.primaryPhone,
      secondaryPhone: tenant?.secondaryPhone,
      obs: tenant?.obs,
      electricityId: tenant?.electricityId,
      waterId: tenant?.waterId,
      debit: Number(tenant?.debit) || 0,
      pixKeys: tenant?.pixKeys,
    }
  });

  const { fields, append, remove } = useFieldArray({ name: 'pixKeys', control });
  const { tenants } = trpc.useContext();
  const { dirtyFields, isDirty } = useFormState({ control })
  const { push } = useRouter()

  const onInvalid: SubmitErrorHandler<CreateTenant> = (errors) => { // TODO: DELENDUS
    console.log('errors', errors);
  }

  const onValid: SubmitHandler<CreateTenant> = (rawData, e) => {
    if (action === "edit" && tenant) {
      const { pixKeys: pixKeysData, ...tenantData } = getDirtyValues<CreateTenant>(dirtyFields, rawData)

      edit.mutate({ tenantData, pixKeysData, tenantId: tenant.id }, {
        onSuccess() {
          tenants.findAll.invalidate()
          tenants.findOne.invalidate({ id: tenant.id })
        }
      })
      return
    }

    create.mutate(rawData, {
      onSuccess() {
        e?.target.reset();
        tenants.findAll.invalidate()
        push('/inquilinos/pesquisar')
      },
    });
  };


  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <fieldset>
        <legend className="mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-12">
            {action === "create" ? "Cadastrar" : "Editar"}{" "}
            Inquilino
          </h2>
        </legend>

        {(edit.isSuccess || create.isSuccess) && (
          <p className="text-3xl font-semibold text-center text-link mb-12">
            Inquilino{" "}
            {action === "create" ? "cadastrado" : "editado"} com
            sucesso!
          </p>
        )}

        <div className="space-y-2">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
            <InputContainer label="Nome" id="name" errorMsg={errors?.name?.message} >
              <input className={inputDefaultStyle} type="text" autoComplete="name" maxLength={255}
                placeholder="Fulano da Silva" id="name" required {...register("name")} />
            </InputContainer>

            <InputContainer label="Profissão" id="profession" errorMsg={errors?.profession?.message} >
              <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={255}
                placeholder="Sapateiro" id="profession" required {...register("profession")} />
            </InputContainer>

            <InputContainer label="Estado Civil" id="marital-status" errorMsg={errors?.maritalStatus?.message} >
              <select className="mt-1 neighborhood  w-full rounded-md bg-gray-100 border-transparentfocus:border-gray-500 focus:outline-link py-2 px-3"
                id="marital-status" required {...register("maritalStatus")} >
                <option value="solteiro">Solteiro</option>
                <option value="casado">Casado</option>
                <option value="divorciado">Divorciado</option>
                <option value="viuvo">Viúvo</option>
              </select>
            </InputContainer>

            <InputContainer label="RG" id="rg" errorMsg={errors?.rg?.message}>
              <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={255}
                placeholder="220436629" id="rg" required {...register("rg")} />
            </InputContainer>

            <InputContainer label="Orgão emissor" id="rgEmitter" errorMsg={errors?.rgEmitter?.message} >
              <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={255}
                placeholder="220436629" id="rgEmitter" required {...register("rgEmitter")} />
            </InputContainer>

            <InputContainer label="CPF" id="cpf" errorMsg={errors?.cpf?.message} >
              <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={255}
                placeholder="22610091001" id="cpf" required {...register("cpf")} />
            </InputContainer>

            <InputContainer label="Telefone principal" id="primary-phone" errorMsg={errors?.primaryPhone?.message} >
              <input className={inputDefaultStyle} type="tel" inputMode="tel" autoComplete="tel" maxLength={255}
                placeholder="85985964823" id="primary-phone" required {...register("primaryPhone")} />
            </InputContainer>

            <InputContainer label="Telefone secundário" id="secondary-phone" errorMsg={errors?.secondaryPhone?.message} >
              <input className={inputDefaultStyle} type="tel" inputMode="tel" autoComplete="tel" maxLength={255}
                placeholder="85985964823" id="secondary-phone" {...register("secondaryPhone")} />
            </InputContainer>

            <InputContainer parentClasses="md:col-span-full lg:col-span-1" label="Email" id="email" errorMsg={errors?.email?.message} >
              <input className={inputDefaultStyle} type="email" inputMode="email" autoComplete="email" maxLength={255}
                placeholder="fulano@email.com" id="email" {...register("email")} />
            </InputContainer>

            <InputContainer label="Número do Cliente" id="electricity-id" errorMsg={errors?.electricityId?.message} >
              <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={255}
                placeholder="006599975" id="electricity-id" required {...register("electricityId")} />
            </InputContainer>

            <InputContainer label="Número de Inscrição" id="water-id" errorMsg={errors?.waterId?.message} >
              <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={255}
                placeholder="006599975" id="water-id" required {...register("waterId")} />
            </InputContainer>

            <InputContainer label="Debito" id="debit" errorMsg={errors?.debit?.message} >
              <input className={inputDefaultStyle} type="number" autoComplete="on" min={0} step={.01} max={100000}
                placeholder="0" id="debit"  {...register("debit", { valueAsNumber: true })} />
            </InputContainer>

            <InputContainer label="Último pagamento" id="lastPayment" errorMsg={errors?.lastPayment?.message} >
              <input className={inputDefaultStyle} type="date" id="lastPayment" min={lastYear} max={today}
                defaultValue={tenant?.lastPayment?.toLocaleDateString('en-CA')} {...register("lastPayment", { valueAsDate: true })} />
            </InputContainer>

          </div>

          <div className="flex gap-7 child:flex-1">
            <div className="flex flex-col gap-6 ">
              <InputContainer label="Observações" id="obs" errorMsg={errors?.obs?.message} >
                <textarea className={inputDefaultStyle + " resize-none"} placeholder="Paga atrasado, faz bagunça..."
                  spellCheck id="obs" cols={30} rows={8} {...register("obs")} />
              </InputContainer>

              <button className="bg-link disabled:bg-slate-200 rounded-lg text-lg font-semibold text-white mt-auto py-3 px-8"
                disabled={(edit.isLoading || create.isLoading) || !isDirty}>
                {action === "create" ? "Cadastrar" : "Editar"}
              </button>
            </div>

            <section>
              <div className="flex items-center justify-center gap-3">
                <h3 className="text-lg text-center font-medium ">Chaves de Pix</h3>
                <button className="text-green-600" type="button" aria-label="Acrescentar chave"
                  onClick={() => append({ key: '', keyType: 'email', id: '' })}>
                  <i className="fa-solid fa-circle-plus"></i>
                </button>
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => {
                  return (
                    <fieldset className="flex items-center justify-center gap-x-6 gap-y-2" key={field.id}>
                      <InputContainer parentClasses="w-full" label="Tipo de chave" id="type" errorMsg={errors?.pixKeys?.[index]?.keyType?.message}>
                        <select className="mt-1 w-full rounded-md bg-gray-100 border-transparentfocus:border-gray-500 focus:outline-link py-2 px-3"
                          id="type" {...register(`pixKeys.${index}.keyType` as const)}>
                          <option value="email">email</option>
                          <option value="cpf">cpf</option>
                          <option value="cnpj">cnpj</option>
                          <option value="celular">celular</option>
                          <option value="aleatoria">aleatoria</option>
                        </select>
                      </InputContainer>

                      <InputContainer parentClasses="w-full" label="Chave" id="key" errorMsg={errors.pixKeys?.[index]?.key?.message}>
                        <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={35}
                          placeholder="006599975" id="key" {...register(`pixKeys.${index}.key` as const)} />
                      </InputContainer>

                      <input className="hidden" type="text" id="pixkey-id" readOnly {...register(`pixKeys.${index}.id` as const)} />

                      <button className="self-end mb-3 text-red-500" type="button" aria-label="Remover esta chave" onClick={() => remove(index)}>
                        <i className="fa-solid fa-circle-minus"></i>
                      </button>
                    </fieldset>
                  );
                })}
              </div>
            </section>
          </div>


        </div>
      </fieldset>
    </form>
  );
};

export default Form;
