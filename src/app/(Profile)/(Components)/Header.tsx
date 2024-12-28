"use client";

import React, { useState, useEffect } from "react";
import { FaUserEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import Image from "next/image";

import Link from "next/link";
import EditProfileModal from "./EditProfileModal";

import ConnectionsModal from "./Connection";
import { TiThMenu } from "react-icons/ti";
import { MdOutlineAddPhotoAlternate } from "react-icons/md";
import { User } from "@/components/types";
import DeleteModal from "@/components/UIComp/Deletemodal";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import Logo from "@/app/(main)/Logo";

interface ProfileHeaderProps {
  user: User;
  currentUser: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ user, currentUser }) => {
  const [isExplorer, setIsExplorer] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [audienceCount, setAudienceCount] = useState(0);
  const [connectionCount, setConnectionCount] = useState(0);

  useEffect(() => {
    setIsExplorer(!!user?.audience?.[currentUser]);
    setAudienceCount(user?.audience ? Object.keys(user.audience).length : 0);
    setConnectionCount(
      user?.connections ? Object.keys(user.connections).length : 0
    );
  }, [user, currentUser]);

  const handleDelete = async () => {
    if (isDeleting) return; // Prevent multiple delete requests

    setIsDeleting(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Delete/accountdelete`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: user.username }),
        }
      );

      if (res.ok) {
        setShowDeleteModal(false);
        window.location.href = "/";
      } else {
        console.error("Error deleting account");
      }
    } catch (error) {
      console.error("Error deleting account:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleExplorer = async () => {
    const action = isExplorer ? "Unsync" : "Sync";
    try {
      const response = await fetch(`/api/Sync`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUser,
          profileUser: user.username,
          action,
          profileUsername: user.name,
          profileUserimage: user.image,
        }),
      });

      if (response.ok) {
        setIsExplorer(!isExplorer);
        setAudienceCount((prev) => (isExplorer ? prev - 1 : prev + 1));
      } else {
        console.error(
          `Error performing ${action} action:`,
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error updating explorer status:", error);
    }
  };

  return (
    <div className=" p-4 border-b-2 ">
      <div className="flex justify-center">
        <Logo /> 
      </div>
      
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8 ">
        <div className="flex items-center gap-4">
          {currentUser === user.username && (
            <Dialog>
              <DialogTrigger asChild>
                <TiThMenu size={25} className="cursor-pointer"/>
              </DialogTrigger>

              <DialogContent className="max-w-72 flex flex-col">
                <DialogHeader>
                  <DialogTitle className="border-b">    </DialogTitle>
                </DialogHeader>
                <div className="p-2 text-sm grid space-y-6">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="lg">
                        <FaUserEdit size={26} />
                        Edit Profile
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Edit Profile</DialogTitle>
                      </DialogHeader>
                      <EditProfileModal
                        user={user}
                      />
                    </DialogContent>
                  </Dialog>

                  <Button variant="ghost" size="lg">
                    <Link href="/up" className="flex gap-2 items-center">
                      <MdOutlineAddPhotoAlternate size={26} />
                      Upload
                    </Link>
                  </Button>

                  <Button
                    onClick={() => {
                      setShowDeleteModal(true);
                    }}
                    variant="ghost"
                    size="lg"
                  >
                    <RiDeleteBinLine size={25} />
                    Delete Account
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
          <Image
            src={user.image}
            className="w-16 h-16 md:w-24 md:h-24 rounded-full shadow-lg"
            alt={user.name}
            width={96}
            height={96}
            priority
          />
          <div className="flex flex-col items-center">
            <h1 className="text-xl">{user.name}</h1>
            {currentUser === user.username && (
              <div className="text-sm">@{user.username}</div>
            )}
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 mt-4 sm:mt-0">
          {currentUser !== user.username && (
            <button
              onClick={handleExplorer}
              className={`px-6 py-2 rounded-full transition-all duration-300 ${
                isExplorer
                  ? "border-teal-900 border hover:bg-teal-600"
                  : "border-current border hover:bg-teal-900"
              }`}
            >
              {isExplorer ? "Unsync" : "Sync"}
            </button>
          )}
          <div className="flex space-x-6 text-sm">
            <Dialog>
              <DialogTrigger asChild>
                <div
                  className={`cursor-pointer ${
                    audienceCount > 0 ? "hover:underline" : ""
                  }`}
                >
                  Audience&nbsp;&nbsp;{audienceCount > 0 && audienceCount}
                </div>
              </DialogTrigger>
              {audienceCount > 0 && (
                <DialogContent className="max-w-80">
                  <DialogHeader>
                    <DialogTitle>Audience</DialogTitle>
                  </DialogHeader>
                  <ul>
                    {Object.entries(user?.audience || {}).map(
                      ([username, data], index) => (
                        <li key={index} className="p-2">
                          <div className="flex items-center">
                            <Link href={username}>
                              <Image
                                src={data.image}
                                alt={data.name}
                                className="w-10 h-10 rounded-full mr-2"
                                width={40}
                                height={40}
                                priority
                              />
                            </Link>
                            <span>{data.name}</span>
                          </div>
                        </li>
                      )
                    )}
                  </ul>
                </DialogContent>
              )}
            </Dialog>

            {audienceCount > 0 && connectionCount > 0 && <span>•</span>}

            <Dialog>
              {connectionCount > 0 && (
                <DialogTrigger asChild>
                  <span className="cursor-pointer hover:underline">
                    Connections&nbsp;&nbsp;{connectionCount}
                  </span>
                </DialogTrigger>
              )}
              {connectionCount > 0 && (
                <DialogContent className="max-w-96">
                  <DialogHeader>
                    <DialogTitle>Connections</DialogTitle>
                  </DialogHeader>
                  <ConnectionsModal
                    connections={Object.entries(user?.connections || {}).map(
                      ([username, data]) => ({
                        username,
                        ...data,
                      })
                    )}
                    // onClose={() => setShowConnectionsModal(false)}
                    currentuser={currentUser}
                    profileUser={user.username}
                  />
                </DialogContent>
              )}
              {!(connectionCount > 0) && <span>Connections</span>}
            </Dialog>
          </div>
        </div>
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

export default ProfileHeader;
