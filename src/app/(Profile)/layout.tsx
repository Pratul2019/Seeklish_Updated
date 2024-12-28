import type { Metadata } from "next";
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata ={
  title: {
    default: "Profile",
    template: "Seeklish | %s",
  },
  description: "Manage Your Profile",
}

export default async function ProfileLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <section>      
      <main>{children}</main>
      <Toaster />
    </section>
  );
}
