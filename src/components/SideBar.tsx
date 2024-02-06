import Link from 'next/link';
import SubMenu from './SubMenu';
// import { signOut,  } from 'next-auth/react';

export type SideBarProps = {
  isVisible: boolean;
};

const SideBar = ({ isVisible }: SideBarProps) => {
  // const { data: session } = useSession();
  return (
    <aside
      className={`fixed inset-y-0 bottom-0 left-0 z-50 flex px-8 duration-1000 ease-in-out contain-content dark:bg-slate-900 max-lg:absolute max-lg:transition-transform lg:w-[max(20%,17rem)] ${
        isVisible ? 'translate-x-0' : 'max-lg:-translate-x-full'
      }`}
    >
      <nav className='flex grow flex-col'>
        <h2 className='mt-10 text-center text-4xl'>
          <Link href='/'>Manager</Link>
        </h2>

        <ul className='my-auto'>
          <SubMenu
            btnText='Inquilinos'
            links={[
              ['Pesquisar', '/inquilinos/pesquisar'],
              ['Cadastrar', '/inquilinos/cadastrar'],
            ]}
          />
          <SubMenu
            btnText='Casas'
            links={[
              ['Pesquisar', '/casas/pesquisar'],
              ['Cadastrar', '/casas/cadastrar'],
            ]}
          />
          <SubMenu
            btnText='Contratos'
            links={[
              ['Pesquisar', '/contratos/pesquisar'],
              ['Cadastrar', '/contratos/cadastrar'],
            ]}
          />
          <SubMenu
            btnText='Débitos'
            links={[
              ['Pesquisar', '/debitos/pesquisar'],
              ['Cadastrar', '/debitos/cadastrar'],
            ]}
          />

          {/* <li className='px-2'>
            <button
              className='p-2 text-lg font-bold hover:text-link dark:border-l dark:border-slate-600'
              // onClick={() => signOut()}
            >
              Log out
            </button>
          </li> */}

          {/* {session && (
            <li className='px-2'>
              <button
                className='p-2 text-lg font-bold hover:text-link dark:border-l dark:border-slate-600'
                onClick={() => signOut()}
              >
                Log out
              </button>
            </li>
          )} */}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
