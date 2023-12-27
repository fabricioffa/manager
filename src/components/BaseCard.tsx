import type { FC, ReactNode } from 'react';
import CardActionBtns, { type CardActionBtnsProps } from './CardActionBtns';
import { useSetAtom } from 'jotai';
import { dialogAtom } from '../global-state/atoms';
type BaseCardProps =
  | ({
      children: ReactNode;
      withActions: true;
    } & CardActionBtnsProps)
  | {
      children: ReactNode;
      withActions: false;
    };

const BaseCard: FC<BaseCardProps> = (props) => {
  const setDialog = useSetAtom(dialogAtom);
  const openDeleteDialog = () =>
    setDialog({
      isOpen: true,
      onConfirmation: props.withActions ? props.deleteFunc : undefined,
    });

  return (
    <li className='grid min-h-[20rem] rounded-md bg-white/10 p-4 text-lg shadow-card ring'>
      <div className='grid grid-cols-[1.9rem_1fr] grid-rows-[3rem_min-content] items-center gap-2'>
        {props.children}
      </div>
      {props.withActions && (
        <CardActionBtns
          profileLink={props.profileLink}
          editLink={props.editLink}
          deleteFunc={props.deleteFunc ? openDeleteDialog : undefined}
          restoreFunc={props.restoreFunc}
        />
      )}
    </li>
  );
};

export default BaseCard;
