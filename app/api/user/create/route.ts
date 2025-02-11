import { NextRequest, NextResponse } from "next/server";
import { user } from "@/app/db";

export async function POST(req: NextRequest) {
    try {
        const { userName}: { userName: string} = await req.json();

        // Check if user already exists
        const existinguser = await user.findOne({ userName });
        if (existinguser) {
            return NextResponse.json({ message: "user already exists" }, { status: 409 });
        }

        // Create a new user
        const newuser = new user({ userName});
        await newuser.save();

        return NextResponse.json({ message: "user created successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
