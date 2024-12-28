"use client"

import Image from "next/image";
import { useRef } from "react";
import { FaRegImages } from "react-icons/fa";

interface ImageUploadProps {
  selectedFile: string | null; // Allow null
  setSelectedFile: (file: string | null) => void; // Allow null
}

export default function ImageUpload({
  selectedFile,
  setSelectedFile,
}: ImageUploadProps) {
  const filePickerRef = useRef<HTMLInputElement>(null);

  const addImageToPost = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.match("image.*")) {
        alert("Please select an image file!");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert("Please select a file less than 5 MB!");
        return;
      }
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (readerEvent) => {
        const result = readerEvent?.target?.result;
        if (typeof result === "string") {
          setSelectedFile(result);
        }
      };
    }
  };

  return (
    <div className="w-full max-w-2xl my-4">
      {selectedFile ? (
        <Image
          src={selectedFile}
          className="w-full h-full cursor-pointer"
          onClick={() => setSelectedFile('')}  // Reset to empty string instead of null
          alt="Selected"
          width={1000}
          height={1000}
        />
      ) : (
        <div
          onClick={() => filePickerRef.current?.click()}
          className="cursor-pointer p-8 rounded-lg transition-colors flex justify-center items-center"
        >
          <FaRegImages
            size={30}
            className="text-gray-400 hover:text-teal-500"
          />
        </div>
      )}
      <input ref={filePickerRef} type="file" hidden onChange={addImageToPost} />
    </div>
  );
}
