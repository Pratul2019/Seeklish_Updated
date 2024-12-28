"use client";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";

interface DeleteModalProps {
  showDeleteModal: boolean;
  setShowDeleteModal: (show: boolean) => void;
  handleDelete: () => void;
  isDeleting: boolean;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  showDeleteModal,
  setShowDeleteModal,
  handleDelete,
  isDeleting,
}) => {
  return (
    
    <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
      <DialogContent className="max-w-96">
        <DialogHeader className="mb-2">
          <DialogTitle>Confirm Delete</DialogTitle>
        </DialogHeader>

        <DialogDescription className="flex justify-center">
          Are you sure you want to delete?
        </DialogDescription>
        <DialogFooter className="mt-2">
          <Button
            type="submit"
            variant="destructive"
            onClick={handleDelete}
            disabled={isDeleting}
          >
            {isDeleting ? "Deleting..." : "Delete"}
          </Button>
          <DialogClose asChild >
            <Button type="button" variant="secondary" disabled={isDeleting}>
              Cancel
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
