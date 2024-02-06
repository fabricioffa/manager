import SideBar from './SideBar';
import { UserButton } from '@clerk/nextjs';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ConfirmationDialog from './ConfirmationDialog';

export default function Layout({ children }: { children: JSX.Element }) {
  const [isVisible, setIsVisible] = useState(true);

  return (
    <div className='grid h-screen w-full overflow-auto bg-white text-secondary antialiased dark:bg-slate-900 dark:text-slate-200 lg:grid-cols-[max(20%,17rem)_1fr]'>
      <SideBar isVisible={isVisible} />
      <main className='my-2.5 rounded-l-2xl bg-red-100 px-6 pt-10 dark:bg-slate-800 max-lg:mx-5 max-lg:rounded-r-2xl lg:col-start-2'>
        {/* <GoBackBtn /> */}
        <UserButton afterSignOutUrl='/' />
        {children}
        <button
          className='fixed right-10 top-[5%] sm:right-16 lg:hidden'
          onClick={() => setIsVisible(!isVisible)}
        >
          {/* <FontAwesomeIcon icon={'bars'} className='text-3xl' /> */}
        </button>
      </main>
      <ConfirmationDialog />
    </div>
  );
}
