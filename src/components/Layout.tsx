import SideBar from "./SideBar";
import { signIn, useSession } from "next-auth/react";

export default function Layout({ children }: { children: JSX.Element }) {
  const { data: session } = useSession();

  if (!session)
    return (
      <>
        <div className="text-9xl text-center">Manager?</div>
        <button
          className="neighborhood  mx-auto text-6xl mt-40"
          onClick={() => signIn()}
        >
          Log in
        </button>
      </>
    );

  return (
    <div className="grid lg:grid-cols-[max(20%,17rem)_1.6rem_1fr_1.6rem] grid-cols-[1.6rem_1fr_1.6rem]  min-h-screen w-full py-12 text-secondary">
      <SideBar />
      <main className="col-start-2 col-end-3 lg:col-start-3 lg:col-end-4">
        {children}
      </main>
    </div>
  );
}
