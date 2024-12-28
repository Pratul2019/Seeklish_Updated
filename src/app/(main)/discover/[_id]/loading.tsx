// loading.tsx
import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
      <div className="bg-header rounded-3xl max-w-2xl w-full mx-auto my-8 shadow-xl">
        <div className="flex flex-col max-h-[calc(100vh-4rem)]">
          <div className="flex justify-between p-2 border-b border-gray-700">
            <div className="flex items-center">
              <div className="w-6 h-6 bg-gray-600 rounded animate-pulse"></div>
              <div className="w-6 h-6 bg-gray-600 rounded animate-pulse ml-2"></div>
            </div>
            <div className="w-48 h-6 bg-gray-600 rounded animate-pulse"></div>
          </div>
          <div className="overflow-y-auto">
            <div className="p-2">
              <div className="relative overflow-hidden">
                <div className="flex transition-transform duration-300 ease-in-out">
                  {[1, 2, 3].map((item, index) => (
                    <div key={index} className="w-full flex-shrink-0 flex flex-col gap-2 animate-pulse">
                      <div className="h-48 bg-gray-600 rounded"></div>
                      <div className="flex items-center justify-between text-sm md:text-base">
                        <div className="flex items-center gap-2 ">
                          <div className="w-10 h-10 bg-gray-600 rounded-full"></div>
                          <div className="flex flex-col max-w-xs">
                            <div className="w-24 h-6 bg-gray-600 rounded"></div>
                            <div className="w-36 h-6 bg-gray-600 rounded"></div>
                          </div>
                        </div>
                      </div>
                      <div className="p-2 rounded-b-xl flex flex-col gap-2">
                        <div className="h-6 bg-gray-600 rounded"></div>
                        <div className="h-6 bg-gray-600 rounded w-3/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-700 p-2 mt-auto">
            <div className="flex justify-between items-center">
              <div className="w-24 h-6 bg-gray-600 rounded animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-600 rounded animate-pulse"></div>
              <div className="w-24 h-6 bg-gray-600 rounded animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loading;