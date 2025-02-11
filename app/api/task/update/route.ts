import { NextRequest, NextResponse } from "next/server";
import { task, user,status } from "@/app/db";

export async function POST(req: NextRequest) {
    try {
        const { id, title, description ,isDone}: { id:string, title:string, description:string,isDone: boolean} = await req.json();
        const isfinised = isDone? status.FINISHED : status.FAILED; 
        const updatedTask = await task.findByIdAndUpdate(id, { title,description,isfinised }, { new: true });

        if (!updatedTask) {
            return NextResponse.json({ title, description ,isfinised}, { status: 404 });
        }
        return NextResponse.json({ message: "task updated successfully" }, { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
