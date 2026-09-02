import { DefaultSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      phone: string;
      role: "ADMIN";
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    phone: string;
    role: "ADMIN";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    phone: string;
    role: "ADMIN";
  }
}