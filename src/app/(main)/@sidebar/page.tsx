"use client";

import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { navigationItems } from "@/components/types";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RxAvatar } from "react-icons/rx";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { SignInDialog } from "@/components/Authentication/Signin";
import { useSession } from "next-auth/react";
import UserPopover from "../(Components)/UserPopover";
import Logo from "../Logo";

export default function Sidebar() {
  const pathname = usePathname();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const { data: session } = useSession();

  const UserAvatar = () => (
    <div className="flex items-center justify-start gap-2 hover:text-primary">
      <Avatar className="cursor-pointer">
        <AvatarImage src={session?.user?.image} />
        <AvatarFallback>
          <RxAvatar className="h-9 w-9" />
        </AvatarFallback>
      </Avatar>
    </div>
  );

  return (
    <>
      <aside className="w-56 border-r z-20 hidden md:flex md:flex-col fixed items-center justify-between h-full">
       <div >
        <Logo />
       </div>
        <div className="flex flex-col w-full">
          {navigationItems.map((item) => {
            const isSelected = pathname === item.href;
            return (
              <div key={item.href}>
                <Separator className=" w-full" />
                <Button
                  asChild
                  variant="ghost"
                  size="long"
                  className="justify-start"
                >
                  <Link
                    href={item.href}
                    className={`${
                      isSelected
                        ? "text-primary border-primary border-r-2 rounded-r-none"
                        : ""
                    }`}
                  >
                    <item.Icon className="ml-8" />
                    <span>{item.label}</span>
                  </Link>
                </Button>
                <Separator className=" w-full" />
              </div>
            );
          })}
        </div>
        <div className="flex items-center mb-4">
          {session ? (
            <UserPopover
              session={session}
             
            />
          ) : (
            <div
              className="cursor-pointer"
              onClick={() => setIsSignInOpen(true)}
            >
              <UserAvatar />
            </div>
          )}
        </div>
      </aside>

      <SignInDialog isOpen={isSignInOpen} onOpenChange={setIsSignInOpen} />
    </>
  );
}
