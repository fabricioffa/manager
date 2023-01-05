import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'
import { ItemsList } from '../components/ItemsList'
import Card from '../components/contracts/Card'
import { daysUntilNextSaturday } from '../utils/functions'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

const Home: NextPage = () => {
  const { data: debitors = [] } = trpc.contracts.debitors.useQuery()
  const { data: dueToThisWeek = [], refetch } = trpc.contracts.dueToThisWeek.useQuery()

  return (
    <div>
      <h1 className='text-4xl text-center font-bold my-10'>Bem vindo</h1>

      {/* <div>
        <h2 className='text-2xl text-center font-medium mb-10'>Atrasados</h2>
        <ItemsList>
          {
            debitors.map(debitor => (
              <Card key={debitor.id} tenant={debitor} />
            ))
          }
        </ItemsList>
      </div> */}


      <div className=''>
        <h2 className='text-2xl text-center font-medium mb-10'>Vencimentos da semana</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={4}
          >
          {
            dueToThisWeek.map((contract) => (
              <SwiperSlide key={contract.id}>
                <Card key={contract.id} contract={contract} />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>
    </div>
  )
}

export default Home
