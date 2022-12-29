import { useRouter } from 'next/router'

const GoBackBtn = ({classes}: {classes?: string}) => {
  const router = useRouter()

  return (
    <button className={`fixed top-[5%] grid place-items-center w-12 h-12 border border-link rounded-full text-3xl text-link ${classes}`} type="button" onClick={() => router.back()}>
      <span className='sr-only'>Back</span>
      <i className="fa-solid fa-left-long"></i>
    </button>
  )
}

export default GoBackBtn
