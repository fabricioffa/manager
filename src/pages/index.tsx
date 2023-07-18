import type { NextPage } from 'next'
import { trpc } from '../utils/trpc'
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Card from '../components/contracts/Card';
import DebitorCard from '../components/DebitorCard';

const Home: NextPage = () => {
  const { data: dueToThisWeek = [] } = trpc.contracts.dueToThisWeek.useQuery()
  const { data: lateDebits = []  } = trpc.debits.lateDebits.useQuery()

  return (
    <div className='max-w-[calc(100%-5rem)] mx-auto'>
      <h1 className='text-4xl text-center font-bold my-10'>Bem vindo</h1>

      <div className='max-w-[75vw] mb-20'>
        <h2 className='text-2xl text-center font-medium mb-10'>Vencimentos da semana</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          centerInsufficientSlides={true}
          grabCursor={true}
          tag='div'
          wrapperTag='div'
          className="p-5"
        >
          {
            dueToThisWeek.map((contract) => (
              <SwiperSlide key={contract.id} tag='ul' className='p-2'>
                <Card key={contract.id} contract={contract} />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>

      { !!lateDebits.length && <div className='max-w-[75vw]'>
        <h2 className='text-2xl text-center font-medium mb-10'>Devedores</h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          centerInsufficientSlides={true}
          grabCursor={true}
          tag='div'
          wrapperTag='ul'
          className="p-5"
        >
          {
            lateDebits.map((debit) => (
              <SwiperSlide key={debit.id} tag='li' className='p-2'>
                <DebitorCard debit={debit} />
              </SwiperSlide>
            ))
          }
        </Swiper>
      </div>}
    </div>
  )
}

export default Home
