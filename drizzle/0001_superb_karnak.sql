ALTER TABLE "exams" ALTER COLUMN "subject" SET DATA TYPE varchar(50);
ALTER TABLE "exams" ADD COLUMN "created_at" date DEFAULT now();