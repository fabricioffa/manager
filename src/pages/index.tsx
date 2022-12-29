import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'
import { ItemsList } from '../components/ItemsList'
import Card from '../components/tenants/Card'

const Home: NextPage = () => {
  const { data: debitors = [] } = trpc.tenants.debitors.useQuery()
  const { data: dueToThisWeek = [] } = trpc.contracts.dueToThisWeek.useQuery()
  return (
    <div>
      <h1 className='text-4xl text-center font-bold my-10'>Bem vindo</h1>

      <div>
        <h2 className='text-2xl text-center font-medium mb-10'>Atrasados</h2>
        <ItemsList>
          {
            debitors.map(debitor => (
              <Card key={debitor.id} tenant={debitor} />
            ))
          }
        </ItemsList>
      </div>

      <div>
        <h2 className='text-2xl text-center font-medium mb-10'>Vencimentos da semana</h2>
        <ItemsList>
          {
            dueToThisWeek.map(({ tenant }) => (
              <Card key={tenant.id} tenant={tenant} />
            ))
          }
        </ItemsList>
      </div>
    </div>
  )
}

export default Home
