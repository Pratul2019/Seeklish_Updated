"use client";

import React, { useCallback, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  IoIosArrowDropleft,
  IoIosArrowDropright,
  IoIosClose,
} from "react-icons/io";
import { App } from "@/components/types";

import Moment from "react-moment";
import { usePathname } from "next/navigation";
import Like from "@/app/(main)/(Components)/Like";
import Comments from "@/app/(main)/(Comments)/Comments";
import Dropdown from "@/app/(main)/(Components)/Dropdown";
import ConditionalProfilePicture from "../UIComp/ConditionalProfilePicture";
import Modal from "../UIComp/Modal";


interface AppModalProps {
  app: App;
  onClose: () => void;
}

export default function AppModal({ app, onClose }: AppModalProps) {
  const { data: session } = useSession();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOpenProfile, setIsOpenProfile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleSignIn = () => {
    setIsLoading(true);
    // The actual redirection will be handled by the Link component
  };
  const connectionPostLength = app.connectionpost?.length || 0;

  const handleNext = useCallback(() => {
    setCurrentIndex(
      (prevIndex) => (prevIndex + 1) % (connectionPostLength + 1)
    );
  }, [connectionPostLength]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(
      (prevIndex) =>
        (prevIndex - 1 + connectionPostLength + 1) % (connectionPostLength + 1)
    );
  }, [connectionPostLength]);
  const carouselItems = Array.isArray(app.connectionpost)
    ? [app, ...app.connectionpost]
    : [app];

  const showNavigation = connectionPostLength > 0;

  const pathname = usePathname();
  const postUrl = `${process.env.NEXT_PUBLIC_API_URL}/application/${app._id}?from=link`;
  const isCurrentUser = session?.user.username === app.username;

  const renderCarouselItem = (
    item: App | App["connectionpost"][0],
    index: number
  ) => (
    <div key={index} className="w-full flex-shrink-0 flex flex-col gap-2">
      <div className="flex items-center justify-between text-xs md:text-sm">
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

        {/* {index !== 0 && (
          <Connectiondelete
            postId={app._id}
            connectionpostId={item._id}
            iscurrentUser={isCurrentUser}
            model="App"
          />
        )} */}
      </div>
      <div className="p-2 rounded-b-xl flex flex-col gap-2">
        <h3 className="text-lg">{item.appName}</h3>
        <p className="text-sm w-auto break-words text-start whitespace-pre-wrap">
          {item.caption}
        </p>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50 overflow-y-auto">
      <div className="bg-header rounded-3xl max-w-2xl w-full mx-auto my-8 shadow-xl">
        <div className="flex flex-col max-h-[calc(100vh-4rem)]">
          {/* Top navigation bar */}
          <div className="flex justify-between items-center p-2 border-b border-gray-700">
            <div className="flex items-center">
              {showNavigation && currentIndex > 0 ? (
                <button onClick={handlePrev} className="hover:text-teal-500">
                  <IoIosArrowDropleft size={20} />
                </button>
              ) : (
                <div className="w-6"></div>
              )}

              {showNavigation && (
                <button
                  onClick={handleNext}
                  className="hover:text-teal-500 ml-2"
                >
                  <IoIosArrowDropright size={20} />
                </button>
              )}
            </div>

            <div>
              {app.place && (
                <a
                  href={`https://www.google.com/maps?q=${encodeURIComponent(
                    app.place
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-light truncate hover:underline"
                >
                  {app.place}
                </a>
              )}
            </div>

            {pathname.startsWith("/application") ? (
              <Link href="/application">
                <button className="rounded-full p-2 hover:text-red-500">
                  <IoIosClose size={25} />
                </button>
              </Link>
            ) : (
              <button
                className="rounded-full p-2 hover:text-red-500"
                onClick={onClose}
              >
                <IoIosClose size={25} />
              </button>
            )}
          </div>

          {/* Scrollable content */}
          <div className="overflow-y-auto">
            <div className="p-2">
              {/* Carousel */}
              <div className="relative">
                <div className="overflow-hidden">
                  <div
                    className="flex transition-transform duration-300 ease-in-out"
                    style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                  >
                    {carouselItems.map(renderCarouselItem)}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-gray-700 p-2 mt-auto">
            <div className="flex justify-between items-center">
              <div className="flex justify-center">
                <Like id={app._id} model="App" likes={app.like} />
              </div>

              <div className="w-full mx-2">
                <Comments
                  id={app._id}
                  model="App"
                  comments={app.comment}
                  user={app.username}
                />
              </div>

              <div className="flex justify-center">
                <Dropdown
                  postUrl={postUrl}
                  isCurrentUser={isCurrentUser}
                  postid={app._id}
                  model="App"
                />
              </div>
            </div>
          </div>
        </div>
        {/* Modal for profile */}
        {isOpenProfile && (
          <Modal title="Let's get Started" setIsOpen={setIsOpenProfile}>
            <p className="mb-4 text-center">
              Can&apos;t comment without signing in!
            </p>
            <Link href="/signin" passHref>
              <button
                className={`bg-teal-500 hover:bg-teal-700 py-2 px-4 rounded-xl relative ${
                  isLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <span className="opacity-0">Sign In / Register</span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    </div>
                  </>
                ) : (
                  "Sign In / Register"
                )}
              </button>
            </Link>
          </Modal>
        )}
      </div>
    </div>
  );
}
