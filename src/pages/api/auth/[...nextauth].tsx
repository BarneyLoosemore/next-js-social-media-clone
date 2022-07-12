import NextAuth, { Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "db/client";
import { hashPassword, verifyPassword } from "utils/auth";
// import { profile } from "console";
// import { url } from "inspector";
// import credentials from "next-auth/providers/credentials";
// import email from "next-auth/providers/email";
// import { signIn } from "next-auth/react";
// import { redirect } from "next/dist/server/api-utils";

export default NextAuth({
  adapter: PrismaAdapter(prisma),
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    CredentialsProvider({
      id: "credentials-login",
      name: "Credentials Login",
      credentials: {
        email: {
          label: "Email Address",
          type: "email",
          placeholder: "john.doe@example.com",
        },
        password: {
          label: "Password",
          type: "password",
          placeholder: "Your super secure password",
        },
      },
      async authorize(credentials) {
        try {
          let maybeUser = await prisma.user.findFirst({
            where: {
              email: credentials?.email,
            },
            select: {
              id: true,
              email: true,
              password: true,
              name: true,
            },
          });

          if (!maybeUser) {
            throw new Error("Invalid email");
          }

          const isValidPassword = await verifyPassword(
            credentials?.password!,
            maybeUser.password!
          );

          if (!isValidPassword) {
            throw new Error("Invalid password");
          }

          return {
            id: maybeUser.id,
            email: maybeUser.email,
            name: maybeUser.name,
          };
        } catch (error) {
          console.warn(error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      return true;
    },
    async redirect({ url, baseUrl }) {
      return url.startsWith(baseUrl) ? url : baseUrl;
    },
    async jwt({ token, user, account, profile, isNewUser }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token, user }) {
      return {
        ...session,
        user: {
          ...session.user,
          id: token.id as string,
        },
      } as Session;
    },
  },
});
