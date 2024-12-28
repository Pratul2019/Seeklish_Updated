"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { RxAvatar } from "react-icons/rx";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignInDialog } from "../Authentication/Signin";

interface ConditionalProfilePictureProps {
  username: string;
  image: string;
  index: number; // Restored index prop
}

const ConditionalProfilePicture: React.FC<ConditionalProfilePictureProps> = ({
  username,
  image,
  index, // Added index to destructuring
}) => {
  const { data: session } = useSession();
  const [isOpenProfile, setIsOpenProfile] = React.useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const handleProfileClick = () => {
    if (!session) {
      setIsOpenProfile(true);
    }
  };

  // Create a unique key for each profile picture using index
  const profileKey = `profile-${index}`;

  // If logged in, wrap with Link to user profile
  const ProfileAvatar = (
    <div
      key={profileKey}
      className="relative p-[2px] rounded-full bg-gradient-to-tr from-teal-500 to-black cursor-pointer"
      onClick={handleProfileClick}
    >
      
      <Avatar className="cursor-pointer">
        <AvatarImage src={image} />
        <AvatarFallback>
          <RxAvatar />
        </AvatarFallback>
      </Avatar>
    </div>
  );

  return (
    <>
      <Dialog open={isOpenProfile} onOpenChange={setIsOpenProfile}>
        {session ? (
          <Link href={`/${username}`} key={profileKey}>
            {ProfileAvatar}
          </Link>
        ) : (
          <>
            {ProfileAvatar}
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Not Logged in</DialogTitle>
                <DialogDescription>
                  You can&apos;t view profile without signing in!
                </DialogDescription>
              </DialogHeader>

              <DialogFooter>
                <Button variant="default" onClick={() => setIsSignInOpen(true)}>
                  Sign In
                </Button>
              </DialogFooter>
            </DialogContent>
          </>
        )}
        <SignInDialog isOpen={isSignInOpen} onOpenChange={setIsSignInOpen} />
      </Dialog>
    </>
  );
};

export default ConditionalProfilePicture;
