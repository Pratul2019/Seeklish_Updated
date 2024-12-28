"use client";

import axios from "axios";
import React, { useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Appliupl({ location }: { location: string }) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [caption, setCaption] = useState("");
  const [appName, setAppName] = useState("");
  const [responseStatus, setResponseStatus] = useState<number | null>(null);

  const handleUpload = async () => {
    if (loading || !session?.user?.username) return;

    setLoading(true);

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/api/Upload/Appupload`,
        {
          username: session.user.username,
          appName,
          caption,
          place: location,
        }
      );

      setResponseStatus(response.status);
      setIsDialogOpen(true);

      if (response.status === 200) {
        setAppName("");
        setCaption("");
      }

      setLoading(false);
    } catch (error) {
      setResponseStatus(500);
      setIsDialogOpen(true);
      setLoading(false);
      console.error(error);
    }
  };

  return (
    <div className="w-full flex justify-center items-center h-4/5">
      <div className="flex flex-col gap-10 w-96">
        <Input
          label="Application Name"
          placeholder=""
          value={appName}
          onChange={(e) => setAppName(e.target.value)}
        />
        <Input
          label="Caption"
          placeholder=""
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
        />
        <p className="mt-2">Selected location: {location}</p>
        <div className="w-full flex justify-end gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                variant="default"
                size="default"
                disabled={loading || !caption || !appName}
                onClick={handleUpload}
              >
                {loading ? "Uploading..." : "Upload"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogTitle>
                {responseStatus === 200
                  ? "Congrats"
                  : responseStatus === 404
                  ? "Oops!"
                  : "Error"}
              </DialogTitle>
              <DialogDescription>
                {responseStatus === 200
                  ? "Uploaded Successfully"
                  : responseStatus === 404
                  ? "Upload Unsuccessful"
                  : "Failed to post. Please check your network connection."}
              </DialogDescription>
              <DialogFooter>
                {responseStatus === 200 ? (
                  <Link href="/application">
                    <Button variant="default" size="default">
                      Okay
                    </Button>
                  </Link>
                ) : (
                  <Link href="/Upload/Appupload">
                    <Button asChild variant="destructive" size="default">
                      Try Again
                    </Button>
                  </Link>
                )}
                
              </DialogFooter>
            </DialogContent>
          </Dialog>
          <Link href="/application">
            <Button variant="outline" size="default">
              Close
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}