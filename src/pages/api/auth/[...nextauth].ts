import NextAuth, { type NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';

// Prisma adapter for NextAuth, optional and can be removed
import { PrismaAdapter } from '@next-auth/prisma-adapter';

import { env } from '../../../env/server.mjs';
import { prisma } from '../../../server/db/client';

export const authOptions: NextAuthOptions = {
  // Include user.id on session
  callbacks: {
    async signIn({ user }) {
      if (!user.email) return true;
      if (env.ADMIN_EMAILS.split(' ').includes(user.email)) user.role = 'ADMIN'; //TODO: É... então '-'
      return true;
    },
    session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        session.user.role = user.role;
      }
      return session;
    },
  },
  // Configure one or more authentication providers
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // ...add more providers here
  ],
};

export default NextAuth(authOptions);
