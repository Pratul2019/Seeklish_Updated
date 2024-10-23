import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";


export async function POST(req: NextRequest) {
  await dbConnect();
  try {
    const body = await req.json();
    const { username } = body;
    
    const application = await ApplicationModel.find({ username }).sort({ createdAt: -1 });
   
    return NextResponse.json(application, { status: 200 });
  } catch (error: unknown) {  // Use `unknown` instead of `any`
    if (error instanceof Error) {
        return NextResponse.json({
            message: error.message || 'Unknown error occurred',
            error: true
        });
    } else {
        return NextResponse.json({
            message: 'An unexpected error occurred',
            error: true
        });
    }
  }
}
