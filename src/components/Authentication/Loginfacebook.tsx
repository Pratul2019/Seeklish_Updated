"use client";

import { login } from "@/actions/auth";
import React from "react";
import { FaFacebook } from "react-icons/fa";

const Loginfacebook = () => {
  return (
    <div className="w-full p-2 flex justify-center">
      <div
        onClick={() => login("facebook")}
        className="flex gap-2 cursor-pointer p-2 rounded-3xl items-center"
      >
        <FaFacebook size={32} className="text-blue-500" />
        Facebook
      </div>
    </div>
  );
};

export default Loginfacebook;
