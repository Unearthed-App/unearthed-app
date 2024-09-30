"use client";
import { useState, useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { generateNewUnearthedApiKey, getSettings } from "@/server/actions";
import { Copy } from "lucide-react";

import { schema } from "./formSchema";
import { onSubmitAction } from "./formSubmit";
import { getUserUtcOffset } from "@/lib/utils";

type CapacitiesSpaceItem = {
  id: string;
  value: string;
  label: string;
};

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [displayCapacitiesSpaces, setDisplayCapacitiesSpaces] = useState<
    CapacitiesSpaceItem[]
  >([]);
  const [loadingDefaultValues, setLoadingDefaultValues] = useState(true);
  let isFetched = false;

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      capacitiesSpaceId: "",
      capacitiesApiKey: "",
      unearthedApiKey: "",
    },
  });

  async function fetchProfileData() {
    console.log("fetchProfileData");
    setIsLoading(true);
    try {
      const data = await getSettings();

      if (data) {
        if (!Array.isArray(data.capicitiesSpaces)) {
          return [];
        }
        const toSetCapacitiesSpace = data.capicitiesSpaces.map(
          (space: { id: string; title: string }) => ({
            id: space.id,
            value: space.id,
            label: space.title,
          })
        );

        setDisplayCapacitiesSpaces(toSetCapacitiesSpace);

        form.reset({
          capacitiesSpaceId: data.profile.capacitiesSpaceId || "",
          capacitiesApiKey: data.profile.capacitiesApiKey || "",
          unearthedApiKey: data.profile.unearthedApiKey || "",
        });
      }
    } catch (error) {
      console.error("Error fetching:", error);
    } finally {
      setLoadingDefaultValues(false);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!isFetched) {
      fetchProfileData();
      isFetched = true;
    }
  }, []);

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setIsSaving(true);
    try {
      const utcOffset = await getUserUtcOffset();
      console.log("utcOffset", utcOffset);
      const onSubmitActionResults = await onSubmitAction(data, utcOffset);

      if (onSubmitActionResults.success) {
        toast({
          title: "Settings updated successfully",
          description: onSubmitActionResults.message,
        });
      } else {
        toast({
          title: "There was an error",
          description: onSubmitActionResults.message,
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Failed to update settings:", error);
      toast({
        title: "Error",
        description: "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);

      if (form.getValues("capacitiesSpaceId")) {
        fetchProfileData();
      }
    }
  };
  const generateNewKey = async () => {
    try {
      const newKey = await generateNewUnearthedApiKey();
      form.setValue("unearthedApiKey", newKey as string);
      toast({
        title: "New API key generated",
        description: "You will need to press Save to apply the changes",
      });
    } catch (error) {
      console.error("Failed to generate new key:", error);
      toast({
        title: "Error",
        description: "Failed to generate new key. Please try again.",
        variant: "destructive",
      });
    }
  };

  const copyUnearthedApiKey = () => {
    navigator.clipboard.writeText(form.getValues("unearthedApiKey") as string);
    toast({
      title: "Unearthed API key copied to clipboard",
    });
  };

  if (loadingDefaultValues || isLoading) {
    return (
      <div className="flex flex-col space-y-3">
        <Skeleton className="bg-card h-[28px] w-full rounded-lg" />
        <div className="space-y-2">
          <Skeleton className="bg-card h-4 w-[250px]" />
          <Skeleton className="bg-card h-4 w-[200px]" />
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }}
          className="w-full space-y-6"
        >
          <div className="flex space-x-2 justify-between items-end">
            <div className="w-full flex-1">
              <FormField
                control={form.control}
                name="unearthedApiKey"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Unearthed API Key</FormLabel>
                    <FormControl>
                      <Input
                        disabled
                        placeholder="Unearthed API Key"
                        {...field}
                      />
                    </FormControl>{" "}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="">
              <Button type="button" onClick={copyUnearthedApiKey}>
                <Copy />
              </Button>
            </div>
          </div>
          <div className="w-full">
            <Button className="w-full" type="button" onClick={generateNewKey}>
              Generate New Unearthed Key
            </Button>
          </div>
          <FormField
            control={form.control}
            name="capacitiesApiKey"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Capacities API Key</FormLabel>
                <FormControl>
                  <Input placeholder="Capacities API Key" {...field} />
                </FormControl>
                <FormDescription>
                  Generate an API token in Capacities and paste it here
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          {displayCapacitiesSpaces.length > 0 && (
            <FormField
              control={form.control}
              name="capacitiesSpaceId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Capacities Space</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || ""}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a Capacities Space to link to" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {displayCapacitiesSpaces.map((space) => (
                        <SelectItem key={space.id} value={space.id}>
                          {space.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    This will be the Capacities space that we link to.
                    <br />
                    It is at the top-left in the Capacities App
                  </FormDescription>

                  <FormMessage />
                </FormItem>
              )}
            />
          )}
          <div className="w-full flex justify-end">
            <Button
              className="w-24"
              variant="brutalprimary"
              type="submit"
              disabled={isSaving}
            >
              {isSaving ? "Saving..." : "Save"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
