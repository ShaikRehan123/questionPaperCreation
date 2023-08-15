import { db } from "@/db";
import { examTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const exams = await db.select().from(examTable);
    console.log(exams);

    return NextResponse.json({
      message: "Hello from the serverless function!",
      status: 200,
      exams,
    });
  } catch (error) {
    console.log(error);
    return NextResponse.json({
      message: "Hello from the serverless function!",
      status: 500,
      error,
    });
  }
}

export async function POST(request: Request) {
  const body = await request.json();

  await db.insert(examTable).values(body);

  return NextResponse.json({
    message: "Exam Created Successfully!",
    status: 200,
    body,
  });
}

export async function DELETE(request: Request) {
  const body = await request.json();

  await db.delete(examTable).where(eq(examTable.id, body.id));

  return NextResponse.json({
    message: "Exam Deleted Successfully!",
    status: 200,
    body,
  });
}
