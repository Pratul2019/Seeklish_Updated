export default function Loading() {
    // You can add any UI inside Loading, including a Skeleton.
    return (
      <div className="pb-8">
        <div className="flex justify-center mb-6 p-6 gap-8 items-center">
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
          <div className="w-8 h-8 bg-gray-300 rounded-full"></div>
        </div>
  
        <div className="container min-w-full p-6 sm:p-10 flex flex-col gap-10 bg-header">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-8">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 md:w-24 md:h-24 bg-gray-300 rounded-full"></div>
              <div className="flex flex-col items-center">
                <div className="w-24 h-4 bg-gray-300 rounded-full"></div>
                <div className="w-12 h-4 bg-gray-300 rounded-full mt-2"></div>
              </div>
            </div>
  
            <div className="flex flex-col items-center gap-4 mt-4 sm:mt-0">
              <div className="w-24 h-8 bg-gray-300 rounded-full"></div>
              <div className="flex space-x-6">
                <div className="w-12 h-4 bg-gray-300 rounded-full"></div>
                <div className="w-2 h-2 bg-gray-300 rounded-full"></div>
                <div className="w-16 h-4 bg-gray-300 rounded-full"></div>
              </div>
            </div>
          </div>
        </div>
  
        <div className="flex justify-center mb-8 gap-6 text-lg">
          {Array(3)
            .fill(0)
            .map((_, index) => (
              <div
                key={index}
                className="px-4 py-2 mx-2 rounded-2xl font-medium bg-gray-300 w-24 h-8 flex items-center gap-2"
              >
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
                <div className="w-12 h-4 bg-gray-300 rounded-full"></div>
                <div className="w-4 h-4 bg-gray-300 rounded-full"></div>
              </div>
            ))}
        </div>

        
  
      </div>
    );
  }
  