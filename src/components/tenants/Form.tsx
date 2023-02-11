import type { CreateTenant } from "../../server/schemas/tenant.schema";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import type { RouterOutputs } from "../../utils/trpc";
import type { ChangeEvent } from "react";
import { createTenantSchema } from "../../server/schemas/tenant.schema";
import { trpc } from "../../utils/trpc";
import { useForm, useFieldArray, useFormState } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputContainer from "../InputContainer";
import { getDirtyValues } from "../../utils/zodHelpers";
import { useRouter } from "next/router";
import { formatCnpj, formatCpf, formatOnChange, formatPhone } from "../../utils/function/prod";

const inputDefaultStyle =
  "mt-1 neighborhood w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 focus:outline-link py-2 px-3";
interface FormProps {
  tenant?: RouterOutputs['tenants']['findOne'];
  action: "create" | "edit";
}

const Form = ({ tenant, action }: FormProps) => {
  const create = trpc.tenants.create.useMutation();
  const edit = trpc.tenants.edit.useMutation();
  const { register, handleSubmit, formState: { errors }, control, setValue, getValues } = useForm<CreateTenant>({
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
              <input className={inputDefaultStyle} type="text" autoComplete="name" maxLength={191}
                placeholder="Fulano da Silva" id="name" required {...register("name")} />
            </InputContainer>

            <InputContainer label="Profissão" id="profession" errorMsg={errors?.profession?.message} >
              <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={100}
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
              <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={15}
                placeholder="220436629" id="rg" required {...register("rg")} />
            </InputContainer>

            <InputContainer label="Orgão emissor" id="rgEmitter" errorMsg={errors?.rgEmitter?.message} >
              <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={10}
                placeholder="220436629" id="rgEmitter" required {...register("rgEmitter")} />
            </InputContainer>

            <InputContainer label="CPF" id="cpf" errorMsg={errors?.cpf?.message} >
              <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={14}
                placeholder="123.456.789-11" id="cpf" required {...register("cpf", {
                  onChange: formatOnChange<CreateTenant>({field: 'cpf', formatFunc: formatCpf, setValue: setValue})
                })} />
            </InputContainer>

            <InputContainer label="Telefone principal" id="primary-phone" errorMsg={errors?.primaryPhone?.message} >
              <input className={inputDefaultStyle} type="tel" inputMode="tel" autoComplete="tel" minLength={14} maxLength={15}
                placeholder="(85) 99876-5495" id="primary-phone" required {...register("primaryPhone", {
                  onChange: formatOnChange<CreateTenant>({field: 'primaryPhone', formatFunc: formatPhone, setValue: setValue})
                })} />
            </InputContainer>

            <InputContainer label="Telefone secundário" id="secondary-phone" errorMsg={errors?.secondaryPhone?.message} >
              <input className={inputDefaultStyle} type="tel" inputMode="tel" autoComplete="tel" minLength={14} maxLength={15}
                placeholder="(85) 99876-5495" id="secondary-phone" {...register("secondaryPhone", {
                  onChange: formatOnChange<CreateTenant>({field: 'secondaryPhone', formatFunc: formatPhone, setValue: setValue})
                })} />
            </InputContainer>

            <InputContainer parentClasses="md:col-span-full lg:col-span-1" label="Email" id="email" errorMsg={errors?.email?.message} >
              <input className={inputDefaultStyle} type="email" inputMode="email" autoComplete="email" maxLength={191}
                placeholder="fulano@email.com" id="email" {...register("email")} />
            </InputContainer>

          </div>

          <div className="flex gap-7 child:flex-1">
            <div className="flex flex-col gap-6 ">
              <InputContainer label="Observações" id="obs" errorMsg={errors?.obs?.message} >
                <textarea className={inputDefaultStyle + " resize-none"} placeholder="Paga atrasado, faz bagunça..."
                  spellCheck id="obs" cols={30} rows={8} maxLength={2000} {...register("obs")} />
              </InputContainer>

              <button className="bg-link disabled:bg-slate-200 rounded-lg text-lg font-semibold text-white mt-auto py-3 px-8"
                disabled={(edit.isLoading || create.isLoading) || !isDirty}>
                {action === "create" ? "Cadastrar" : "Editar"}
              </button>
            </div>

            <section>
              <div className="flex items-center justify-center gap-3">
                <h3 className="text-lg text-center font-medium ">Chaves de Pix</h3>
                <button className="text-3xl text-green-600" type="button" aria-label="Acrescentar chave"
                  onClick={() => append({ key: '', keyType: 'email', id: '' })}>
                  <i className="fa-solid fa-circle-plus"></i>
                </button>
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => {
                  return (
                    <fieldset className="flex items-center justify-center gap-x-6 gap-y-2" key={field.id}>
                      <InputContainer parentClasses="self-start w-full" label="Tipo de chave" id={`type-${index}`} errorMsg={errors?.pixKeys?.[index]?.keyType?.message}>
                        <select className="mt-1 w-full rounded-md bg-gray-100 border-transparentfocus:border-gray-500 focus:outline-link py-2 px-3"
                          id={`type-${index}`} {...register(`pixKeys.${index}.keyType` as const, {
                            deps: [`pixKeys.${index}.key`],
                          })}>
                          <option value="email">email</option>
                          <option value="cpf">cpf</option>
                          <option value="cnpj">cnpj</option>
                          <option value="celular">celular</option>
                          <option value="aleatoria">aleatoria</option>
                        </select>
                      </InputContainer>

                      <InputContainer parentClasses="self-start w-full" label="Chave" id={`key-${index}`} errorMsg={errors.pixKeys?.[index]?.key?.message}>
                        <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={35}
                          placeholder="006599975" id={`key-${index}`} {...register(`pixKeys.${index}.key` as const, {
                            onChange: (e: ChangeEvent<HTMLInputElement>) => {
                              if (getValues(`pixKeys.${index}.keyType`) === 'cpf')
                                formatOnChange<CreateTenant>({field: `pixKeys.${index}.key`, formatFunc: formatCpf, setValue: setValue})(e)
                              if (getValues(`pixKeys.${index}.keyType`) === 'celular')
                                formatOnChange<CreateTenant>({field: `pixKeys.${index}.key`, formatFunc: formatPhone, setValue: setValue})(e)
                              if (getValues(`pixKeys.${index}.keyType`) === 'cnpj')
                                formatOnChange<CreateTenant>({field: `pixKeys.${index}.key`, formatFunc: formatCnpj, setValue: setValue})(e)
                            }
                          })} />
                      </InputContainer>

                      <input className="hidden" type="text" id="pixkey-id" readOnly {...register(`pixKeys.${index}.id` as const)} />

                      <button className="self-center text-3xl text-red-500" type="button" aria-label="Remover esta chave" onClick={() => remove(index)}>
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
