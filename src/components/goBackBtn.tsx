import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/router';

const GoBackBtn = ({ classes }: { classes?: string }) => {
  const router = useRouter();

  return (
    <button
      className={`fixed left-10 top-[4%] z-50 grid h-10 w-10 place-items-center rounded-full border border-link bg-white text-2xl text-link sm:left-12 sm:h-12 sm:w-12 sm:text-3xl ${classes}`}
      type='button'
      onClick={() => router.back()}
    >
      <span className='sr-only'>Back</span>
      <FontAwesomeIcon icon='left-long' />
    </button>
  );
};

export default GoBackBtn;
