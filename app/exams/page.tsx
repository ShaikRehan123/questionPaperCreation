"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, MoreHorizontal } from "lucide-react";
import { ColumnDef } from "@tanstack/react-table";
import { DataTable } from "./data-table";
import axios from "axios";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export type Exam = {
  id: string;
  title: number;
  subject: string;
};

const ExamPage = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const formSchema = z.object({
    title: z.string().min(2, "Too Short!").max(50, "Too Long!"),
    subject: z.string().min(2).max(500),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      subject: "English",
    },
  });

  const availableSubjects = [
    "English",
    "Mathematics",
    "Science",
    "Social Studies",
    "Computer",
    "General Knowledge",
    "Hindi",
    "Telugu",
    "Other",
  ];

  const router = useRouter();

  const {
    isLoading,
    error,
    data: exams,
  } = useQuery({
    queryKey: ["exams"],
    queryFn: () =>
      axios.get("/api/exams").then((res) => {
        return res.data;
      }),
  });

  const mutation = useMutation({
    mutationFn: async (exam: any) => {
      // return fetch("/api/exams", {
      //   method: "POST",
      //   body: JSON.stringify(exam),
      // });
      return axios.post("/api/exams", exam);
    },
    onSuccess: () => {
      form.reset();
      queryClient.invalidateQueries({
        queryKey: ["exams"],
      });
      toast({
        title: "Created",
        description: "Exam has been created successfully",
      });
    },
  });

  const columns: ColumnDef<Exam>[] = [
    {
      accessorKey: "id",
      header: "ID",
    },
    {
      accessorKey: "title",
      header: "Title",
    },
    {
      accessorKey: "subject",
      header: "Subject",
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell({ row }) {
        return new Date(row.getValue("createdAt")).toLocaleDateString();
      },
    },
    {
      id: "actions",
      cell({ row }) {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => {
                  router.push(`/questions/${row.getValue("id")}`);
                }}
              >
                Questions
              </DropdownMenuItem>
              <DropdownMenuItem className="text-yellow-400">
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-red-400"
                onClick={() => {
                  axios
                    .delete(`/api/exams`, {
                      data: {
                        id: row.getValue("id"),
                      },
                    })
                    .then(() => {
                      toast({
                        title: "Deleted",
                        description: "Exam has been deleted successfully",
                        variant: "destructive",
                      });
                      queryClient.invalidateQueries({
                        queryKey: ["exams"],
                      });
                    });
                }}
              >
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

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
    <div className="flex flex-col gap-8">
      <h1 className="heading">All Exams</h1>

      <Card>
        <CardHeader>
          <CardTitle>Create Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Title</FormLabel>
                    <FormControl>
                      <Input placeholder="English Exam" {...field} />
                    </FormControl>
                    <FormDescription>
                      Enter the title of the exam.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="subject"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Subject</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select Subject" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {availableSubjects.map((subject) => (
                            <SelectItem key={subject} value={subject}>
                              {subject}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>
                      Select the subject of the exam.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" disabled={mutation.isLoading}>
                {mutation.isLoading && (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                )}
                Create Exam
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <DataTable columns={columns} data={exams.exams || []} />
    </div>
  );
};

export default ExamPage;
