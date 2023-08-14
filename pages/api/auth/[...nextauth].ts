import NextAuth, { NextAuthOptions } from "next-auth";

// Providers
import Credentials from "next-auth/providers/credentials";

// Services
import { authService, refreshAccessToken } from "../../../services";

export const authOptions: NextAuthOptions = {
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "C.C.",
          autoComplete: true,
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Type your password...",
          autoComplete: true,
        },
      },
      async authorize(credentials) {
        return await authService({
          username: credentials!.username,
          password: credentials!.password,
        });
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 7, // 7 hours
    updateAge: 60 * 60 * 2,
  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.refreshToken = user.refreshToken;

        if (account) {
          switch (account.type) {
            case "credentials":
              token.user = user.user;
              token.accessTokenExpires = user.accessTokenExpires;
              break;
          }
        }
      }

      if (Date.now() / 1000 < (token.accessTokenExpires as number)) {
        return token;
      }

      return await refreshAccessToken(token);
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;

      return session;
    },
  },
  // secret: process.env.NEXT_PUBLIC_SECRET!,
  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
