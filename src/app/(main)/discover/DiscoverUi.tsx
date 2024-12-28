"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Moment from "react-moment";
import { FaArrowAltCircleUp } from "react-icons/fa";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import Like from "../(Components)/Like";
import Comments from "../(Comments)/Comments";
import ConditionalProfilePicture from "@/components/UIComp/ConditionalProfilePicture";
import Dropdown from "../(Components)/Dropdown";
import { useSession } from "next-auth/react";
import { Discover } from "@/components/types";

interface DiscoveruiProps {
  discover: Discover;
}

const Discoverui = ({ discover }: DiscoveruiProps) => {
  const [postUrl, setPostUrl] = useState("");
  const { data: session } = useSession();

  useEffect(() => {
    setPostUrl(`${process.env.NEXT_PUBLIC_API_URL}/discover/${discover._id}`);
  }, [discover._id]);
  const isCurrentUser = session?.user.username === discover.username;

  const carouselItems = [discover, ...discover.connectionpost];
  return (
    <div className="w-full">
      <div className="flex justify-between items-center p-2">
        {discover.place && (
          <div className="flex flex-col">
            <a
              href={`https://www.google.com/maps?q=${encodeURIComponent(
                discover.place
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-light text-xs"
            >
              {discover.place.substring(0, 50)}
            </a>
          </div>
        )}
        <Dropdown
          postUrl={postUrl}
          isCurrentUser={isCurrentUser}
          postid={discover._id}
          model="Discover"
        />
      </div>
      <Carousel>
        <CarouselContent>
          {carouselItems.map((item, index) => (
            <CarouselItem key={index}>
              <div className="flex flex-col">
                <div className="relative w-full aspect-video">
                  <Image
                    className="absolute object-cover w-full h-full rounded-sm"
                    src={item.discoverImage}
                    alt={item.discoverName}
                    width={1000}
                    height={1000}
                    priority
                  />
                  {carouselItems.length > 1 && (
                    <CarouselPrevious
                      className="absolute left-2"
                      variant="ghost"
                    />
                  )}
                  <div className="absolute bottom-2 left-1  bg-background/60 p-3 rounded-xl gap-2 flex items-center max-w-72">
                    {item.discoverName}

                    <Drawer>
                      <DrawerTrigger asChild>
                        <FaArrowAltCircleUp
                          size={20}
                          className="cursor-pointer hover:text-primary"
                        />
                      </DrawerTrigger>
                      <DrawerContent>
                        <div className="mx-auto w-full items-center flex flex-col">
                          <DrawerHeader>
                            <DrawerTitle>Discover Details</DrawerTitle>
                            <DrawerDescription></DrawerDescription>
                          </DrawerHeader>

                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 w-full">
                            <div className="flex flex-col">
                              <h3 className="font-semibold mb-2">Caption</h3>
                              <div className="p-3 border rounded-md max-h-48 overflow-y-auto">
                                <p className="text-sm leading-relaxed break-words whitespace-pre-wrap">
                                  {item.caption}
                                </p>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex flex-col">
                                <h3 className="font-semibold mb-2">Website</h3>
                                <div className="p-3 border rounded-md h-full">
                                  <p className="text-sm">
                                    {discover.website || "-"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col">
                                <h3 className="font-semibold mb-2">Contact</h3>
                                <div className="p-3 border rounded-md h-full">
                                  <p className="text-sm">
                                    {discover.contact || "-"}
                                  </p>
                                </div>
                              </div>

                              <div className="flex flex-col sm:col-span-2">
                                <h3 className="font-semibold mb-2">Area</h3>
                                <div className="p-3 border rounded-md h-full">
                                  <p className="text-sm">
                                    {discover.area
                                      ? discover.area.charAt(0).toUpperCase() +
                                        discover.area.slice(1)
                                      : "-"}
                                  </p>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </DrawerContent>
                    </Drawer>
                  </div>
                  {carouselItems.length > 1 && (
                    <CarouselNext
                      className="absolute right-2"
                      variant="ghost"
                    />
                  )}
                </div>

                <div className="flex items-center justify-between p-2 border-b">
                  <div className="flex items-center gap-2">
                    <ConditionalProfilePicture
                      username={item.username}
                      image={item.image}
                      index={index}
                    />

                    <div className="flex flex-col">
                      {item.name}
                      <Moment className="text-xs font-extralight " fromNow>
                        {new Date(item.createdAt)}
                      </Moment>
                    </div>
                  </div>
                  <div className="flex gap-4 items-center justify-center">
                    <Like id={discover._id} model="Discover" likes={discover.like} />
                    <Comments
                      id={discover._id}
                      user={discover.username}
                      model="Discover"
                      comments={discover.comment}
                    />
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};

export default Discoverui;
