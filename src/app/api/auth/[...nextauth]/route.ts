import NextAuth from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

const handler = NextAuth({
  providers: [
    // 1. Instant One-Click Google Account Provider for mhr7028@gmail.com
    CredentialsProvider({
      id: 'google-demo',
      name: 'Google 계정 (대표님)',
      credentials: {},
      async authorize() {
        return {
          id: 'user-mhr7028',
          name: '대표님 (mhr7028)',
          email: 'mhr7028@gmail.com',
          image: 'https://lh3.googleusercontent.com/a/default-user=s96-c',
        };
      },
    }),

    // 2. Real Google OAuth Provider (used when real keys are added to .env.local)
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || '',
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET || 'hboshbos-secret-key-12345',
  callbacks: {
    async session({ session, token }) {
      if (session?.user) {
        (session.user as any).id = token.sub;
      }
      return session;
    },
  },
});

export { handler as GET, handler as POST };
