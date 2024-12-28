import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { BsFire } from "react-icons/bs";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SignInDialog } from "@/components/Authentication/Signin";

interface LikeProps {
  id: string;
  likes: [];
  model: string;
  }

const Like: React.FC<LikeProps> = ({ id, likes, model }) => {
  const { data: session } = useSession();
  const [likeData, setLikeData] = useState<string[]>(likes || []);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const handleLikePost = async () => {
    try {
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Fetch/Like`,
        {
          postid: id,
          model,
        }
      );
      setLikeData(res.data.data);
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
    }
  };

  console.log(likeData)

  const LikeAction = (
    <div className="flex gap-1 items-center text-xs">
      <BsFire
        size={25}
        onClick={handleLikePost}
        className={
          likeData && likeData.includes(session?.user?.username)
            ? likeData.length > 49
              ? "text-blue-700"
              : likeData.length > 19
              ? "text-red-700"
              : likeData.length > 0
              ? "text-yellow-700"
              : "text-gray-400"
            : "text-gray-400"
        }
      />
      {likeData && likeData.length > 0 && (
        <span>{likeData.length === 1 ? "1" : likeData.length}</span>
      )}
    </div>
  );

  return (
    <div className="flex items-center gap-1 cursor-pointer mt-1">
      {session ? (
        <>{LikeAction}</>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <div className="flex gap-2 items-center text-xs">
              <BsFire size={28} />
              {likeData && likeData.length > 0 && (
                <span>{likeData.length === 1 ? "1" : likeData.length}</span>
              )}
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Not Logged in</DialogTitle>
              <DialogDescription>
                You can&apos;t react without signing in!
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button variant="default" onClick={() => setIsSignInOpen(true)}>
                Sign In
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
      <SignInDialog isOpen={isSignInOpen} onOpenChange={setIsSignInOpen} />
    </div>
  );
};

export default Like;
