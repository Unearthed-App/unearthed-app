/**
 * Copyright (C) 2025 Unearthed App
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program. If not, see <https://www.gnu.org/licenses/>.
 */

"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
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
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { schema } from "./formSchema";
import { onSubmitAction } from "./formSubmit";
import { selectSourceSchema } from "@/db/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useMutation } from "@tanstack/react-query";
import { getSourceTitles } from "@/server/actions-premium";
import { SourceFormDialog } from "../SourceForm/SourceFormDialog";

type Source = z.infer<typeof selectSourceSchema>;

interface AddQuoteFormProps {
  onQuoteAdded: () => void;
  source?: Source;
}

export function QuoteForm({ onQuoteAdded, source }: AddQuoteFormProps) {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      content: "",
      note: "",
      color: "",
      location: "",
      sourceId: source?.id,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      // Ensure newlines are preserved in the data
      const processedData = {
        ...data,
        content: data.content.replace(/\r\n/g, "\n"), // Normalize newlines
        note: data.note!.replace(/\r\n/g, "\n"), // Normalize newlines
      };

      const result = await onSubmitAction(processedData);

      if (result.success) {
        toast({
          title: "Added successfully",
          description: result.message,
        });
        form.reset();
        onQuoteAdded();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to add:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  const {
    data: sourceTitles,
    mutate: server_getSourceTitles,
    isPending: isPendingSourceTitles,
  } = useMutation({
    mutationFn: getSourceTitles,
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const transformSourceTitles = (sources: Source[]) => {
    return sources.map((source) => ({
      id: source.id,
      value: source.id,
      label: source.title,
      ignored: source.ignored,
      origin: source.origin,
    }));
  };

  const displaySourceTitles = sourceTitles
    ? transformSourceTitles(sourceTitles)
    : [];

  useEffect(() => {
    server_getSourceTitles();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="bg-card rounded-lg border-2 p-4">
      {!source?.id && (
        <div className="w-full flex justify-center mb-4">
          <SourceFormDialog
            buttonText="Add a Source First"
            onSourceAdded={server_getSourceTitles}
          />
        </div>
      )}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          {!source?.id && (
            <FormField
              control={form.control}
              name="sourceId"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Source</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Source" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {displaySourceTitles.map((source) => (
                        <SelectItem value={source.id} key={source.label}>
                          {source.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    A source can be a book, for example
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <FormField
            control={form.control}
            name="content"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quote/Highlight</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="The content of the quote"
                    className="min-h-[100px] whitespace-pre-wrap"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="note"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Note</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Note (optional)"
                    className="min-h-[100px] whitespace-pre-wrap"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="color"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Color</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a color" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="grey">Grey</SelectItem>
                    <SelectItem value="yellow">Yellow</SelectItem>
                    <SelectItem value="blue">Blue</SelectItem>
                    <SelectItem value="pink">Pink</SelectItem>
                    <SelectItem value="orange">Orange</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Location</FormLabel>
                <FormControl>
                  <Input placeholder="Enter location" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="w-full flex justify-center">
            <Button disabled={isLoading} variant="brutalprimary" type="submit">
              Submit Quote
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
