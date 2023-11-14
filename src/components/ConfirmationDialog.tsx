import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useCallback, useEffect, useRef } from 'react';
import { useAtomValue, useSetAtom } from 'jotai';
import { dialogAtom } from '../global-state/atoms';

const ConfirmationDialog = () => {
  const dialogRef = useRef<null | HTMLDialogElement>(null);
  const declineBtnRef = useRef<null | HTMLButtonElement>(null);
  const dialog = useAtomValue(dialogAtom);
  const setDialog = useSetAtom(dialogAtom);

  const closeDialog = useCallback(
    () => setDialog({ isOpen: false }),
    [setDialog]
  );

  dialog.isOpen ? dialogRef.current?.showModal() : dialogRef.current?.close();

  const sincClose = useCallback(
    (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return;
      e.preventDefault();
      closeDialog();
    },
    [closeDialog]
  );

  useEffect(() => {
    const dialogEl = dialogRef.current;
    dialogEl?.addEventListener('keydown', sincClose);
    declineBtnRef.current?.focus();
    return () => dialogEl?.removeEventListener('keydown', sincClose);
  }, [sincClose]);

  return (
    <dialog className='bg-transparent p-0 backdrop:bg-black/40' ref={dialogRef}>
      <div className='relative flex flex-col items-center gap-4 rounded-xl bg-red-100 p-5 dark:bg-slate-700'>
        <button className='absolute right-3 top-3' onClick={closeDialog}>
          <FontAwesomeIcon icon={'close'} className='text-2xl' />
        </button>
        <FontAwesomeIcon icon={'trash-can'} className='text-2xl' />
        <p>Tem certeza que deseja excluir esse item?</p>
        <menu className='flex justify-around gap-4'>
          <li>
            <button
              className='rounded-lg bg-transparent px-3 py-2 text-sm font-medium ring-1 dark:ring-gray-200 dark:hover:bg-gray-200 dark:hover:text-slate-700'
              onClick={() => {
                dialog.onConfirmation && dialog.onConfirmation()
                closeDialog()
              }}
            >
              Sim
            </button>
          </li>
          <li>
            <button
              ref={declineBtnRef}
              className='rounded-lg bg-red-600 px-3 py-2 text-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-4 focus:ring-red-300 dark:bg-link-500  dark:hover:bg-link dark:focus:ring-link-900'
              onClick={closeDialog}
            >
              Não
            </button>
          </li>
        </menu>
      </div>
    </dialog>
  );
};

export default ConfirmationDialog;
