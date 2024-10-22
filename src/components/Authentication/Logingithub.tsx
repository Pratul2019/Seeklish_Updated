"use client";

import { login } from "@/actions/auth";
import React from "react";
import { FaGithub } from "react-icons/fa";

const LoginGithub = () => {
  return (
    <div className="w-full p-2 flex justify-center">
      <div
        onClick={() => login("github")}
        className="flex gap-2 cursor-pointer p-2 rounded-3xl items-center"
      >
        <FaGithub size={32} className="text-purple-500" />
        Github
      </div>
    </div>
  );
};

export default LoginGithub;