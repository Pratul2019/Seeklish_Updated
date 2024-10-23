    'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';

export default function RestoreUserForm({ username }: { username: string }) {
  const [isRestoring, setIsRestoring] = useState(false);
  const router = useRouter();

  const handleRestore = async () => {
    setIsRestoring(true);
    try {
      const response = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/api/RestoreUser`, {
        username,
      });
  
      if (response.status === 200) {
        // Redirect to home page or dashboard after successful restoration
        router.push('/signin');
      } else {
        // Handle error
        console.error('Restoration failed');
        // You might want to show an error message to the user here
      }
    } catch (error) {
      console.error('Error during restoration:', error);
      // You might want to show an error message to the user here
    } finally {
      setIsRestoring(false);
    }
  };

  const handleGoBack = () => {
    router.push('/');
  };

  return (
    <div className="flex flex-col space-y-4">
      <button
        onClick={handleRestore}
        disabled={isRestoring}
        className={`w-full flex items-center justify-center px-4 py-3 border border-transparent text-base font-medium rounded-md text-white ${
          isRestoring ? 'bg-teal-500 cursor-not-allowed' : 'bg-teal-600 hover:bg-teal-700'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
      >
        {isRestoring ? (
          <>
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Restoring...
          </>
        ) : (
          'Yes, restore my account'
        )}
      </button>
      <button
        onClick={handleGoBack}
        disabled={isRestoring}
        className={`w-full flex items-center justify-center px-4 py-3 border border-gray-300 text-base font-medium rounded-md text-gray-700 ${
          isRestoring ? 'bg-gray-100 cursor-not-allowed' : 'bg-white hover:bg-gray-50'
        } focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200`}
      >
        No, go back home
      </button>
    </div>
  );
}