import { FC } from "react"

type ErrorMsgProps = {
  msg?: string
}

const ErrorMsg: FC<ErrorMsgProps> = ({msg}) => {
  return (
    <p className="text-sm text-red-500 pt-1 first-letter:pl-3">{ msg }</p>
  )
}

export default ErrorMsg
