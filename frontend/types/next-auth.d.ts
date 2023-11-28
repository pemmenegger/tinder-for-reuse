import NextAuth from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: number;
      isEmailVerified: boolean;
      email: string;
      displayName: string;
      phone?: string;
    };
    accessToken: string;
    refreshToken: string;
    expiresAt: number;
  }
}

import { JWT } from "next-auth/jwt";

declare module "next-auth/jwt" {
  interface JWT {
    user: {
      id: number;
      is_email_verified: boolean;
      email: string;
      display_name: string;
      phone?: string;
    };
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }
}
