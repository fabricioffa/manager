import { useRouter } from "next/router";
import Form from "../components/receipts/Form"
import { trpc } from "../utils/trpc"

const ReceiptGeneretor = () => {
  const { query: { id } } = useRouter();
  const stringId = id as string
  const { data: debit, } = trpc.debits.findOne.useQuery({ id: stringId })

  if (debit) {
    return (
      <div>
        <h1 className="text-4xl text-center font-bold my-10">Gerar recibo</h1>

        <Form debit={debit} />
        <div id="pdf-preview"></div>
      </div>
    )
  }
}

export default ReceiptGeneretor
