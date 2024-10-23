export const dynamic = 'force-dynamic'

import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import {  NextResponse } from "next/server";


export async function GET() {
  await dbConnect();

  try {
    const mobapp = await ApplicationModel.find().sort({ createdAt: -1 });

    return NextResponse.json(mobapp);
  } catch (error) {
    const err = error as Error;
    console.error(err);
    return NextResponse.json({ error: err.message });
  }
}