import type { NextPage } from 'next';
import { trpc } from '../utils/trpc';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import Card from '../components/contracts/Card';
import DebitorCard from '../components/DebitorCard';

const Home: NextPage = () => {
  const { data: dueToThisWeek = [] } = trpc.contracts.dueToThisWeek.useQuery();
  const { data: lateDebits = [] } = trpc.debits.lateDebits.useQuery();
  const { debits } = trpc.useUtils();
  const { mutate, isLoading } = trpc.debits.update.useMutation({
    onSuccess: data => {
    if (data !== 'No late debits' && data.updates.some(debit => typeof debit !== 'string')) {
      debits.lateDebits.invalidate()
    }
  }});

  return (
    <div className='relative'>
      <h1 className='my-10 text-center text-4xl font-bold'>Bem vindo</h1>

      <button
        className='absolute right-6 top-6 rounded-md bg-link px-4 py-1.5 active:scale-95 disabled:bg-link-800'
        disabled={isLoading}
        onClick={() => mutate()}
      >
        Update
      </button>

      <div className='mx-auto mb-20 max-w-[75vw]'>
        <h2 className='mb-10 text-center text-2xl font-medium'>
          Vencimentos da semana
        </h2>
        <Swiper
          spaceBetween={20}
          slidesPerView={5}
          centerInsufficientSlides={true}
          grabCursor={true}
          tag='div'
          wrapperTag='div'
          className='p-5'
        >
          {dueToThisWeek.map((contract) => (
            <SwiperSlide key={contract.id} tag='ul' className='p-2'>
              <Card key={contract.id} contract={contract} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      {!!lateDebits.length && (
        <div className='max-w-[75vw]'>
          <h2 className='mb-10 text-center text-2xl font-medium'>Devedores</h2>
          <Swiper
            spaceBetween={20}
            slidesPerView={5}
            centerInsufficientSlides={true}
            grabCursor={true}
            tag='div'
            wrapperTag='ul'
            className='p-5'
          >
            {lateDebits.map((debit) => (
              <SwiperSlide key={debit.id} tag='li' className='p-2'>
                <DebitorCard debit={debit} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}
    </div>
  );
};

export default Home;
