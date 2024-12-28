"use client";
import React, { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { LiaComments } from "react-icons/lia";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { BsSendArrowUp } from "react-icons/bs";
import { Button } from "@/components/ui/button";
import { SignInDialog } from "@/components/Authentication/Signin";
import Link from "next/link";
import Image from "next/image";
import Moment from "react-moment";
import DeleteModal from "@/components/UIComp/Deletemodal";
import { IoTrashBinSharp } from "react-icons/io5";

interface CommentsProps {
  id: string;
  model: string;
  comments: Comment[];
  user: string;
}

interface Comment {
  username: string;
  name: string;
  image: string;
  description: string;
  _id: string;
  createdAt: string;
}

const Comments: React.FC<CommentsProps> = ({ id, model, user }) => {
  const [commentData, setCommentData] = useState<Comment[]>([]);
  const [comment, setComment] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { data: session } = useSession();
  const [commentCount, setCommentCount] = useState(0);
  const [isPosting, setIsPosting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState<string | null>(null);

  const sortedComments = [...commentData].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const fetchCommentData = useCallback(async () => {
    if (!session?.user?.username) return;

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Fetch/getComment`,
        {
          postid: id,
          model,
        }
      );
      setCommentData(response.data.data?.[0]?.comment || []);
      setCommentCount(response.data.data?.[0]?.comment?.length || 0);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    }
  }, [id, model, session?.user?.username]);

  const handleCommentPost = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!comment.trim() || !session?.user?.username) return;
    setIsPosting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Fetch/Comment`,
        {
          postid: id,
          description: comment,
          model,
          username: session.user.username,
        }
      );
      if (response.status === 200) {
        setComment("");
        fetchCommentData();
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to post comment:", error);
    } finally {
      setIsPosting(false);
    }
  };

  const handleDelete = async () => {
    if (!commentToDelete) return;

    setIsDeleting(true);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Delete/commentdelete`,
        {
          postid: id,
          commentid: commentToDelete,
          model,
        }
      );

      if (response.status === 200) {
        refreshComments();
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error("Error deleting comment:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  useEffect(() => {
    if (session?.user?.username) {
      fetchCommentData();
    }
  }, [fetchCommentData, session?.user?.username]);

  const refreshComments = () => {
    fetchCommentData();
  };

  const CommentAction = (
    <div className="flex gap-2 items-center text-sm">
      <Dialog>
        <DialogTrigger asChild>
          <LiaComments size={25} />
        </DialogTrigger>

        <DialogContent className="max-h-[80vh] flex flex-col">
          <DialogHeader>
            <DialogTitle></DialogTitle>
          </DialogHeader>
          <div className="flex flex-col p-2 gap-4 w-full flex-grow overflow-hidden">
            <div className="flex gap-2">
              <textarea
                className="flex border-b border-teal-700 text-center bg-transparent w-full"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share.."
                disabled={isPosting}
              />
              <Button
                variant="ghost"
                disabled={!comment.trim() || isPosting}
                onClick={handleCommentPost}
              >
                <BsSendArrowUp
                  size={18}
                  className="hover:text-teal-500 cursor-pointer"
                />
              </Button>
            </div>

            <div className="overflow-y-auto flex-grow pr-2">
              {isLoading ? (
                <div>Loading</div>
              ) : sortedComments.length > 0 ? (
                sortedComments.map((comment) => (
                  <div key={comment._id} className="flex justify-between p-2">
                    <div className="flex items-center gap-2">
                      <Link href={`/${comment.username}`}>
                        <Image
                          className="h-9 w-9 rounded-full"
                          src={comment.image}
                          alt=""
                          height={100}
                          width={100}
                          priority={true}
                        />
                      </Link>

                      <div className="flex-grow text-sm">
                        <div className="flex items-baseline gap-2">
                          <span className="font-light">{comment.name}</span>
                          <Moment
                            className="text-xs font-extralight text-gray-500"
                            fromNow
                          >
                            {new Date(comment.createdAt)}
                          </Moment>
                        </div>
                        <div className="break-words text-start max-w-60 max-h-30 ">
                          {comment.description}
                        </div>
                      </div>
                    </div>
                    {(session?.user.username === user ||
                      session?.user.username === comment.username) && (
                      <div
                        className="mr-4 cursor-pointer flex items-center"
                        onClick={() => {
                          setCommentToDelete(comment._id);
                          setShowDeleteModal(true);
                        }}
                      >
                        <IoTrashBinSharp
                          size={20}
                          className="hover:text-red-500"
                        /> 
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-center my-4 italic text-gray-500">
                  No shared experiences
                </p>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {commentCount > 0 && (
        <span className="text-xs font-thin">
          {commentCount === 1 ? "1 exp." : `${commentCount} exp's.`}
        </span>
      )}
    </div>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-1 cursor-pointer mt-1">
        {session ? (
          <>{CommentAction}</>
        ) : (
          <Dialog>
            <DialogTrigger asChild>
             <div>
              <LiaComments size={25} />
              {commentCount > 0 && (
                <span className="text-xs font-thin">
                  {commentCount === 1 ? "1 exp." : `${commentCount} exp's.`}
                </span>
              )}
              </div>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Not Logged in</DialogTitle>
                <DialogDescription>
                  You can&apos;t comment without signing in!
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
      {showDeleteModal && (
        <DeleteModal
          showDeleteModal={showDeleteModal}
          setShowDeleteModal={setShowDeleteModal}
          handleDelete={handleDelete}
          isDeleting={isDeleting}
        />
      )}
    </div>
  );
};

export default React.memo(Comments);