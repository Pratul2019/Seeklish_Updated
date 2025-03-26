export const dynamic = 'force-dynamic'
import axios from 'axios';
import { Fragment } from "react";
import Discoverui from "./DiscoverUi";
import type { Discover } from '@/components/types';
import ErrorComponent from './error';

async function getDiscovers(): Promise<Discover[]> {
  const response = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/api/Fetch/Discoverfetch`);

  if (!response.data || !response.data.discovers || !Array.isArray(response.data.discovers)) {
    throw new Error('Failed to fetch data or data format is incorrect');
  }

  return response.data.discovers;
}

export default async function Discover() {
  try {
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
  } catch (error) {
    return <ErrorComponent 
      error={error instanceof Error ? error : new Error('An unknown error occurred')} 
      reset={() => window.location.reload()} 
    />;
  }
}