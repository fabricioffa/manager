import { type AppType } from 'next/app';
// import { type Session } from 'next-auth';
// import { SessionProvider } from 'next-auth/react';
import { ClerkProvider } from '@clerk/nextjs';

import { trpc } from '../utils/trpc';
import '../utils/fasIcons';

import '../styles/globals.scss';
import Layout from '../components/Layout';

const MyApp: AppType = ({ Component, pageProps: { ...pageProps } }) => {
  return (
    <ClerkProvider {...pageProps}>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </ClerkProvider>
    // <SessionProvider session={session}>
    //   <Layout>
    //     <Component {...pageProps} />
    //   </Layout>
    // </SessionProvider>
  );
};

export default trpc.withTRPC(MyApp);
