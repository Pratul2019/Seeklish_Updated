"use client";
import { logout } from "@/actions/auth";
import { FiLogOut } from "react-icons/fi";
import { Button } from "../ui/button";

const Logout = () => {
  const handleLogout = async () => {
    await logout();
    window.location.reload(); // or window.location.reload()
  };

  return (
    <Button asChild variant="ghost" className="w-full justify-start" size="full">
      <div onClick={handleLogout} className="flex gap-2 cursor-pointer">
        <FiLogOut size={25} className="ml-10"/>
        Logout
      </div>
    </Button>
  );
};

export default Logout;
