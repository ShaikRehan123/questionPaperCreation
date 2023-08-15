CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"exam_id" integer NOT NULL,
	"question_type" text NOT NULL,
	"question" text NOT NULL,
	"json" json DEFAULT '[]'::json,
	"answer_cols" integer DEFAULT 1
);
