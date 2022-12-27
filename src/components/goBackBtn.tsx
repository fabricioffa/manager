import { useRouter } from 'next/router'

const GoBackBtn = () => {
  const router = useRouter()

  return (
    <button type="button" onClick={() => router.back()}>
      Back
    </button>
  )
}

export default GoBackBtn
