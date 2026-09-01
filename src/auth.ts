import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";

import { prisma } from "@/lib/prisma";

export const authConfig = {
  trustHost: true,

  session: {
    strategy: "jwt" as const,
  },

  pages: {
    signIn: "/admin/login",
  },

  providers: [
    Credentials({
      name: "Credentials",

      credentials: {
        phone: {
          label: "Phone",
          type: "text",
        },

        password: {
          label: "Password",
          type: "password",
        },
      },

      async authorize(credentials) {
        const phone = credentials?.phone;
        const password = credentials?.password;

        if (!phone || !password) {
          return null;
        }

        const user = await prisma.user.findUnique({
          where: {
            phone: String(phone),
          },
        });

        if (!user || !user.isActive) {
          return null;
        }

        if (user.role !== "ADMIN") {
          return null;
        }

        const isValidPassword = await compare(
          String(password),
          user.password
        );

        if (!isValidPassword) {
          return null;
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email ?? undefined,
          phone: user.phone,
          role: user.role,
        };
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.phone = user.phone as string;
        token.role = user.role as "ADMIN";
        token.name = user.name as string;
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.phone = token.phone as string;
        session.user.role = token.role as "ADMIN";
        session.user.name = token.name as string;
      }

      return session;
    },

    authorized({ auth, request }) {
      const isAdminRoute =
        request.nextUrl.pathname.startsWith("/admin");

      if (!isAdminRoute) {
        return true;
      }

      return auth?.user?.role === "ADMIN";
    },
  },
} satisfies NextAuthConfig;

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);