import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRouter } from 'next/router'

const GoBackBtn = ({classes}: {classes?: string}) => {
  const router = useRouter()

  return (
    <button className={`fixed top-[5%] grid place-items-center w-12 h-12 bg-white border border-link rounded-full text-3xl text-link z-10 ${classes}`} type="button" onClick={() => router.back()}>
      <span className='sr-only'>Back</span>
      <FontAwesomeIcon icon="left-long" />
    </button>
  )
}

export default GoBackBtn
