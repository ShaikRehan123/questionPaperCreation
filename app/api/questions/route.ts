import { db } from "@/db";
import { examTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const examId = Number(searchParams.get("examId"));
    const exam = await db.query.examTable.findFirst({
      where: eq(examTable.id, examId),
      with: { questions: true },
    });

    return NextResponse.json({
      message: "Exam fetched successfully",
      exam: exam,
      status: 200,
    });
  } catch (e) {
    return NextResponse.json({
      message: "Error fetching exam",
      status: 500,
    });
  }
}
