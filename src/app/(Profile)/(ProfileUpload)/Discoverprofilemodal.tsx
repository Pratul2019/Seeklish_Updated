"use client";

import { useSession } from "next-auth/react";
import React, { useState } from "react";
import { IoCloseCircleOutline } from "react-icons/io5";

import axios from "axios";
import { Discover } from "@/components/types";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/UIComp/ImageUpload";

interface DiscoverModalProps {
  discover: Discover;
  onClose: () => void;
}

export default function Discoverprofilemodal({
  discover,
  onClose,
}: DiscoverModalProps) {
  const { data: session } = useSession();
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [discoverName, setDiscoverName] = useState("");
  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (loading || !session?.user) return;
    setLoading(true);
  
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Profile/connectionpost/discoverupload`,
        {
          postid: discover._id,
          profileusername: discover.username,
          currentusername: session.user.username,
          discoverName,
          caption,
          discoverImage: selectedFile,
        }
      );
  
      if (response.status === 200) {
        window.location.reload(); // Refresh the page if the response is OK
      }
      onClose();
      setLoading(false);
      setSelectedFile(null);
      return true;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-header p-6 rounded-3xl max-w-md w-full relative flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold">Add to Post</h2>
          <IoCloseCircleOutline size={30} onClick={onClose} className="hover:text-red-500 cursor-pointer" />
        </div>

        <ImageUpload
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
        <Input
          label="Rental Name *"
          placeholder=""
          value={discoverName}
          onChange={(e) => setDiscoverName(e.target.value)}
          maxLength={20}
        />
        <Input
          label="Caption *"
          placeholder=""
          value={caption}
          type="textarea"
          onChange={(e) => setCaption(e.target.value)}
        />

        <button
          className="mt-4 hover:text-teal-500 cursor-pointer p-2 rounded-3xl text-lg"
          onClick={handleUpload}
          disabled={!selectedFile || !caption || !discoverName || loading}
        >
          {loading ? "Adding..." : "Add"}
        </button>
      </div>
    </div>
  );
}
