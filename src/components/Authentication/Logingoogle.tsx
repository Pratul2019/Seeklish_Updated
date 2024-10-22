"use client";

import { login } from "@/actions/auth";
import React from "react";
import { FaGoogle } from "react-icons/fa";

const LoginGoogle = () => {
  return (
    <div className="w-full p-2 flex justify-center">
      <div
        onClick={() => login("google")}
        className="flex gap-2 cursor-pointer p-2 rounded-3xl items-center"
      >
        <FaGoogle size={32} className="text-red-500" />
        Google
      </div>
    </div>
  );
};

export default LoginGoogle;
