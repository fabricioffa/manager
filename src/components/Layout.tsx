import SideBar from "./SideBar";
import { signIn, signOut, useSession } from "next-auth/react";
import GoBackBtn from "./goBackBtn";
import Image from "next/image";

export default function Layout({ children }: { children: JSX.Element }) {
  const { data: session, } = useSession();

  if (!session)
    return (
      <div className="grid grid-rows-2 h-screen">
        <h1 className="text-9xl text-center mt-28">Manager</h1>
        <button
          className="block bg-link rounded-md text-6xl text-white mb-auto mx-auto pt-3 pb-6 px-8 hover:bg-link/90 active:scale-95 "
          onClick={() => signIn()}
        >
          Login
        </button>
      </div>
    );

  if (session.user?.role !== 'ADMIN')
    return (
      <div className="w-screen h-screen">
        <Image className="w-full h-full object-contain" src="/images/not-mama.webp" alt="Baby: not mamma!" />
        <button className='p-2 border-r-lg pl-8 font-bold text-lg' onClick={() => signOut()}>Log out</button>
      </div>
    )

  return (
    <div className="grid lg:grid-cols-[max(20%,17rem)_1.6rem_1fr_1.6rem] grid-cols-[1.6rem_1fr_1.6rem] min-h-screen w-full py-12 text-secondary">
      <SideBar />
      <main className="col-start-2 col-end-3 lg:col-start-3 lg:col-end-4">
        <GoBackBtn />
        {children}
      </main>
    </div>
  );
}
