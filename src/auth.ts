import NextAuth from "next-auth";
import Facebook from "next-auth/providers/facebook";
import GitHub from "next-auth/providers/github";
import Google from "next-auth/providers/google";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
    Facebook({
      clientId: process.env.AUTH_FACEBOOK_ID,
      clientSecret: process.env.AUTH_FACEBOOK_SECRET,
    }),
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID,
      clientSecret: process.env.AUTH_GITHUB_SECRET,
    }),
  ],
  callbacks: {
    async signIn({ profile, user, account }) {
      if (user && profile && account && ["google", "facebook", "github"].includes(account.provider)) {
        const { name, email, image } = user;
        const uid = profile.id || profile.sub;
    
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/Login/User`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name, email, uid, image }),
          });
    
          if (!res.ok) {
            console.error(`API error: ${res.status} ${res.statusText}`);
            return false; // Deny sign-in on API error
          }
    
          const data = await res.json();
          
          if (data.isdeleteuserrequest) {
            return `/RestoreUser/${encodeURIComponent(data.username)}`;
          }
    
          user.username = data.username;
          user.name = data.name;
          user.image = data.image;
    
          return true;
        } catch (error) {
          console.error("Error in signIn callback:", error);
          return false; // Deny sign-in on error
        }
      }
      return false; // Deny sign-in for unsupported providers
    },

    async jwt({ token, user, trigger, session }) {
      if (trigger === "update") {
        return { ...token, ...session.user };
      }

      if (user) {
        token.username = user.username;
        token.name = user.name;
        token.image = user.image;
      }
      return token;
    },

    async session({ session, token }) {
      // Add additional user information to the session object
      session.sessionToken = token.toString();
      session.user.username = token.username;
      session.user.name = token.name;
      session.user.image = token.image;

      return session;
    },
  },
});
