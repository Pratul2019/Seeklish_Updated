"use client";
import { logout } from "@/actions/auth";
import { FiLogOut } from "react-icons/fi";

const Logout = () => {
  return (
    <div
      onClick={() => logout()}
      className="flex items-center px-4 py-2 gap-3 mt-2 rounded-2xl cursor-pointer hover-theme-bg hover:text-teal-600 transition-colors duration-200"
    >
      <FiLogOut size={25} />
      Logout
    </div>
  );
};

export default Logout;
