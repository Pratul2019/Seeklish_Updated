
import React, { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { IoTrashBinSharp } from "react-icons/io5";
import axios from "axios";
import DeleteModal from "@/components/UIComp/Deletemodal";

interface ConnectiondeleteProps {
  postId: string;
  connectionpostId: string;
  iscurrentUser: boolean;
  model: string;
}

export const Connectiondelete: React.FC<ConnectiondeleteProps> = ({
  postId,
  connectionpostId,
  iscurrentUser,
  model,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const modalRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const modalElement = document.createElement("div");
    document.body.appendChild(modalElement);
    modalRef.current = modalElement;

    return () => {
      if (modalRef.current && modalRef.current.parentNode) {
        modalRef.current.parentNode.removeChild(modalRef.current);
      }
    };
  }, []);

  const handleDelete = async () => {
    setIsDeleting(true);
    
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/Delete/connectiondelete`, {
        postId,
        connectionpostId,
        model,
      });

      if (res.status === 200) {
        setShowDeleteModal(false);
        window.location.reload(); // Reload the page after successful deletion
      } else {
        console.error(res.data.message || "Error deleting connection rental");
      }
    } catch (error) {
      console.error("Error deleting connection rental:", error);
      
    } finally {
      setIsDeleting(false);
    }
  };

  const handleIconClick = () => {
    setShowDeleteModal(true);
  };

  return (
    <>
      {iscurrentUser && (
        <div className="mr-4 cursor-pointer" onClick={handleIconClick}>
          <IoTrashBinSharp size={20} className="hover:text-red-500" />
        </div>
      )}

      {showDeleteModal &&
        modalRef.current &&
        createPortal(
          <DeleteModal
            showDeleteModal={showDeleteModal}
            setShowDeleteModal={setShowDeleteModal}
            handleDelete={handleDelete}
            isDeleting={isDeleting}
            // Pass error message to the modal if needed
          />,
          modalRef.current
        )}
    </>
  );
};
