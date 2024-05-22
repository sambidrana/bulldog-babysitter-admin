import clientPromise from "@/lib/mongodb";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { signIn } from "next-auth/react";

export default NextAuth({
  providers: [
    // OAuth authentication providers...

    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  adapter: MongoDBAdapter(clientPromise),
  callbacks: {
    async signIn({ user }) {
      const allowedUsers = [process.env.ADMIN_EMAIL, process.env.ALLOWED_EMAIL];
      if (allowedUsers.includes(user.email)) {
        return true;
      }
      return false;
    },
    
  },
  session: {
    jwt: true,
    maxAge: 129600, // 1 1/2 day
  },
});
