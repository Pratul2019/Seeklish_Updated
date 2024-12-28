export const dynamic = 'force-dynamic'
import axios from 'axios';
import { Fragment } from "react";
import Discoverui from "./DiscoverUi";
import type { Discover } from '@/components/types';

async function getDiscovers(): Promise<Discover[]> {
  try {
    const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/Fetch/Discoverfetch`, {
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0',
      },
    });

    if (!response.data || !Array.isArray(response.data)) {
      throw new Error('Failed to fetch data or data is not an array');
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching discovers:", error);
    return [];
  }
}

export default async function Discover() {
  const discovers = await getDiscovers();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:p-4 md:mx-4 mt-20 md:mt-0">
      {discovers.map((discover: Discover) => (
        <Fragment key={discover._id}>
          <Discoverui discover={discover} />
        </Fragment>
      ))}
    </div>
  );
}