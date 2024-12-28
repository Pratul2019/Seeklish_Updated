import { auth } from "@/auth";
import "./globals.css";
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";

export const metadata: Metadata = {
  title: "Seeklish",
  description: "Seeklish",
};


export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await auth();
  return (
    <SessionProvider session={session}>
    <html lang="en">
      <body>
        {/* Layout UI */}
        <main>{children}</main>
      </body>
    </html>
    </SessionProvider>
  )
}