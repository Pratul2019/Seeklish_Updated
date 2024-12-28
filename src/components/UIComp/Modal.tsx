"use client"

import React from "react";
import { IoIosClose } from "react-icons/io";

interface ModalProps {
  title: string;
  children: React.ReactNode;
  setIsOpen: (isOpen: boolean) => void;
}

const Modal: React.FC<ModalProps> = ({ title, children, setIsOpen }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="p-4 bg-header rounded-3xl w-96 max-w-full flex flex-col gap-2">
        <div className="flex p-2 justify-between items-center">
          <h4 className="">{title}</h4>
          <button
            className=""
            onClick={() => setIsOpen(false)}
          >
            <IoIosClose size={25} className="hover:text-red-500" />
          </button>
        </div>
        <div className="text-sm break-words flex flex-col gap-2 text-wrap text-center overflow-y-auto max-h-72">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Modal;