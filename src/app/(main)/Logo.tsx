import React from 'react'
import { Cookie } from "next/font/google";
import Link from 'next/link';

const cookies = Cookie({
  weight: "400",
  subsets: ["latin"],
});

export default function Logo() {
  return (
    <div className={cookies.className}>
      <Link
        href="/"
        className="p-2 flex items-center text-6xl bg-clip-text text-transparent bg-gradient-to-r from-teal-500 to-gray-700"
      >
        Seeklish
      </Link>
    </div>
  )
}