import Link from 'next/link'
import { useRouter } from 'next/router';
import { useState } from 'react';
import SubMenu from './SubMenu';
import { signOut, useSession } from 'next-auth/react';

const SideBar = () => {
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);

  const { data: session } = useSession();
  const isActiveSubMenu = (index: number | null) => activeSubMenu === index ? 'bg-highlight text-link' : '';
  const { pathname } = useRouter()
  const isActiveLink = (route: string) => pathname === route ? 'bg-highlight text-link font-medium' : ''

  return (
    <aside className="fixed inset-y-0 w-[max(20%,17rem)] hidden lg:flex pr-10">
      <nav className="flex flex-col grow">
        <h2 className="text-4xl text-center mt-10">
          <Link href='/'>Manager</Link>
        </h2>

        <ul className="my-auto">
          <li>
            <button className={isActiveSubMenu(0) + ' p-2 border-r-lg pl-8 font-bold text-lg'}
              onClick={() => setActiveSubMenu(isActiveSubMenu(0) ? null : 0)}>
              Inquilinos
            </button>

            <SubMenu isShowing={activeSubMenu !== 0}>
              <li className='text-primary p-2'>
                <Link href="/inquilinos/pesquisar" className={isActiveLink('/inquilinos/pesquisar') + ' block'}>
                  Pesquisar
                </Link>
              </li>
              <li className='text-primary p-2'>
                <Link href="/inquilinos/cadastrar" className={isActiveLink('/inquilinos/cadastrar') + ' block'}>
                  Cadastrar
                </Link>
              </li>
            </SubMenu>
          </li>
          <li>
            <button className={isActiveSubMenu(1) + ' p-2 border-r-lg pl-8 font-bold text-lg'}
              onClick={() => setActiveSubMenu(isActiveSubMenu(1) ? null : 1)}>
              House
            </button>

            <SubMenu isShowing={activeSubMenu !== 1}>
              <li className='text-primary p-2'>
                <Link href="/casas/pesquisar" className={isActiveLink('/casas/pesquisar') + ' block'}>
                  Pesquisar
                </Link>
              </li>
              <li className='text-primary p-2'>
                <Link href="/casas/cadastrar" className={isActiveLink('/casas/cadastrar') + ' block'}>
                  Cadastrar
                </Link>
              </li>
            </SubMenu>
          </li>
          <li>
            <button className={isActiveSubMenu(2) + ' p-2 border-r-lg pl-8 font-bold text-lg'}
              onClick={() => setActiveSubMenu(isActiveSubMenu(2) ? null : 2)}>
              Contracts
            </button>

            <SubMenu isShowing={activeSubMenu !== 2}>
              <li className='text-primary p-2'>
                <Link href="/contratos/pesquisar" className={isActiveLink('/contratos/pesquisar') + ' block'}>
                  Pesquisar
                </Link>
              </li>
              <li className='text-primary p-2'>
                <Link href="/contratos/cadastrar" className={isActiveLink('/contratos/cadastrar') + ' block'}>
                  Cadastrar
                </Link>
              </li>
            </SubMenu>
          </li>
          { session &&
            <li>
              <button className='p-2 border-r-lg pl-8 font-bold text-lg' onClick={() => signOut()}>Log out</button>
            </li>
          }
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
