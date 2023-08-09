import { FC, ReactNode } from "react";
import CardActionBtns, { type CardActionBtnsProps } from "./CardActionBtns";

type BaseCardProps =
  | ({
      children: ReactNode
      withActions: true;
    } & CardActionBtnsProps)
    | {
      children: ReactNode
      withActions: false;
    };

const BaseCard: FC<BaseCardProps> = (props) => {
  return (
    <li className="grid rounded-md bg-white/10 p-4 text-lg shadow-card ring">
      <div className="grid grid-cols-[1.9rem_1fr] grid-rows-[3rem_auto] items-center gap-2">
        { props.children }
      </div>
      {
        props.withActions &&
        <CardActionBtns
          profileLink={props.profileLink}
          editLink={props.editLink}
          deleteFunc={props.deleteFunc}
        />

      }
    </li>
  );
};

export default BaseCard;
