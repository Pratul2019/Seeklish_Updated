"use client";

import { navigationItems } from "@/components/types";
import Link from "next/link";
import { RxAvatar } from "react-icons/rx";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useState } from "react";

import { SignInDialog } from "@/components/Authentication/Signin";
import { useSession } from "next-auth/react";
import UserPopover from "../(Components)/UserPopover";


export default function MobileFooter() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  return (
    <>
      <nav className="grid grid-cols-4 h-14">
        {navigationItems.map((item) => {
          const isSelected = pathname === item.href;
          return (
            <Button
              key={item.href}
              asChild
              variant="ghost"
              className="h-full rounded-3xl"
            >
              <Link
                href={item.href}
                className={`flex items-center justify-center ${
                  isSelected ? "text-primary" : ""
                }`}
              >
                <item.Icon className="size-6" />
              </Link>
            </Button>
          );
        })}

        {session ? (
          <div className="items-center flex justify-center">
            <UserPopover
              session={session}
              
            />
          </div>
        ) : (
          <Button
            asChild
            variant="ghost"
            className="h-full rounded-3xl"
            onClick={() => setIsSignInOpen(true)}
          >
            <div>
              <Avatar className="size-8">
                <AvatarFallback>
                  <RxAvatar className="size-6" />
                </AvatarFallback>
              </Avatar>
            </div>
          </Button>
        )}
      </nav>

      <SignInDialog isOpen={isSignInOpen} onOpenChange={setIsSignInOpen} />
    </>
  );
}
