"use server";

import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";
import { IoChevronBackCircleSharp } from "react-icons/io5";
import LoginGithub from "../../Components/Authentication/Logingithub";
import LoginGoogle from "../../Components/Authentication/Logingoogle";
import Loginfacebook from "../../Components/Authentication/Loginfacebook";

export default async function SignIn() {
  const session = await auth();
  if (session) {
    return redirect ('/')
  }
  return (
    <div className="flex h-screen justify-center items-center bg-light ">
      <div className="w-full flex flex-col justify-center items-center max-w-md p-8 bg-gradient-to-t from-teal-900 to-header rounded-3xl relative">
        <Link href="/" className="absolute top-8 right-6">
          <IoChevronBackCircleSharp size={25} className="hover:text-red-500" />
        </Link>
        <h2 className="font-serif text-xl text-center mb-8">Login/Signup</h2>
        <div className="md:flex grid">
          <LoginGithub />
          <LoginGoogle />
          <Loginfacebook />
        </div>
        <div className="text-xs flex flex-col items-center gap-2 mt-6">
          By continuing, you are agreeing to Terms and Conditions.{" "}
          <Link href={{ pathname: '/Terms&Conditions' }}>
            <div className="text-blue-500">View</div>
          </Link>
        </div>
      </div>
    </div>
  );
}
