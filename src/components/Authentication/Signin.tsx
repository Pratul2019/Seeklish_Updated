"use client";
import Loginfacebook from "@/components/Authentication/Loginfacebook";
import LoginGithub from "@/components/Authentication/Logingithub";
import LoginGoogle from "@/components/Authentication/Logingoogle";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import Link from "next/link";

interface SignInDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function SignInDialog({ isOpen, onOpenChange }: SignInDialogProps) {
  

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        

        <DialogHeader className="space-y-2">
          <DialogTitle className="text-2xl font-semibold">
            Welcome 
          </DialogTitle>
          <DialogDescription>
            Sign in to your account
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-4">
          <LoginGoogle />
          <LoginGithub />
          <Loginfacebook />
        </div>

        <div className="text-xs text-center text-muted-foreground">
          <p>By continuing, you agree to</p>
          <Button asChild variant="link" size="sm" className="h-auto p-0">
            <Link href="/Terms&Conditions">
              Terms and Conditions
            </Link>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}