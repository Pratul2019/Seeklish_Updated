// RentalUpl.tsx
import React, { useState } from "react";
import axios from "axios";
import { useSession } from "next-auth/react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import ImageUpload from "@/components/UIComp/ImageUpload";
import { Button } from "@/components/ui/button";

interface RentalUplProps {
  locationData: {
    location: string | null;
  };
}
const RentalUpl: React.FC<RentalUplProps> = ({ locationData }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [rentalName, setRentalName] = useState("");
  const [responseStatus, setResponseStatus] = useState<number | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [website, setWebsite] = useState("");
  const [contact, setContact] = useState("");
  const [area, setArea] = useState("");

  const handleUpload = async () => {
    if (loading || !session?.user?.username) return;

    setLoading(true);
    try {
      const response = await axios.post("/api/Upload/Rentalupload", {
        username: session.user.username,
        rentalName,
        caption,
        place: locationData.location,
        rentalImage: selectedFile,
        website,
        contact,
        area,
      });

      setResponseStatus(response.status);
     

      if (response.status === 200) {
        setRentalName("");
        setCaption("");
        setSelectedFile(null);
        setWebsite("");
        setContact("");
        setArea("");
      }
    } catch (error) {
      setResponseStatus(500);
      setIsDialogOpen(true); // Only open dialog if there's an error
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className=" flex justify-center items-center h-full w-full ">
      <div className="flex flex-col gap-10 w-full md:w-fit h-full">
        <ImageUpload
          selectedFile={selectedFile}
          setSelectedFile={setSelectedFile}
        />
        <Input
          label="Rental Name *"
          placeholder=""
          value={rentalName}
          onChange={(e) => setRentalName(e.target.value)}
          maxLength={20}
        />
        <Input
          label="Caption *"
          placeholder=""
          value={caption}
          type="textarea"
          onChange={(e) => setCaption(e.target.value)}
        />
        <Input
          label="Website "
          placeholder=""
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          maxLength={25}
        />
        <Input
          label="Contact"
          type="tel"
          value={contact}
          placeholder=""
          onChange={(e) => {
            // Only allow digits
            const value = e.target.value.replace(/\D/g, "");
            if (value.length <= 15) {
              setContact(value);
            }
          }}
          inputMode="numeric"
          pattern="[0-9]*"
        />
        <Input
          label="Area"
          placeholder=""
          value={area}
          onChange={(e) => setArea(e.target.value)}
          maxLength={20}
        />

        <p>Location: {locationData.location}</p>

        <div className="w-full flex justify-end gap-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                onClick={handleUpload}
                disabled={
                  loading ||
                  !caption ||
                  !rentalName ||
                  !selectedFile
                }
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
                  <Link href="/rental">
                    <Button variant="default">
                      Okay
                    </Button>
                  </Link>
                ) : (
                  <Link href="/Upload/RentalUpl">
                    <Button variant="destructive">
                      Try Again
                    </Button>
                  </Link>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>

          {/* <Button variant="destructive">Close</Button> */}
        </div>
      </div>
    </div>
  );
};

export default RentalUpl;
