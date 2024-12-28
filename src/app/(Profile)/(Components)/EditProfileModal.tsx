import { User } from "@/components/types";
import ImageUpload from "@/components/UIComp/ImageUpload";
import axios from "axios";
import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast";

interface EditProfileModalProps {
  user: User;
}

const EditProfileModal: React.FC<EditProfileModalProps> = ({ user }) => {
  const [name, setName] = useState("");
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast()

  if (!session?.user.username) {
    return null;
  }

  const handleSave = async () => {
  setIsLoading(true);
  try {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/Profile/Updateprofile`,
      {
        name,
        image: selectedFile,
        username: user.username,
      }
    );
    if (response.status === 200) {
      const { name, image } = response.data.data;
      await update({
        ...session,
        user: {
          ...session?.user,
          name,
          image,
        },
      });

      // Create a custom promise to handle the toast
      const toastPromise = new Promise<void>((resolve) => {
        toast({
          title: "Updated Successfully",
          description: "Updated Profile Successfully",
          action: (
            <ToastAction
              altText="Goto schedule to undo"
              onClick={() => resolve()} // Resolve the promise when the toast action is clicked
            >
              Close
            </ToastAction>
          ),
        });
      });

      // Await the toast promise before reloading the window
      await toastPromise;
      window.location.reload();
    } else {
      console.error("Error updating profile:", response.statusText);
    }
  } catch (error) {
    console.error("Error updating profile:", error);
  } finally {
    setIsLoading(false);
  }
};

  return (
    <div className=" flex flex-col">
      
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSave();
        }}
      >
        <div className="my-6">
          
            <ImageUpload
              selectedFile={selectedFile}
              setSelectedFile={setSelectedFile}
            />
        
        </div>
        <div className="mb-6">
          <Input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Update Name"
          />
        </div>
        <div className="flex justify-end gap-4">
          <Button type="submit" variant="secondary" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              "Save Changes"
            )}
          </Button>
          
        </div>
      </form>

      
    </div>
  );
};

export default EditProfileModal;
