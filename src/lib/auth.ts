import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import bcrypt from 'bcryptjs';
import { prisma } from './prisma';

// Type augmentation for NextAuth v5
declare module 'next-auth' {
  interface User {
    role?: string | null;
  }
  interface Session {
    user: {
      id: string;
      role: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
}


export const { handlers, auth, signIn, signOut } = NextAuth({
  // NOTE: PrismaAdapter skipped — User.id is Int, adapter expects String.
  // Account/Session/VerificationToken schema models are ready for future OAuth.
  session: { strategy: 'jwt' },
  pages: {
    signIn:  '/auth/login',
    newUser: '/auth/register',
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id   = String(user.id);
        token.role = user.role ?? 'user';
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id   = token.id   as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  providers: [
    Credentials({
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });
        if (!user || !user.password) return null;
        const valid = await bcrypt.compare(
          credentials.password as string,
          user.password,
        );
        if (!valid) return null;
        return { id: String(user.id), email: user.email, name: user.name, role: user.role };
      },
    }),
  ],
});
