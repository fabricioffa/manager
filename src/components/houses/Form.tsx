import { createHouseSchema } from "../../server/schemas/house.schema";
import type { CreateHouseSchema } from "../../server/schemas/house.schema";
import { trpc } from "../../utils/trpc";
import { useForm, useFormState } from "react-hook-form";
import type { SubmitHandler, SubmitErrorHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import InputContainer from "../InputContainer";
import type { House } from "@prisma/client";
import { getDirtyValues } from "../../utils/zodHelpers";
import { useRouter } from "next/router";

const inputDefaultStyle =
  "mt-1 neighborhood w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 focus:outline-link py-2 px-3";
interface FormProps {
  house?: House ;
  action: "create" | "edit";
}

const Form = ({ house, action }: FormProps) => {

  const create = trpc.houses.create.useMutation();
  const edit = trpc.houses.edit.useMutation();

  const { register, handleSubmit, formState: { errors }, control} = useForm<CreateHouseSchema>({
    resolver: zodResolver(createHouseSchema),
    mode: "onBlur",
    defaultValues: house
      ? {
        street: house.street,
        number: house.number,
        complement: house.complement,
        neighborhood : house.neighborhood ,
        city: house.city,
        iptu: house.iptu,
        type: house.type,
        description: house.description,
        electricityId: house.electricityId,
        waterId: house.waterId,
        }
      : undefined,
  });

  const { houses } = trpc.useContext();

  const { dirtyFields, isDirty } = useFormState({control})

  const onInvalid: SubmitErrorHandler<CreateHouseSchema> = (errors) => { // TODO: DELENDUS
    console.log('%cerrors', 'color: red', errors);
  }

  const { push } = useRouter()


  const onValid: SubmitHandler<CreateHouseSchema> = (data, e) => {
    if (action === "edit" && house) {

      const houseData = getDirtyValues<CreateHouseSchema>(dirtyFields, data)

      edit.mutate({ houseData, houseId: house.id }, {
        onSuccess() {
          houses.findAll.invalidate()
          houses.findOne.invalidate({ id: house.id })
        }
      })
      return
    }

    create.mutate(data, {
      onSuccess() {
        e?.target.reset();
        houses.findAll.invalidate()
        push('/casas/pesquisar')
      },
    });
  };

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <fieldset>
        <legend className="mx-auto">
          <h2 className="text-4xl font-semibold text-center mb-12">
            {action === "create" ? "Cadastrar" : "Editar"}{" "}
            Casa
          </h2>
        </legend>

        {(edit.isSuccess || create.isSuccess) && (
          <p className="text-3xl font-semibold text-center text-link mb-12">
            Casa{" "}
            {action === "create" ? "cadastrado" : "editado"} com
            sucesso!
          </p>
        )}

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-2">
          <InputContainer label="Rua" id="street" errorMsg={errors?.street?.message}>
            <input className={inputDefaultStyle} type="text" autoComplete="address-level3" maxLength={191}
              placeholder="R. das Laranjeiras" id="street" {...register("street")} />
          </InputContainer>

          <InputContainer label="Número" id="number" errorMsg={errors?.number?.message}>
            <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={20}
              placeholder="775" id="number" {...register("number")} />
          </InputContainer>

          <InputContainer label="Complemento" id="complement" errorMsg={errors?.complement?.message}>
            <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={191}
              placeholder="Inrriba do morro" id="complement" {...register("complement")} />
          </InputContainer>

          <InputContainer label="Bairro" id="neighborhood" errorMsg={errors?.neighborhood?.message}>
            <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={100}
              placeholder="Zé Valter" id="neighborhood" {...register("neighborhood")} />
          </InputContainer>

          <InputContainer label="Cidade" id="city " errorMsg={errors?.city?.message}>
            <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={100}
              placeholder="Fortaleza" id="city " {...register("city")} />
          </InputContainer>

          <InputContainer label="IPTU" id="iptu" errorMsg={errors?.iptu?.message}>
            <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={14}
              placeholder="Fortaleza" id="iptu" {...register("iptu")} />
          </InputContainer>

          <InputContainer label="Tipo" id="type" errorMsg={errors?.type?.message} >
            <select className="mt-1 neighborhood w-full rounded-md bg-gray-100 border-transparent
            focus:border-gray-500 focus:outline-link py-2 px-3" id="type" {...register("type")}>
              <option value="residencial">Residencial</option>
              <option value="comercial">Comercial</option>
            </select>
          </InputContainer>

          <InputContainer label="Número da Instalação" id="electricity-id" errorMsg={errors?.electricityId?.message} >
            <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={50}
              placeholder="006599asdf975" id="electricity-id" {...register("electricityId")} />
          </InputContainer>

          <InputContainer label="Hidrômetro" id="water-id" errorMsg={errors?.waterId?.message} >
            <input className={inputDefaultStyle} type="text" autoComplete="on" maxLength={50}
              placeholder="00659asda9975" id="water-id" {...register("waterId")} />
          </InputContainer>

          <InputContainer parentClasses="md:col-span-2" label="Descrição" id="description" errorMsg={errors?.description?.message} >
            <textarea className={inputDefaultStyle + " resize-none"} placeholder="Era uma casa muito engraçada..." maxLength={4000}
              spellCheck id="description" cols={30} rows={8} {...register("description")} />
          </InputContainer>

          <button disabled={(create.isLoading || edit.isLoading) || !isDirty }
            className="bg-link disabled:bg-slate-200 rounded-lg text-lg font-semibold text-white md:mt-7 mb-2 py-3 px-8">
            {action === "create" ? "Cadastrar" : "Editar"}
          </button>
        </div>
      </fieldset>
    </form>
  );
};

export default Form;
