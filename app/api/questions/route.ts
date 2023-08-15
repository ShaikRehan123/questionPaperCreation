import { db } from "@/db";
import { examTable, questionsTable } from "@/db/schema";
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

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await db.insert(questionsTable).values(body);
    return NextResponse.json({
      message: "Questions added successfully",
      status: 200,
      body,
    });
  } catch (e) {
    return NextResponse.json({
      message: "Error adding questions",
      status: 500,
    });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = Number(searchParams.get("id"));
    const question = await db.query.questionsTable.findFirst({
      where: eq(questionsTable.id, id),
    });
    await db.delete(questionsTable).where(eq(questionsTable.id, id));
    return NextResponse.json({
      message: "Question deleted successfully",
      status: 200,
    });
  } catch (e) {
    return NextResponse.json({
      message: "Error deleting question",
      status: 500,
    });
  }
}
