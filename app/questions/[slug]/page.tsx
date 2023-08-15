"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { questionTypes } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useForm } from "react-hook-form";
import * as z from "zod";

interface examData {
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
    answerCols: number | null;
  }[];
}

const QuestionsPage = ({ params }: { params: { slug: string } }) => {
  const formSchema = z.object({
    questionType: z.enum(questionTypes as [string, ...string[]]),
    question: z.string(),
    mcqOptions: z.array(z.string()).nullable(),
    answerCols: z.number().nullable(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionType: "MCQ",
      question: "",
      mcqOptions: null,
      answerCols: null,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  const {
    data: examData,
    error,
    isLoading,
  } = useQuery<examData, Error>({
    queryKey: ["questions", params.slug],
    queryFn: () =>
      axios.get(`/api/questions?examId=${params.slug}`).then((res) => {
        return res.data.exam;
      }),
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center">
        <h1 className="heading">Error</h1>
        <p className="text-red-400">{JSON.stringify(error)}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="heading">{examData.title}</h1>
      <Card>
        <CardHeader>
          <CardTitle>Add Question</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="questionType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question Type</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {questionTypes.map((questionType) => (
                            <SelectItem key={questionType} value={questionType}>
                              {questionType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the type of question you want to add.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {}
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuestionsPage;
