import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'
import 'swiper/css';

const Home: NextPage = () => {
  // const { data: dueToThisWeek = [], refetch } = trpc.contracts.dueToThisWeek.useQuery()
  const { mutate } = trpc.contracts.createDebits.useMutation()
  const { mutate: updateDebits } = trpc.debits.update.useMutation()
  // const { data, isSuccess } = trpc.debits.findall.useQuery()
  // isSuccess && console.log('data', data);
  
  return (
    <div>
      <h1 className='text-4xl text-center font-bold my-10'>Bem vindo</h1>

      <div className='flex gap-5'>
        <button onClick={() => mutate()}>Generate Debits</button>
        <button onClick={() => updateDebits()}>Update Debits</button>
      </div>

      {/* <div className='max-w-[92rem]'>
        <h2 className='text-2xl text-center font-medium mb-10'>Vencimentos da semana</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          className=""
        >
          {
            dueToThisWeek.map((contract) => (
              <SwiperSlide key={contract.id}>
                <Card key={contract.id} contract={contract} />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div> */}
    </div>
  )
}

export default Home
