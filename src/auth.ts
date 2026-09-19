import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { NextResponse } from "next/server";
import type { NextAuthConfig } from "next-auth";

import { prisma } from "@/lib/prisma";
import {
  ADMIN_LOGIN_PATH,
  ADMIN_FORGOT_PASSWORD_PATH,
  ADMIN_RESET_PASSWORD_PATH,
} from "@/lib/admin-routes";

export { ADMIN_LOGIN_PATH };

const PUBLIC_ADMIN_ROUTES = [
  ADMIN_LOGIN_PATH,
  ADMIN_FORGOT_PASSWORD_PATH,
  ADMIN_RESET_PASSWORD_PATH,
];

export const authConfig = {
  trustHost: true,

  session: {
    strategy: "jwt" as const,
  },

  pages: {
    signIn: ADMIN_LOGIN_PATH,
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
      const { pathname } = request.nextUrl;




      const isAdminRoute = pathname.startsWith("/admin");
      const isLoginRoute = pathname === "/admin/login";

      if (!isAdminRoute || isLoginRoute) {
        return true;
      }

      const isPublicAdminRoute = PUBLIC_ADMIN_ROUTES.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
      );

      if (isPublicAdminRoute) {
        return true;
      }

      if (auth?.user?.role === "ADMIN") {
        return true;
      }

      // Unauthenticated visitors hitting a protected /admin route (e.g. bare
      // /admin) are bounced to the public homepage rather than the login
      // page, so the admin panel isn't discoverable by random visitors.
      // The real login path itself stays reachable directly (see
      // PUBLIC_ADMIN_ROUTES above) for the actual admin to sign in.
      return NextResponse.redirect(new URL("/", request.url));
    },
  },
} satisfies NextAuthConfig;

export const {
  handlers,
  auth,
  signIn,
  signOut,
} = NextAuth(authConfig);
