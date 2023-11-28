import { loginUser, refreshToken } from "@/lib/api/accounts";
import NextAuth from "next-auth/next";
import CredentialsProvider from "next-auth/providers/credentials";

export default NextAuth({
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      name: "Sign in",
      credentials: {
        email: {
          label: "Email",
          type: "email",
          placeholder: "example@example.com",
        },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // console.log("credentials", credentials);
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const user = await loginUser(credentials.email, credentials.password);
          console.log("user", user);
          return user;
        } catch (e) {
          // console.log("login failed");
          console.error(e);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) return { ...token, ...user };

      return token;

      // if (new Date().getTime() < token.expires_at) return token;

      // return await refreshToken(token);
    },

    async session({ token, session }) {
      session.user = {
        id: token.user.id,
        isEmailVerified: token.user.is_email_verified,
        email: token.user.email,
        displayName: token.user.display_name,
        phone: token.user.phone,
      };
      session.accessToken = token.access_token;
      session.refreshToken = token.refresh_token;
      session.expiresAt = token.expires_at;
      return session;
    },
  },
});
