"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

import { questionTypes } from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { DownloadIcon, EyeIcon, Loader2, MinusIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import QuestionPdf from "@/components/QuestionPdf";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

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
    answerCols: number | string;
  }[];
}

const QuestionsPage = ({ params }: { params: { slug: string } }) => {
  const formSchema = z.object({
    questionType: z.enum(questionTypes as [string, ...string[]], {
      required_error: "Question Type is required",
    }),
    question: z.string().nonempty("Question is required"),
    mcqOptions: z.array(z.string()),
    answerCols: z.number().or(z.string()),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      questionType: "MCQ",
      question: "",
      mcqOptions: [],
      answerCols: 0,
    },
  });

  const queryClient = useQueryClient();
  const { toast } = useToast();

  const mutation = useMutation({
    mutationFn: (data: z.infer<typeof formSchema>) =>
      axios.post("/api/questions", data),
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries(["questions", params.slug]);
      toast({
        title: "Question Added",
        description: "Question has been added successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Something went wrong.",
        variant: "destructive",
      });
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const data = {
      ...values,
      examId: params.slug,
      answerCols: Number(values.answerCols),
    };

    mutation.mutate(data);
  }

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 5;
      }

    `,
  });

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
      <div className="flex justify-between">
        <h1 className="heading">{examData.title}</h1>

        <div className="flex gap-3">
          <Dialog>
            <DialogTrigger>
              <Button variant={"secondary"} asChild>
                <div className="flex items-center">
                  <EyeIcon className="mr-2 h-4 w-4" />
                  Preview PDF
                </div>
              </Button>
            </DialogTrigger>
            <DialogContent className="!min-w-[90%] !h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle asChild>
                  <div className="flex justify-between items-center px-4">
                    <h1 className="heading">{examData.title}</h1>
                    <Button onClick={handlePrint}>
                      <DownloadIcon className="mr-2 h-4 w-4" /> Download
                    </Button>
                  </div>
                </DialogTitle>
                <DialogDescription asChild>
                  <QuestionPdf ref={componentRef} examData={examData} />
                </DialogDescription>
              </DialogHeader>
            </DialogContent>
          </Dialog>
        </div>
      </div>

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
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Question Type" />
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

              <FormField
                control={form.control}
                name="question"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Question</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="What is the capital of India?"
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Enter the question you want to add.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {form.watch("questionType") === "Q&A" && (
                <FormField
                  control={form.control}
                  name="answerCols"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Answer Columns</FormLabel>
                      <FormControl>
                        <Input placeholder="2" type="number" {...field} />
                      </FormControl>
                      <FormDescription>
                        Enter the number of columns to leave space in the
                        question paper.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}

              {form.watch("questionType") === "MCQ" && (
                <>
                  <FormField
                    control={form.control}
                    name="mcqOptions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Options</FormLabel>
                        <FormControl className="space-y-2 mt-2 flex flex-col">
                          <>
                            {form.getValues("mcqOptions").map((_, index) => (
                              <div key={index} className="flex space-x-4">
                                <Input
                                  key={index}
                                  placeholder="Option"
                                  {...form.register(
                                    `mcqOptions.${index}` as const
                                  )}
                                />
                                <Button
                                  onClick={() => {
                                    form.setValue(
                                      "mcqOptions",
                                      form
                                        .getValues("mcqOptions")
                                        .filter((_, i) => i !== index)
                                    );
                                  }}
                                  variant={"destructive"}
                                  size={"icon"}
                                >
                                  <MinusIcon />
                                </Button>
                              </div>
                            ))}

                            <Button
                              onClick={() => {
                                form.setValue("mcqOptions", [
                                  ...form.getValues("mcqOptions"),
                                  "",
                                ]);
                              }}
                              className="w-full"
                              variant={"secondary"}
                              type="button"
                            >
                              Add Option
                            </Button>
                          </>
                        </FormControl>
                        <FormDescription>
                          Enter the options for the MCQ question.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              )}

              <Button
                type="submit"
                className="w-full"
                disabled={mutation.isLoading}
              >
                {mutation.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Add Question
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {examData.questions.map((question) => (
        <Card key={question.id} className="relative">
          <CardHeader>
            <CardTitle>{question.question}</CardTitle>
            <CardDescription>{question.questionType} </CardDescription>
          </CardHeader>
          <CardContent>
            {question.questionType === "MCQ" && (
              <div>{question.mcqOptions?.join(", ")}</div>
            )}

            {question.questionType === "Q&A" && (
              <div>Number of Cols: {question.answerCols}</div>
            )}
          </CardContent>

          <Button
            size={"icon"}
            variant={"destructive"}
            className="absolute top-2 right-2"
            onClick={() => {
              axios.delete(`/api/questions?id=${question.id}`).then(() => {
                queryClient.invalidateQueries(["questions", params.slug]);
                toast({
                  title: "Question Deleted",
                  description: "Question has been deleted successfully.",
                });
              });
            }}
          >
            <MinusIcon />
          </Button>
        </Card>
      ))}
    </div>
  );
};

export default QuestionsPage;
