// src/app/@header/page.tsx
"use client";

import MapSearch from "@/components/UIComp/MapSearch";
import { useState } from "react";
import { FaSearchLocation } from "react-icons/fa";

export default function HeaderPage() {
  const [place, setPlace] = useState<google.maps.places.PlaceResult | null>(
    null
  );
  console.log(place?.formatted_address, "place")
  return (
    <div className="items-center flex justify-center p-4 gap-6">
       <MapSearch onPlaceSelected={setPlace} />
       <FaSearchLocation size={30} className="cursor-pointer"/>
    </div>
  );
}
