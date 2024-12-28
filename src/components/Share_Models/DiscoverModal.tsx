"use client";

import React, { useCallback } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { Discover } from "@/components/types";

import Moment from "react-moment";
import { TbChartArea } from "react-icons/tb";
import Like from "@/app/(main)/(Components)/Like";
import Comments from "@/app/(main)/(Comments)/Comments";
import Dropdown from "@/app/(main)/(Components)/Dropdown";
import ConditionalProfilePicture from "../UIComp/ConditionalProfilePicture";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import { MdContacts } from "react-icons/md";
import { BsLink } from "react-icons/bs";

interface DiscoverModalProps {
  discover: Discover;
}

export default function DiscoverModal({ discover }: DiscoverModalProps) {
  const { data: session } = useSession();

  const carouselItems = Array.isArray(discover.connectionpost)
    ? [discover, ...discover.connectionpost]
    : [discover];

  const postUrl = `${process.env.NEXT_PUBLIC_API_URL}/discover/${discover._id}?from=link`;
  const isCurrentUser = session?.user.username === discover.username;

  const renderCarouselItem = useCallback(
    (item: Discover | Discover["connectionpost"][0], index: number) => (
      <CarouselItem key={index} className="w-full flex flex-col gap-2 relative">
        <div className="text-sm flex justify-between items-center">
          {discover.place}
          <div>
          <Dropdown
            postUrl={postUrl}
            isCurrentUser={isCurrentUser}
            postid={discover._id}
            model="Discover"
          />
          </div>
        </div>
        {/* Image with Overlay */}
        <div className="relative">
          <Image
            className="w-full max-h-80 object-cover rounded-sm"
            src={item.discoverImage}
            alt={item.discoverName}
            width={1000}
            height={1000}
            quality={100}
            loading="lazy"
          />
          {carouselItems.length > 1 && (
            <CarouselPrevious className="absolute left-2" variant="ghost" />
          )}
          {/* Overlay Text */}
          <div className="absolute bottom-0 left-0  bg-background/60 p-2 flex items-center justify-between w-full">
            <div> {item.discoverName}</div>
           
          </div>
          {carouselItems.length > 1 && (
            <CarouselNext className="absolute right-2" variant="ghost" />
          )}
        </div>

        {/* User Information */}
        <div className="flex items-center justify-between text-xs md:text-sm mt-2">
          <div className="flex items-center space-x-3">
            <ConditionalProfilePicture
              username={item.username}
              image={item.image}
              index={index}
            />
            <div className="flex flex-col min-w-0 flex-shrink">
              <div className="text-sm font-medium truncate">{item.name}</div>
              <Moment className="text-xs font-extralight text-gray-500" fromNow>
                {new Date(item.createdAt)}
              </Moment>
            </div>
          </div>
          <div className="flex gap-2">
          <Like id={discover._id} model="Discover" likes={discover.like} />
          <Comments
            id={discover._id}
            model="Discover"
            comments={discover.comment}
            user={discover.username}
          />
          </div>
        </div>

        {/* Description */}
        <div className=" grid md:flex gap-2 my-2 ">
          <div className="text-sm w-3/4 break-words text-start whitespace-pre-wrap">
            {item.caption}
          </div>
          <div className="w-1/4 flex flex-col gap-2 ">
            <p className="flex gap-2 items-center">
              {" "}
              <BsLink />
              {discover.website || "-"}
            </p>
            <p className="flex gap-2 items-center">
              <MdContacts />
              {discover.contact || "-"}
            </p>

            <p className="flex gap-2 items-center">
              <TbChartArea />

              {discover.area
                ? discover.area.charAt(0).toUpperCase() + discover.area.slice(1)
                : "-"}
            </p>
          </div>
        </div>
      </CarouselItem>
    ),
    [discover.place, discover._id, discover.like, discover.comment, discover.username, discover.website, discover.contact, discover.area, carouselItems.length, postUrl, isCurrentUser]
  );

  return (
    <div className="flex flex-col w-full ">
      <Carousel>
        <CarouselContent>
          {carouselItems.map(renderCarouselItem)}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
