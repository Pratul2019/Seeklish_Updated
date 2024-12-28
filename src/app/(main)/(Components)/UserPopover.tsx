import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CgProfile } from "react-icons/cg";
import { FiUploadCloud } from "react-icons/fi";
import Link from "next/link";
import Logout from "@/components/Authentication/Logout";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { RxAvatar } from "react-icons/rx";
import { Session } from "next-auth";

interface UserPopoverProps {
  session: Session | null;
}

const UserPopover = ({ session }: UserPopoverProps) => {
  const UserAvatar = () => (
    <div className="flex items-center justify-start gap-2 hover:text-primary">
      <Avatar className="cursor-pointer">
        <AvatarImage src={session?.user?.image ?? undefined} />
        <AvatarFallback>
          <RxAvatar className="h-9 w-9" />
        </AvatarFallback>
      </Avatar>
      <div className="hidden md:block">{session?.user?.name}</div>
    </div>
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="cursor-pointer">
          <UserAvatar />
        </div>
      </PopoverTrigger>
      <PopoverContent
        align="center"
        sideOffset={4}
        className="flex flex-col items-start gap-2"
      >
        <Link className='w-full' href="/up">
          <Button variant="ghost" className="justify-start" size="full">
            <FiUploadCloud size={25} className="ml-10"/>
            Upload
          </Button>
        </Link>
        <Separator className="w-full" />
        <Button
          asChild
          variant="ghost"
          className="w-full justify-start"
          size="full"
        >
          <Link href={`/${session?.user.username}`}>
            <CgProfile size={25} className="ml-10"/>
            Profile
          </Link>
        </Button>
        <Separator className="w-full" />
        <Logout />
      </PopoverContent>
    </Popover>
  );
};

export default UserPopover;