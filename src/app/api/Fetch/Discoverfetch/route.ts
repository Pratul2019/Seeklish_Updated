export const dynamic = 'force-dynamic'

import dbConnect from "@/lib/dbConnect";
import DiscoverModel from "@/Modals/Discover";
import { NextResponse } from "next/server";


export async function GET() {
 
  
  await dbConnect();
  // console.log('Database connected');
  
  try {
    // console.log('Querying discovers...');
    
    const discover = await DiscoverModel.find().sort({ createdAt: -1 });
    
    // console.log('Database query result:', discover);
    
    return NextResponse.json(discover);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error fetching discovers:', error);
      
      return NextResponse.json({ error: error.message });
    } else {
      console.error('Unknown error:', error);
      
      return NextResponse.json({ error: 'An unknown error occurred' });
    }
  }
}