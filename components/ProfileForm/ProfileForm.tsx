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
import {
  generateNewUnearthedApiKey,
  getSettings,
  syncToNotion,
} from "@/server/actions";
import { Copy, Eye, EyeOff } from "lucide-react";

import { schema } from "./formSchema";
import { onSubmitAction } from "./formSubmit";
import { getUserUtcOffset } from "@/lib/utils";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
type CapacitiesSpaceItem = {
  id: string;
  value: string;
  label: string;
};

export function ProfileForm() {
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isForcingNotionSync, setIsForcingNotionSync] = useState(false);
  const [showingSecrets, setShowingSecrets] = useState(false);

  const [notionWorkspace, setNotionWorkspace] = useState("");
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
      console.log("data", data);

      if (data) {
        setNotionWorkspace(data.notionWorkspace);
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

      if (form.getValues("capacitiesApiKey")) {
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

  const forceNotionSync = async () => {
    try {
      toast({
        title: "Notion Sync Started",
        description:
          "This will happen in the background, please wait and then check Notion.",
      });
      const result = await syncToNotion({ newConnection: false });

      if (!result.success) {
        toast({
          title: "Error",
          description:
            "Failed to connect to Notion. Please check that Notion still has access granted.",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Failed to connect to Notion. Please check that Notion still has access granted.",
        variant: "destructive",
      });
    }
  };

  const toggleSecrets = () => {
    setShowingSecrets(!showingSecrets);
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
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="notion">Notion</TabsTrigger>
              <TabsTrigger value="capacities">Capacities</TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardTitle className="flex">
                    <div className="w-full">General</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="-mt-3"
                            type="button"
                            onClick={toggleSecrets}
                          >
                            {showingSecrets ? <EyeOff /> : <Eye />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                          <p>
                            {showingSecrets
                              ? "Hide all secrets"
                              : "Show all secrets"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>{" "}
                </CardHeader>
                <CardContent className="">
                  <div className="flex space-x-2 justify-between items-end">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="unearthedApiKey"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Unearthed API Key</FormLabel>
                            <FormControl>
                              <Input
                                type={showingSecrets ? "text" : "password"}
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
                  <div className="w-full mt-2 mb-6">
                    <Button
                      className="w-full"
                      type="button"
                      onClick={generateNewKey}
                    >
                      Generate New Unearthed Key
                    </Button>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-end">
                    <Button
                      className="w-24"
                      variant="brutalprimary"
                      type="submit"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>{" "}
                </CardFooter>
              </Card>
            </TabsContent>
            <TabsContent value="notion">
              <Card>
                <CardHeader>
                  <CardTitle>Notion</CardTitle>
                </CardHeader>
                <CardContent className="">
                  <div className="">
                    {notionWorkspace ? (
                      <>
                        <div className="font-semibold">
                          Syncing to:{" "}
                          <span className="text-secondary">
                            {notionWorkspace}
                          </span>
                        </div>

                        <div className="text-muted">
                          Unearthed will sync every 24 hours with Notion, but
                          you can also force a sync here.
                          <br />
                          Starting a new connection will replace the old
                          connection, so be careful.
                        </div>
                        <div className="flex justify-between mt-4">
                          <Button
                            type="button"
                            onClick={() => {
                              setIsForcingNotionSync(true);
                              forceNotionSync();
                            }}
                            disabled={isForcingNotionSync}
                          >
                            {isForcingNotionSync
                              ? "Sync Started"
                              : "Force Sync"}
                          </Button>{" "}
                          <Link
                            target="_blank"
                            rel="noopener noreferrer"
                            href={process.env.NEXT_PUBLIC_NOTION_AUTH_URL || ""}
                          >
                            <Button
                              variant="destructivebrutal"
                              type="button"
                              onClick={() => {
                                toast({
                                  title: "Notion Re-connection Started",
                                  description:
                                    "Follow the instructions on the Notion page to finish syncing.",
                                });
                              }}
                            >
                              Start New Connection
                            </Button>
                          </Link>
                        </div>
                      </>
                    ) : (
                      <Link
                        className="mt-4"
                        target="_blank"
                        rel="noopener noreferrer"
                        href={process.env.NEXT_PUBLIC_NOTION_AUTH_URL || ""}
                      >
                        <Button type="button">Connect with Notion</Button>
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="capacities">
              <Card>
                <CardHeader>
                  <CardTitle className="flex">
                    <div className="w-full">Capacities</div>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Button
                            className="-mt-3"
                            type="button"
                            onClick={toggleSecrets}
                          >
                            {showingSecrets ? <EyeOff /> : <Eye />}
                          </Button>
                        </TooltipTrigger>
                        <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                          <p>
                            {showingSecrets
                              ? "Hide all secrets"
                              : "Show all secrets"}
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </CardTitle>
                </CardHeader>
                <CardContent className="">
                  <FormField
                    control={form.control}
                    name="capacitiesApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capacities API Key</FormLabel>
                        <FormControl>
                          <Input
                            type={showingSecrets ? "text" : "password"}
                            placeholder="Capacities API Key"
                            {...field}
                          />
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
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-end">
                    <Button
                      className="w-24"
                      variant="brutalprimary"
                      type="submit"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>{" "}
                </CardFooter>
              </Card>
            </TabsContent>
          </Tabs>
        </form>
      </Form>
    </div>
  );
}
