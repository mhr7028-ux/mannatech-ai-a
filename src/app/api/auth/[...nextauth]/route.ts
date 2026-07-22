import NextAuth, { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import CredentialsProvider from 'next-auth/providers/credentials';

export const authOptions: NextAuthOptions = {
  providers: [
    // Google OAuth Provider
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo-client-secret',
    }),

    // Credentials Provider for Quick Role Switcher & Demo Access
    CredentialsProvider({
      id: 'demo-login',
      name: 'Demo Login',
      credentials: {
        role: { label: 'Role', type: 'text' },
        name: { label: 'Name', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials) return null;
        const isAdmin = credentials.role === 'admin';
        return {
          id: isAdmin ? 'admin-001' : 'member-101',
          name: credentials.name || (isAdmin ? '최고 관리자 (대표님)' : '김메나 파트너'),
          email: isAdmin ? 'admin@mannatech.ai' : 'partner@mannatech.ai',
          role: credentials.role || 'member',
          rank: isAdmin ? 'Presidential Director (PD)' : 'Executive Director (ED)',
          image: isAdmin ? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100' : 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
        } as any;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }: any) {
      if (user) {
        token.role = user.role || (user.email === process.env.ADMIN_EMAIL ? 'admin' : 'admin'); // Default to admin for primary user
        token.rank = user.rank || 'Presidential Director (PD)';
      }
      return token;
    },
    async session({ session, token }: any) {
      if (session.user) {
        session.user.role = token.role || 'admin';
        session.user.rank = token.rank || 'Presidential Director (PD)';
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || 'mannatech-secret-key-2026',
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
