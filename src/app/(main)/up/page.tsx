"use client";

import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import MapSearch from "@/components/UIComp/MapSearch";
import { HiHomeModern } from "react-icons/hi2";
import { MdAppShortcut } from "react-icons/md";
import { SiWpexplorer } from "react-icons/si";
import Appliupl from "./(Upload)/Appliupl";
import RentalUpl from "./(Upload)/RentalUpl";
import ExistLocation from "./(Upload)/ExistLocation";

type Category = "discover" | "rental" | "application";

export default function Upload() {
  const [selectedCategory, setSelectedCategory] = useState<Category>("discover");
  const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(null);
  const [applicationLocation, setApplicationLocation] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [renderedComponent, setRenderedComponent] = useState<React.ReactNode>(null);
  const [previousLocation, setPreviousLocation] = useState<string | null>(null);

  const categories: Array<{
    id: Category;
    label: string;
    icon: React.ElementType;
  }> = [
    { id: "discover", label: "Discover", icon: SiWpexplorer },
    { id: "rental", label: "Rental", icon: HiHomeModern },
    { id: "application", label: "Application", icon: MdAppShortcut },
  ];

  const resetForm = () => {
    setPlace(null);
    setApplicationLocation("");
    setRenderedComponent(null);
    setPreviousLocation(null);
  };

  const handleLocationSubmit = useCallback(async () => {
    setIsLoading(true);

    try {
      if (selectedCategory === "application") {
        if (!applicationLocation.trim()) {
          alert("Please enter a location");
          setIsLoading(false);
          return;
        }
        setRenderedComponent(<Appliupl location={applicationLocation} />);
      } else if (place?.formatted_address && place.formatted_address !== previousLocation) {
        const response = await axios.post("/api/Upload/Locationsearch", {
          location: place.formatted_address,
          category: selectedCategory,
        });

        if (response.status === 200) {
          setRenderedComponent(<ExistLocation data={response.data} />);
        } else if (response.status === 202) {
          if (selectedCategory === "discover") {
            setRenderedComponent(<div>Discover</div>);
          } else if (selectedCategory === "rental") {
            setRenderedComponent(
              <RentalUpl locationData={{ location: place.formatted_address ?? null }} />
            );
          }
        }
        setPreviousLocation(place.formatted_address);
      }
    } catch (error) {
      console.error("Error submitting location:", error);
      alert("Failed to submit location");
    } finally {
      setIsLoading(false);
    }
  }, [selectedCategory, place, applicationLocation, previousLocation]);

  // Automatically trigger location submit when location changes
  useEffect(() => {
    if (selectedCategory !== "application" && place?.formatted_address) {
      handleLocationSubmit();
    }
  }, [place, selectedCategory, handleLocationSubmit]);

  return (
    <div className="flex flex-col justify-center items-center gap-6 p-6 h-full">
      <div className="flex gap-6 justify-around max-w-md">
        {categories.map(({ id, label, icon: Icon }) => (
          <div
            key={id}
            className={`flex flex-col items-center cursor-pointer p-3 rounded-lg transition-all duration-300 ${
              selectedCategory === id
                ? "bg-primary text-lg"
                : "hover:bg-secondary"
            }`}
            onClick={() => {
              setSelectedCategory(id);
              resetForm();
            }}
          >
            <Icon className="h-6 w-6 mb-1" />
            <span className="text-xs font-medium">{label}</span>
          </div>
        ))}
      </div>

      <div className="w-full max-w-md mt-4">
        {selectedCategory === "application" ? (
          <Input
            type="text"
            value={applicationLocation}
            onChange={(e) => setApplicationLocation(e.target.value)}
            placeholder="Enter location"
            className="w-full"
          />
        ) : (
          <div className="w-full">
            <MapSearch onPlaceSelected={setPlace} />
            {place?.formatted_address && (
              <p className="mt-2 text-sm text-gray-600">
                Selected location: {place.formatted_address}
              </p>
            )}
          </div>
        )}
      </div>

      {selectedCategory === "application" && (
        <Button
          variant="default"
          onClick={handleLocationSubmit}
          size="lg"
          disabled={!applicationLocation.trim() || isLoading}
        >
          {isLoading ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="animate-spin h-5 w-5"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="12"
                fill="currentColor"
              />
              <path
                className="opacity-100"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A8.014 8.014 0 0112 14.25V24a8 8 0 018-8z"
              />
            </svg>
          ) : (
            "Next"
          )}
        </Button>
      )}

      {renderedComponent}
    </div>
  );
}
