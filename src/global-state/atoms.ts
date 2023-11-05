import { atom } from 'jotai';

export type DialogAtom = {
  isOpen: boolean;
  onConfirmation?: () => void;
  onClose?: () => void;
  
};

export const dialogAtom = atom<DialogAtom>({
  isOpen: false,
});
