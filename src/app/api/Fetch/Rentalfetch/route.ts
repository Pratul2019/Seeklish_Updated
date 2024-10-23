export const dynamic = 'force-dynamic'

import dbConnect from "@/lib/dbConnect";
import RentalModel from "@/Modals/Rental";
import { NextResponse } from "next/server";

export async function GET() {
    await dbConnect();
    try {
        const rental = await RentalModel.find().sort({ createdAt: -1 });

        return NextResponse.json(rental);
    } catch (error: unknown) {
        // Safely handle the error by checking its type
        if (error instanceof Error) {
            return NextResponse.json({ error: error.message });
        } else {
            return NextResponse.json({ error: "An unknown error occurred" });
        }
    }
}
