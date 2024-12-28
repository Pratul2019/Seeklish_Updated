"use client";


import Discoverprofilemodal from "@/app/(Profile)/(ProfileUpload)/Discoverprofilemodal";
import DiscoverModal from "@/components/Share_Models/DiscoverModal";
import { Discover } from "@/components/types";
import Image from "next/image";
import React, { useState } from "react";
import { CiSquarePlus } from "react-icons/ci";
import { IoIosArrowDropleft, IoIosArrowDropright } from "react-icons/io";

interface ProfileDiscoverProps {
  discoverpro: Discover[];
  isAllowed: boolean;
}

const ProfileDiscover: React.FC<ProfileDiscoverProps> = ({
  discoverpro,
  isAllowed,
}) => {
  const [selectedDiscover, setSelectedDiscover] = useState<Discover | null>(
    null
  );
  const [modalType, setModalType] = useState<"upload" | "view" | null>(null);
  const [currentIndices, setCurrentIndices] = useState<{
    [key: string]: number;
  }>({});

  const handleNext = (discoverproId: string) => {
    setCurrentIndices((prevIndices) => {
      const discover = discoverpro.find((d) => d._id === discoverproId);
      const maxIndex = (discover?.connectionpost?.length || 0) + 1;
      const currentIndex = prevIndices[discoverproId] || 0;
      return {
        ...prevIndices,
        [discoverproId]: (currentIndex + 1) % maxIndex,
      };
    });
  };

  const handlePrev = (discoverproId: string) => {
    setCurrentIndices((prevIndices) => {
      const discover = discoverpro.find((d) => d._id === discoverproId);
      const maxIndex = (discover?.connectionpost?.length || 0) + 1;
      const currentIndex = prevIndices[discoverproId] || 0;
      return {
        ...prevIndices,
        [discoverproId]: (currentIndex - 1 + maxIndex) % maxIndex,
      };
    });
  };

  const handleDiscoverClick = (discover: Discover) => {
    setSelectedDiscover(discover);
    setModalType("view");
  };

  const handleUploadModalOpen = (discover: Discover) => {
    setSelectedDiscover(discover);
    setModalType("upload");
  };

  const handleCloseModal = () => {
    setSelectedDiscover(null);
    setModalType(null);
  };

  return (
    <div className="container mt-10">
      {discoverpro.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No posts found</p>
        </div>
      ) : (
        <div className="flex flex-wrap justify-center">
          {discoverpro.map((discover) => {
            const carouselItems = [
              discover,
              ...(discover.connectionpost || []),
            ];
            const currentIndex = currentIndices[discover._id] || 0;
            const currentItem = carouselItems[currentIndex];

            return (
              <div
                key={discover._id}
                className="flex flex-col gap-2 items-center m-2"
              >
                <div className="w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-end">
                      {currentIndex > 0 && (
                        <button
                          onClick={() => handlePrev(discover._id)}
                          className="hover:text-teal-500"
                        >
                          <IoIosArrowDropleft size={20} />
                        </button>
                      )}
                      {carouselItems.length > 1 && (
                        <button
                          onClick={() => handleNext(discover._id)}
                          className="hover:text-teal-500"
                        >
                          <IoIosArrowDropright size={20} />
                        </button>
                      )}
                    </div>
                    <div className="h-5"></div>
                    {isAllowed &&
                      (discover.connectionpost?.length || 0) < 5 && (
                        <div className="cursor-pointer z-10">
                          <CiSquarePlus
                            size={25}
                            onClick={() => handleUploadModalOpen(discover)}
                            className="hover:text-teal-500 "
                          />
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col gap-2 items-center ">
                    <div
                      onClick={() => handleDiscoverClick(discover)}
                      className="cursor-pointer"
                    >
                      <Image
                        src={currentItem.discoverImage}
                        alt=""
                        width={1000}
                        height={1000}
                        className="object-cover rounded-3xl w-96 h-80"
                        priority={true}
                      />
                    </div>
                    <div className="text-sm text-center w-full break-words">
                      {currentItem.discoverName}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {modalType === "upload" && selectedDiscover && (
        <Discoverprofilemodal
          discover={selectedDiscover}
          onClose={handleCloseModal}
        />
      )}
      {modalType === "view" && selectedDiscover && (
        <DiscoverModal discover={selectedDiscover} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default ProfileDiscover;
