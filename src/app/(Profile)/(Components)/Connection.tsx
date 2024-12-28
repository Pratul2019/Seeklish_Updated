"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { PiToggleLeftFill, PiToggleRightFill } from "react-icons/pi";
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface Connection {
  username: string;
  name: string;
  image: string;
  isallowed: boolean;
}

interface ConnectionsModalProps {
  connections: Connection[];
  
  currentuser: string;
  profileUser: string;
}

const ConnectionsModal: React.FC<ConnectionsModalProps> = ({
  connections,

  currentuser,
  profileUser,
}) => {
  const [checkedUsernames, setCheckedUsernames] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
 

  useEffect(() => {
    const allowedUsernames = connections
      .filter((connection) => connection.isallowed)
      .map((connection) => connection.username);
    setCheckedUsernames(allowedUsernames);
  }, [connections]);

  const handleCheckboxChange = (username: string, isChecked: boolean) => {
    setCheckedUsernames((prev) =>
      isChecked ? [...prev, username] : prev.filter((uname) => uname !== username)
    );
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const updatedConnections = connections.map((connection) => ({
        ...connection,
        isallowed: checkedUsernames.includes(connection.username),
      }));

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Fetch/isAllowed`,
        {
          profileUser,
          checkedUsernames,
          updatedConnections,
        }
      );

      if (response.status === 200 && response.data.success) {
        window.location.reload();
      // Close modal on success if needed
      } else {
        console.error("Error updating connections:", response.statusText);
      }
    } catch (error) {
      console.error("Error updating connections:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
      <>
        <ul>
          {connections.map((connection, index) => (
            <li key={index} className="flex justify-between items-center my-2 ">
              <div className="flex items-center gap-2">
              <Link href={connection.username}>
                <Image
                  src={connection.image}
                  alt={connection.name}
                  className="w-10 h-10 rounded-full "
                  height={40}
                  width={40}
                  priority
                />
                </Link>
                <label>{connection.name}</label>
              </div>
              {profileUser === currentuser && (
                checkedUsernames.includes(connection.username) ? (
                  <PiToggleRightFill
                    size={30}
                    fill="teal"
                    onClick={() => handleCheckboxChange(connection.username, false)}
                    className="cursor-pointer"
                  />
                ) : (
                  <PiToggleLeftFill
                    size={30}
                    onClick={() => handleCheckboxChange(connection.username, true)}
                    className="cursor-pointer"
                  />
                )
              )}
            </li>
          ))}
        </ul>
        {profileUser === currentuser && (
          <div className="flex justify-center">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant="secondary"
            >
              {isSubmitting ? "Updating..." : "Update"}
            </Button>
          </div>
        )}
    </>
  );
};

export default ConnectionsModal;
