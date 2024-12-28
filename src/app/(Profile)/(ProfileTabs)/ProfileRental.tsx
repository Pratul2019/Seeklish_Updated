"use client";

import React, { useState } from "react";
import Image from "next/image";
import { CiSquarePlus } from "react-icons/ci";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Rentalprofilemodal from "@/app/(Profile)/(ProfileUpload)/Rentalprofilemodal";
import RentalModal from "@/components/Share_Models/RentalModal";
import { Rental } from "@/components/types";
import Like from "@/app/(main)/(Components)/Like";
import Comments from "@/app/(main)/(Comments)/Comments";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FaArrowAltCircleUp } from "react-icons/fa";

interface ProfileRentalProps {
  rentalpro: Rental[];
  isAllowed: boolean;
}

const ProfileRental: React.FC<ProfileRentalProps> = ({
  rentalpro,
  isAllowed,
}) => {
  const [selectedRental, setSelectedRental] = useState<Rental | null>(null);
  const [modalType, setModalType] = useState<"upload" | "view" | null>(null);

  const handleUploadModalOpen = (rental: Rental) => {
    setSelectedRental(rental);
    setModalType("upload");
  };

  const handleCloseModal = () => {
    setSelectedRental(null);
    setModalType(null);
  };

  // Prepare carousel items for each rental
  const prepareCarouselItems = (rental: Rental) => {
    return [rental, ...(rental.connectionpost || [])];
  };

  return (
    <div className="container mx-auto px-4 mt-10 flex justify-center">
      {rentalpro.length === 0 ? (
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">No posts found</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4">
          {rentalpro.map((rental) => {
            const carouselItems = prepareCarouselItems(rental);

            return (
              <div
                key={rental._id}
                className="flex flex-col items-center justify-center"
              >
                <Carousel className="w-full">
                  <div className="flex items-center justify-between mb-2">
                    {isAllowed && (rental.connectionpost?.length || 0) < 5 && (
                      <CiSquarePlus
                        size={25}
                        onClick={() => handleUploadModalOpen(rental)}
                        className="cursor-pointer hover:text-teal-500"
                      />
                    )}
                  </div>

                  <CarouselContent>
                    {carouselItems.map((item, index) => (
                      <CarouselItem key={index}>
                        <div className="relative">
                          <Image
                            src={item.rentalImage}
                            alt={item.rentalName}
                            width={1000}
                            height={1000}
                            className="object-cover rounded-sm aspect-square w-full"
                            priority={true}
                          />

                          <div className="absolute top-0 left-0 right-0 bg-background/60 flex justify-between p-2">
                            <p className="text-sm truncate">
                              {item.rentalName}
                            </p>
                            <Dialog>
                              <DialogTrigger
                                asChild
                                onClick={() => {
                                  setSelectedRental(rental); // Set the selected rental when clicking on the image
                                  setModalType("view");
                                }}
                              >
                                <FaArrowAltCircleUp
                                  size={20}
                                  className="cursor-pointer hover:text-primary"
                                />
                              </DialogTrigger>
                              {selectedRental && modalType === "view" && (
                                <DialogContent className="max-w-3xl overflow-y-auto h-3/4 md:h-fit">
                                  <DialogHeader>
                                    <DialogTitle></DialogTitle>
                                  </DialogHeader>
                                  <RentalModal
                                    rental={selectedRental}
                                  />
                                </DialogContent>
                              )}
                            </Dialog>
                          </div>

                          <div className="absolute bottom-0 left-0 right-0 bg-background/60 flex justify-around p-2">
                            <Like
                              id={rental._id}
                              model="Rental"
                              likes={rental.like}
                            />
                            <Comments
                              id={rental._id}
                              user={rental.username}
                              model="Rental"
                              comments={rental.comment}
                            />
                          </div>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                </Carousel>
              </div>
            );
          })}
        </div>
      )}

      {modalType === "upload" && selectedRental && (
        <Rentalprofilemodal
          rental={selectedRental}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default ProfileRental;
