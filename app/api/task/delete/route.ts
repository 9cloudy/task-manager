import { NextRequest, NextResponse } from "next/server";
import { task, user } from "@/app/db";

export async function POST(req: NextRequest) {
    try {
        const { id }:{id: string} = await req.json();
        await task.findByIdAndDelete(id);
        return NextResponse.json("deleted", { status: 201 });
    } catch (error) {
        console.error("Error creating user:", error);
        return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
    }
}
