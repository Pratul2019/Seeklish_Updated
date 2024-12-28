
import React from "react";

const Commentloading = () => {
  return (
<div className="flex mt-2 justify-between p-2">
    <div className="flex items-center gap-2">
      <div className="h-7 w-7 rounded-full bg-gray-200"></div>
      <div className="flex-grow text-xs">
        <div className="flex items-baseline gap-2">
          <div className="font-light bg-gray-200 h-4 w-20"></div>
          <div className="text-xs text-gray-500 bg-gray-200 h-4 w-20"></div>
        </div>
        <div className="mt-1 bg-gray-200 h-4 w-40"></div>
      </div>
    </div>
    <div className="bg-gray-200 h-4 w-10"></div>
  </div>
  )}

export default Commentloading;