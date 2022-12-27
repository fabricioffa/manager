import { FC, ReactNode } from "react";
import ErrorMsg from "./errorMsg";

type InputContainerProps = {
  label: string;
  id: string;
  errorMsg?: string;
  parentClasses?: string
  children: ReactNode;
}

const InputContainer: FC<InputContainerProps> = ({ label, id, parentClasses, errorMsg, children }) => {
  return (
    <div className={parentClasses}>
      <label htmlFor={id}>{label}</label>
      {children}
      <ErrorMsg msg={errorMsg} />
    </div>
  );
};

export default InputContainer;
