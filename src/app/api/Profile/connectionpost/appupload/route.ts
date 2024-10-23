import dbConnect from "@/lib/dbConnect";
import ApplicationModel from "@/Modals/Application";
import UserModel from "@/Modals/User";

import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  
    const { postid, currentusername, appName, caption } = await request.json();
  
    await dbConnect();
    
    const existingUser = await UserModel.findOne({ username: currentusername });
    //console.log('Existing user:', existingUser);
  
    if (!existingUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }
  
    try {
      const newapp = await ApplicationModel.updateOne({ _id: postid },
        {
          $push: {
            connectionpost: {
              username: currentusername,
              image: existingUser.image,
              name: existingUser.name,
              appName,
              caption,
            },
          },
        }
      );
      
      await UserModel.updateOne(
        { username: currentusername },
        {
          $addToSet: {
            connectpostapplication: postid,
          },
        }
      );
  
      return NextResponse.json(
        { message: "Rental Post Created", data: newapp },
        { status: 201 }
      );
    } catch (error) {
      console.error('Error:', error);
      return NextResponse.json(
        { message: "Error uploading image" },
        { status: 500 }
      );
    }
  }