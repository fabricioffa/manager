import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import SubMenu from "./SubMenu";
import { signOut, useSession } from "next-auth/react";

const SideBar = () => {
  const [activeSubMenu, setActiveSubMenu] = useState<number | null>(null);

  const { data: session } = useSession();
  const isActiveSubMenu = (index: number | null) => activeSubMenu === index;
  const { pathname } = useRouter();
  const isActiveLink = (route: string) =>
    pathname === route ;

  return (
    <aside className="fixed inset-y-0 hidden w-[max(20%,17rem)] pr-10 lg:flex  contain-content">
      <nav className="flex grow flex-col">
        <h2 className="mt-10 text-center text-4xl">
          <Link href="/">Manager</Link>
        </h2>

        <ul className="my-auto">
          <li>
            <button
              data-open={isActiveSubMenu(0)}
              className="p-2 pl-8 text-lg font-bold data-open:bg-highlight data-open:text-link data-open:dark:text-link-500 data-open:dark:border-link dark:ml-6 dark:border-l dark:border-slate-600 dark:pl-2  data-open:dark:bg-inherit"
              onClick={() => setActiveSubMenu(isActiveSubMenu(0) ? null : 0)}
            >
              Inquilinos
            </button>

            <SubMenu isShowing={activeSubMenu !== 0}>
              <li className="p-2 text-primary dark:font-medium dark:text-inherit">
                <Link
                  data-active={isActiveLink("/inquilinos/pesquisar")}
                  href="/inquilinos/pesquisar"
                  className='block data-active:bg-highlight data-active:text-link data-active:font-medium data-active:dark:bg-inherit data-active:dark:text-link-500'
                >
                  Pesquisar
                </Link>
              </li>
              <li className="p-2 text-primary dark:font-medium dark:text-inherit">
                <Link
                  data-active={isActiveLink("/inquilinos/cadastrar")}
                  href="/inquilinos/cadastrar"
                  className='block data-active:bg-highlight data-active:text-link data-active:font-medium data-active:dark:bg-inherit data-active:dark:text-link-500'
                >
                  Cadastrar
                </Link>
              </li>
            </SubMenu>
          </li>
          <li>
            <button
              className={
                isActiveSubMenu(1) +
                " p-2 pl-8 text-lg font-bold dark:ml-6 dark:border-l dark:border-slate-600 dark:pl-2"
              }
              onClick={() => setActiveSubMenu(isActiveSubMenu(1) ? null : 1)}
            >
              House
            </button>

            <SubMenu isShowing={activeSubMenu !== 1}>
              <li className="p-2 text-primary dark:font-medium dark:text-inherit">
                <Link
                  href="/casas/pesquisar"
                  className={isActiveLink("/casas/pesquisar") + " block"}
                >
                  Pesquisar
                </Link>
              </li>
              <li className="p-2 text-primary dark:font-medium dark:text-inherit">
                <Link
                  href="/casas/cadastrar"
                  className={isActiveLink("/casas/cadastrar") + " block"}
                >
                  Cadastrar
                </Link>
              </li>
            </SubMenu>
          </li>
          <li>
            <button
              className={
                isActiveSubMenu(2) +
                " p-2 pl-8 text-lg font-bold dark:ml-6 dark:border-l dark:border-slate-600 dark:pl-2"
              }
              onClick={() => setActiveSubMenu(isActiveSubMenu(2) ? null : 2)}
            >
              Contracts
            </button>

            <SubMenu isShowing={activeSubMenu !== 2}>
              <li className="p-2 text-primary dark:font-medium dark:text-inherit">
                <Link
                  href="/contratos/pesquisar"
                  className={isActiveLink("/contratos/pesquisar") + " block"}
                >
                  Pesquisar
                </Link>
              </li>
              <li className="p-2 text-primary dark:font-medium dark:text-inherit">
                <Link
                  href="/contratos/cadastrar"
                  className={isActiveLink("/contratos/cadastrar") + " block"}
                >
                  Cadastrar
                </Link>
              </li>
            </SubMenu>
          </li>
          {session && (
            <li>
              <button
                className="p-2 pl-8 text-lg font-bold dark:ml-6 dark:border-l dark:border-slate-600 dark:pl-2"
                onClick={() => signOut()}
              >
                Log out
              </button>
            </li>
          )}
        </ul>
      </nav>
    </aside>
  );
};

export default SideBar;
