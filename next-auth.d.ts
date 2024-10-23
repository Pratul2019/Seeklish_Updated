// next-auth.d.ts
import { User as NextAuthUser, Session as NextAuthSession } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      username: string;
     
    } & NextAuthSession["user"];
    sessionToken: string | JWT;
  }

  interface User extends NextAuthUser {
    username: string;

  }

  interface JWT {
    username: string;
  }
}
