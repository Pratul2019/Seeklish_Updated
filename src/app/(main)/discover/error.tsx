"use client";

import { useEffect } from "react";

export default function ErrorComponent({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center mt-72 p-6 space-y-6">
      <h2 className="text-2xl font-semibold">
        Something went wrong!
      </h2>
      <p className="text-gray-700 text-lg text-center">{error.message}</p>
      <button
        onClick={reset}
        className="px-6 py-3 bg-red-500 text-white rounded-lg shadow-md hover:bg-red-600 focus:outline-none focus:ring-4 focus:ring-red-300 transition-all duration-300"
      >
        Try again
      </button>
    </div>
  );
}
