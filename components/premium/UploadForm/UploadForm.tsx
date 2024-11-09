"use client";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { schema } from "./formSchema";
import { onSubmitAction } from "./formSubmit";
import { UploadCloud, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface UploadFormProps {
  onUpload: () => void;
}

export function UploadForm({ onUpload }: UploadFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      file: undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", data.file);
      formData.append("type", data.type);

      const result = await onSubmitAction(formData);
      if (result.success) {
        toast({
          title: "Added successfully",
          description: result.message,
        });
        form.reset();
        onUpload();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.log("Failed to add:", error);
      toast({
        title: "Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive",
      });
    }
    setIsLoading(false);
  };

  return (
    <div className="bg-card rounded-lg border-2 p-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem className="space-y-3">
                <FormLabel>Which file type are you uploading?</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="flex flex-col space-y-1"
                  >
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="csv" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        CSV
                      </FormLabel>
                    </FormItem>
                    <FormItem className="flex items-center space-x-3 space-y-0">
                      <FormControl>
                        <RadioGroupItem value="kindle" />
                      </FormControl>
                      <FormLabel className="font-normal">
                        Kindle Clippings (.txt)
                      </FormLabel>
                    </FormItem>
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="file"
            render={({ field: { value, onChange, ...field } }) => (
              <FormItem>
                <FormControl>
                  <div
                    className={cn(
                      "relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 p-6 transition-colors",
                      dragActive && "border-primary bg-secondary/20",
                      value && "border-success bg-success/20"
                    )}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setDragActive(true);
                    }}
                    onDragLeave={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                    }}
                    onDrop={(e) => {
                      e.preventDefault();
                      setDragActive(false);
                      const file = e.dataTransfer.files[0];
                      if (file) onChange(file);
                    }}
                  >
                    <input
                      type="file"
                      accept="text/plain,.txt,.text,text/csv,.csv,application/csv"
                      className="absolute h-full w-full cursor-pointer opacity-0"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) onChange(file);
                      }}
                      {...field}
                    />

                    {!value ? (
                      <div className="flex flex-col items-center gap-2 text-muted-foreground">
                        <UploadCloud className="h-8 w-8" />
                        <div className="text-center">
                          <p>Drag & drop your file here or click to browse</p>
                          <p className="text-xs">Supported formats: TXT, CSV</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <span className="text-sm">{value.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="h-auto p-0"
                          onClick={(e) => {
                            e.stopPropagation();
                            onChange(undefined);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button disabled={isLoading} variant="brutalprimary" type="submit">
            Upload
          </Button>
        </form>
      </Form>
    </div>
  );
}