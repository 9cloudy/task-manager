import { NextRequest, NextResponse } from "next/server";
import { task, user } from "@/app/db";

export async function POST(req: NextRequest) {
    try {
        const { userName, title, description }: { userName: string, title: string, description: string } = await req.json();

        // Check if user already exists
        const existinguser = await user.findOne({ userName });
        if (!existinguser) {
            return NextResponse.json({ message: "user dont exists" }, { status: 201 });
        }

        // Create a new task
        const newtask = new task({ description,title });
        await newtask.save();
        // Add task to the user's task list
        existinguser.tasks.push(newtask._id);
        await existinguser.save();

        return NextResponse.json({ _id:newtask._id, title, description,"isfinised": "PENDING"}, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
