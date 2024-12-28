"use client";

import Link from "next/link";
import React from "react";
import { HiHomeModern } from "react-icons/hi2";
import { MdAppShortcut } from "react-icons/md";
import { SiWpexplorer } from "react-icons/si";
import { usePathname } from "next/navigation";

const Header = () => {
  const pathname = usePathname();

  return (
    <div className="flex items-center justify-center gap-10">
      <Link href="/Upload/Discoverupload">
        <SiWpexplorer
          size={30}
          className={`cursor-pointer ${
            pathname === "/Upload/Discoverupload" ? "text-teal-700" : "hover:text-teal-500"
          }`}
        />
      </Link>
      <Link href="/Upload/Rentalupload">
        <HiHomeModern
          size={30}
          className={`cursor-pointer ${
            pathname === "/Upload/Rentalupload" ? "text-teal-700" : "hover:text-teal-500"
          }`}
        />
      </Link>
      <Link href="/Upload/Appupload">
        <MdAppShortcut
          size={30}
          className={`cursor-pointer ${
            pathname === "/Upload/Appupload" ? "text-teal-700" : "hover:text-teal-500"
          }`}
        />
      </Link>
      
    </div>
  );
};

export default Header;