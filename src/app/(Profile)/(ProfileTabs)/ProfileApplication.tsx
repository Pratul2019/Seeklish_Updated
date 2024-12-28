"use client"

import Appprofilemodal from "@/app/(Profile)/(ProfileUpload)/Appprofilemodal";
import AppModal from "@/components/Share_Models/AppModal";
import { App } from "@/components/types";
import React, { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";


interface ProfileAppProps {
  apppro: App[];
  isAllowed: boolean;
}

const ProfileApp: React.FC<ProfileAppProps> = ({ apppro, isAllowed }) => {
  const [selectedApp, setSelectedApp] = useState<App | null>(null);
  const [modalType, setModalType] = useState<"upload" | "view" | null>(null);
  const [currentIndices, setCurrentIndices] = useState<{
    [key: string]: number;
  }>({});

  const handleNext = (appproId: string) => {
    setCurrentIndices((prevIndices) => {
      const app = apppro.find((d) => d._id === appproId);
      const maxIndex = (app?.connectionpost?.length || 0) + 1;
      const currentIndex = prevIndices[appproId] || 0;
      return {
        ...prevIndices,
        [appproId]: (currentIndex + 1) % maxIndex,
      };
    });
  };

  const handlePrev = (appproId: string) => {
    setCurrentIndices((prevIndices) => {
      const app = apppro.find((d) => d._id === appproId);
      const maxIndex = (app?.connectionpost?.length || 0) + 1;
      const currentIndex = prevIndices[appproId] || 0;
      return {
        ...prevIndices,
        [appproId]: (currentIndex - 1 + maxIndex) % maxIndex,
      };
    });
  };

  const handleAppClick = (app: App) => {
    setSelectedApp(app);
    setModalType("view");
  };

  const handleUploadModalOpen = (app: App) => {
    setSelectedApp(app);
    setModalType("upload");
  };

  const handleCloseModal = () => {
    setSelectedApp(null);
    setModalType(null);
  };

  return (
    <div className="container mt-10">
      {apppro.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No posts found</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {apppro.map((app) => {
            const carouselItems = [app, ...(app.connectionpost || [])];
            const currentIndex = currentIndices[app._id] || 0;
            const currentItem = carouselItems[currentIndex];
            return (
              <div
                key={app._id}
                className="flex flex-col gap-2 items-center m-2 min-w-80"
              >
                <div className="w-full rounded-3xl shadow-md bg-header shadow-gray-500 p-2">
                  <div className="flex items-center justify-between p-2 gap-8">
                    <div className="flex items-end">
                      {currentIndex > 0 && (
                        <button
                          onClick={() => handlePrev(app._id)}
                          className="hover:text-teal-500"
                        >
                          <IoIosArrowDropleft size={20} />
                        </button>
                      )}
                      {carouselItems.length > 1 && (
                        <button
                          onClick={() => handleNext(app._id)}
                          className="hover:text-teal-500"
                        >
                          <IoIosArrowDropright size={20} />
                        </button>
                      )}
                    </div>
                    <div className="h-5"></div>
                    {isAllowed && app.connectionpost.length < 5 && (
                      <div className="cursor-pointer z-10">
                        <CiSquarePlus
                          size={25}
                          onClick={() => handleUploadModalOpen(app)}
                          className="hover:text-teal-500 "
                        />
                      </div>
                    )}
                  </div>

                  <div
                    onClick={() => handleAppClick(app)}
                    className="cursor-pointer p-2 gap-2 flex flex-col rounded-xl hover:border-current hover:border-b"
                  >
                    <div className="text-lg w-full underline underline-offset-2 break-words">
                      {currentItem.appName}
                    </div>
                    <p className="text-sm break-words flex gap-2 items-center">
                      {currentItem.caption.substring(0, 45)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {modalType === "upload" && selectedApp && (
        <Appprofilemodal app={selectedApp} onClose={handleCloseModal} />
      )}

      {modalType === "view" && selectedApp && (
        <AppModal app={selectedApp} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProfileApp;
