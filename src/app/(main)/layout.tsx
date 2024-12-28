// app/layout.tsx
import type { Metadata } from "next";
import { SessionProvider } from "next-auth/react";
import { auth } from "@/auth";

export const metadata: Metadata = {
  title: "Seeklish | Main",
  description: "Discover | Rental | Discover",
};

export default async function MainLayout({
  children,
  sidebar,
  mobilefooter,
  header,
}: {
  children: React.ReactNode;
  sidebar: React.ReactNode;
  mobilefooter: React.ReactNode;
  header: React.ReactNode;
}) {
  const session = await auth();

  return (
    
        <SessionProvider session={session}>
          <div className="min-h-screen flex">
            {sidebar}

            <div className="flex-1 flex flex-col md:ml-40 min-h-screen">
              <header className="fixed top-0 right-0 left-0 bg-background border-b z-10 ">
                {header}
              </header>

              <main className="flex-1 md:my-20 mt-4 mb-16 md:mb-0 md:ml-12">
                {children}
              </main>
              <footer className="fixed bottom-0 left-0 right-0 md:hidden bg-background border-t">
                {mobilefooter}
              </footer>
            </div>
          </div>
        </SessionProvider>
    
  );
}
