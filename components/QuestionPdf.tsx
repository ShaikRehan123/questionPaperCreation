"use client";

import { questionTypes } from "@/db/schema";
import React from "react";

interface examDataType {
  title: string;
  id: number;
  subject: string;
  createdAt: string | null;
  questions: {
    examId: number;
    id: number;
    questionType: (typeof questionTypes)[number];
    question: string;
    mcqOptions: string[] | null;
    answerCols: number | string;
  }[];
}

// eslint-disable-next-line react/display-name
const QuestionPdf = React.forwardRef(
  ({ examData }: { examData: examDataType }, ref: any) => {
    console.log(examData);
    return (
      <div ref={ref} className="flex flex-col">
        <div className="flex justify-between ">
          <h1>{examData.title}</h1>
          <h1>
            Name: <span className="underline">____________________</span>
          </h1>
        </div>
        <hr className="my-2" />
        {examData.questions.map((question, i) => {
          return (
            <div key={i} className="flex flex-col my-2">
              <h3>
                {i + 1}. {question.question}
              </h3>
              {question.questionType === "MCQ" && (
                <div className="flex flex-col">
                  {question.mcqOptions?.map((option, i) => {
                    return (
                      <div key={i} className="flex items-center">
                        <input
                          type="checkbox"
                          className="mr-2"
                          id={option}
                          name={option}
                          disabled
                        />
                        <label htmlFor={option}>{option}</label>
                      </div>
                    );
                  })}
                </div>
              )}
              {question.questionType === "True/False" && (
                <div className="flex flex-col">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      id="True"
                      name="True"
                      disabled
                    />
                    <label htmlFor="True">True</label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="mr-2"
                      id="False"
                      name="False"
                      disabled
                    />
                    <label htmlFor="False">False</label>
                  </div>
                </div>
              )}
              {question.questionType === "Q&A" && (
                <div className="flex flex-col">
                  <textarea
                    className="w-full py-4 px-2 print:resize-none border border-gray-300 rounded-md"
                    rows={question.answerCols as number}
                    disabled
                  ></textarea>
                </div>
              )}
            </div>
          );
        })}
      </div>
    );
  }
);

export default QuestionPdf;
