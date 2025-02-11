import { NextRequest, NextResponse } from "next/server";
import { task, user } from "@/app/db";

export async function POST(req: NextRequest) {
    try {
        const { userName }:{userName: string} = await req.json();

        const existinguser = await user.findOne({ userName });
        if (!existinguser) {
            return NextResponse.json({ message: "user dont exists" }, { status: 201 });
        }
        const tasks = await task.find({ _id: { $in: existinguser.tasks } });
        console.log(tasks)
        return NextResponse.json(tasks, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
