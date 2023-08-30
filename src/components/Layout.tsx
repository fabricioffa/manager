import SideBar from "./SideBar";
import { signIn, signOut, useSession } from "next-auth/react";
import GoBackBtn from "./goBackBtn";
import Image from "next/image";
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ConfirmationDialog from "./ConfirmationDialog";

export default function Layout({ children }: { children: JSX.Element }) {
  const { data: session } = useSession();
  const [isVisible, setIsVisible] = useState(true);

  if (!session)
    return (
      <div className="grid h-screen grid-rows-2">
        <h1 className="mt-28 text-center text-9xl">Manager</h1>
        <button
          className="mx-auto mb-auto  block rounded-md bg-link px-8 pb-6 pt-3 text-6xl text-white hover:bg-link/90 active:scale-95"
          onClick={() => signIn()}
        >
          Login
        </button>
      </div>
    );

  if (session.user?.role !== "ADMIN")
    return (
      <div>
        <Image
          className="h-full w-full object-contain"
          src="/images/not-mama.webp"
          alt="Baby: not mamma!"
        />
        <button
          className="border-r-lg p-2 pl-8 text-lg font-bold"
          onClick={() => signOut()}
        >
          Log out
        </button>
      </div>
    );

  return (
    <div className="grid h-screen w-full overflow-auto bg-white text-secondary antialiased dark:bg-slate-900 dark:text-slate-200 lg:grid-cols-[max(20%,17rem)_1fr]">
      <SideBar isVisible={isVisible} />
      <main className="my-2.5 max-lg:rounded-r-2xl bg-red-100 px-6 pt-10 dark:bg-slate-800 max-lg:mx-5 lg:col-start-2 rounded-l-2xl">
        <GoBackBtn />
        {children}
        <button
          className="fixed right-10 sm:right-16 top-[5%] lg:hidden"
          onClick={() => setIsVisible(!isVisible)}
        >
          <FontAwesomeIcon icon={"bars"} className="text-3xl" />
        </button>
      </main>
      <ConfirmationDialog />
    </div>
  );
}
