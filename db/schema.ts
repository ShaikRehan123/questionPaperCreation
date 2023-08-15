import { relations } from "drizzle-orm";
import {
  pgTable,
  serial,
  text,
  varchar,
  date,
  integer,
  json,
} from "drizzle-orm/pg-core";

export const questionTypes = ["MCQ", "True/False", "Q&A"];

export const examTable = pgTable("exams", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  subject: varchar("subject", {
    length: 50,
  }).notNull(),
  createdAt: date("created_at").defaultNow(),
});

export const questionsTable = pgTable("questions", {
  id: serial("id").primaryKey(),
  examId: integer("exam_id").notNull(),
  questionType: text("question_type", {
    enum: questionTypes as [string, ...string[]],
  }).notNull(),
  question: text("question").notNull(),
  mcqOptions: json("json").$type<string[]>().default([]),
  answerCols: integer("answer_cols").default(1),
});

export const examRelations = relations(examTable, ({ many }) => ({
  questions: many(questionsTable),
}));

export const questionRelations = relations(questionsTable, ({ one }) => ({
  exam: one(examTable, {
    fields: [questionsTable.examId],
    references: [examTable.id],
  }),
}));
