import React, { useState, useCallback } from "react";
import { CiMenuKebab } from "react-icons/ci";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import Share from "@/components/UIComp/Share";
import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import DeleteModal from "@/components/UIComp/Deletemodal";

interface DropdownProps {
  postUrl: string;
  isCurrentUser: boolean;
  postid: string;
  model: string;
}

const Dropdown: React.FC<DropdownProps> = ({
  postid,
  postUrl,
  isCurrentUser,
  model,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const { toast } = useToast();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = useCallback(async () => {
    if (isDeleting) return;

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Delete/postdelete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ postid, model }),
        }
      );

      if (res.ok) {
        // Show success toast before redirecting
        toast({
          title: "Post Deleted",
          description: "Your post has been deleted successfully.",
          variant: "default",
        });

        // Slight delay to ensure toast is visible
        setTimeout(() => {
          window.location.href = window.location.pathname;
        }, 1000);
      } else {
        const errorData = await res.text(); // Use text() instead of json() to handle potential non-JSON responses
        console.error("Error deleting post:", errorData);

        // Show error toast immediately
        toast({
          title: "Delete Failed",
          description:
            errorData || "Unable to delete the post. Please try again.",
          variant: "destructive",
        });

        setIsDeleting(false);
      }
    } catch (error) {
      console.error("Error deleting post:", error);

      // Show error toast for network or other errors
      toast({
        title: "Delete Error",
        description:
          error instanceof Error
            ? error.message
            : "An error occurred while deleting the post.",
        variant: "destructive",
      });

      setIsDeleting(false);
    }
  }, [isDeleting, postid, model, toast]);

  return (
    <div>
      <Popover>
        <PopoverTrigger asChild>
          <CiMenuKebab
            size={20}
            className="hover:text-primary cursor-pointer"
          />
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col p-2 gap-2">
            <Button variant="secondary">
              <Share postUrl={postUrl} />
            </Button>
            {/* <Button variant="secondary">Edit</Button> */}
            {isCurrentUser && (
              <Button
                variant="destructive"
                onClick={() => {
                  setShowDeleteModal(true);
                }}
              >
                Delete
              </Button>
            )}
          </div>
        </PopoverContent>
      </Popover>
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

export default React.memo(Dropdown);
