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
  createEmptyProfile,
  deleteUnearthedKey,
  generateAndSaveUnearthedKey,
} from "@/server/actions";
import { Copy, Eye, EyeOff, Megaphone, Trash } from "lucide-react";

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
import { selectUnearthedKeySchema } from "@/db/schema";
import { AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ConfirmationDialog from "@/components/ConfirmationDialog"; // Import the ConfirmationDialog we created
import { ObsidianInstructionsDialog } from "@/components/ObsidianInstructionsDialog";
import { Checkbox } from "@/components/ui/checkbox";
import { VideoDialog } from "@/components/VideoDialog";
import {
  disconnectNotion,
  syncToNotion,
  getSettings,
} from "@/server/actions-premium";
import { HeadingBlur } from "@/components/HeadingBlur";
import { Progress } from "@/components/ui/progress";

type CapacitiesSpaceItem = {
  id: string;
  value: string;
  label: string;
};

type UnearhtedKey = z.infer<typeof selectUnearthedKeySchema>;

export function ProfileForm() {
  const [isDialogNotionOpen, setIsDialogNotionOpen] = useState(false);
  const [isDialogNotionRemoveOpen, setIsDialogNotionRemoveOpen] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isForcingNotionSync, setIsForcingNotionSync] = useState(false);
  const [showingSecrets, setShowingSecrets] = useState(false);
  const [newUnearthedApiKey, setNewUnearthedApiKey] = useState("");
  const [newKeyName, setNewKeyName] = useState("");
  const [unearthedKeys, setUnearthedKeys] = useState<UnearhtedKey[]>([]);
  const [notionWorkspace, setNotionWorkspace] = useState("");
  const [displayCapacitiesSpaces, setDisplayCapacitiesSpaces] = useState<
    CapacitiesSpaceItem[]
  >([]);
  const [loadingDefaultValues, setLoadingDefaultValues] = useState(true);
  let isFetched = false;
  const [profileExists, setProfileExists] = useState(false);
  const [aiPercentageUsed, setAiPercentageUsed] = useState(0);
  const [aiDaysLeft, setAiDaysLeft] = useState(0);

  const [dialogState, setDialogState] = useState(
    Object.fromEntries(unearthedKeys.map((key) => [key.id, false]))
  );

  const toggleDialog = (keyId: string, isOpen: boolean) => {
    setDialogState((prevState) => ({
      ...prevState,
      [keyId]: isOpen,
    }));
  };

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      dailyEmails: false,
      capacitiesSpaceId: "",
      capacitiesApiKey: "",
      supernotesApiKey: "",
      aiApiKey: "",
      aiApiUrl: "",
      aiApiModel: "",
    },
  });

  async function fetchProfileData() {
    setIsLoading(true);
    try {
      const data = await getSettings();

      if (data) {
        setNotionWorkspace(data.notionWorkspace);

        let toSetCapacitiesSpace: CapacitiesSpaceItem[] = [];
        if (Array.isArray(data.capicitiesSpaces)) {
          toSetCapacitiesSpace = data.capicitiesSpaces.map(
            (space: { id: string; title: string }) => ({
              id: space.id,
              value: space.id,
              label: space.title,
            })
          );
        }
        setDisplayCapacitiesSpaces(toSetCapacitiesSpace);
        setUnearthedKeys(data.unearthedKeys);

        if (data.profile.userId) {
          setProfileExists(true);
        }
        console.log(data);

        form.reset({
          dailyEmails: data.profile.dailyEmails || false,
          capacitiesSpaceId: data.profile.capacitiesSpaceId || "",
          capacitiesApiKey: data.profile.capacitiesApiKey || "",
          supernotesApiKey: data.profile.supernotesApiKey || "",
          aiApiKey: data.profile.aiApiKey || "",
          aiApiUrl: data.profile.aiApiUrl || "",
          aiApiModel: data.profile.aiApiModel || "",
        });

        const currentDate = new Date();
        const lastDayOfMonth = new Date(
          currentDate.getFullYear(),
          currentDate.getMonth() + 1,
          0
        );
        const numberOfDaysUntilExpire = Math.ceil(
          (lastDayOfMonth.getTime() - currentDate.getTime()) /
            (1000 * 60 * 60 * 24)
        );

        setAiDaysLeft(numberOfDaysUntilExpire);
        setAiPercentageUsed(data.aiPercentageUsed || 0);
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
  const generateNewKey = async (name: string) => {
    try {
      // make sure there is a profile first. A profile is needed in certain api routes
      if (!profileExists) {
        const utcOffset = await getUserUtcOffset();
        const { profile } = await createEmptyProfile({ utcOffset });

        if (profile && profile.userId) {
          setProfileExists(true);
        } else {
          toast({
            title: "Sorry",
            description: "Something went wrong. Please try again later",
            variant: "destructive",
          });
          return;
        }
      }

      const { newKey } = await generateAndSaveUnearthedKey({ name });
      toast({
        title: "New API key generated",
        description: "This will be your only chance to copy the key.",
      });
      setNewUnearthedApiKey(newKey as string);
      fetchProfileData();
    } catch (error) {
      console.error("Failed to generate new key:", error);
      toast({
        title: "Error",
        description: "Failed to generate new key. Please try again.",
        variant: "destructive",
      });
    }
  };

  const deleteUnearthedApiKey = async (id: string) => {
    try {
      await deleteUnearthedKey({ id });

      toast({
        title: "Unearthed API key deleted",
        description: "",
      });
      fetchProfileData();
    } catch (error) {
      console.error("Failed to delete key:", error);
      toast({
        title: "Error",
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
      const result = await syncToNotion();

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

  const startNewNotionConnection = () => {
    toast({
      title: "Notion Re-connection Started",
      description:
        "Follow the instructions on the Notion page to finish syncing.",
    });

    window.open(
      process.env.NEXT_PUBLIC_NOTION_AUTH_URL,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const removeNotionConnection = async () => {
    try {
      const result = await disconnectNotion();

      if (!result.success) {
        toast({
          title: "Error",
          description: "Failed to disconnect Notion. Please try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Success",
          description: "Notion disconnected.",
        });

        fetchProfileData();
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
  const copyUnearthedApiKey = () => {
    navigator.clipboard.writeText(newUnearthedApiKey as string);
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
    <div className="w-full sm:min-w-[600px]">
      <Form {...form}>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            form.handleSubmit(onSubmit)(e);
          }}
          className="w-full space-y-6"
        >
          <Tabs defaultValue="general" className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-3 lg:grid-cols-5">
              <TabsTrigger className="text-xs" value="general">
                General
              </TabsTrigger>
              <TabsTrigger className="text-xs" value="notion">
                Notion
              </TabsTrigger>
              <TabsTrigger className="text-xs" value="capacities">
                Capacities
              </TabsTrigger>
              <TabsTrigger className="text-xs" value="supernotes">
                Supernotes
              </TabsTrigger>{" "}
              <TabsTrigger className="text-xs" value="ai">
                AI
              </TabsTrigger>
            </TabsList>
            <TabsContent value="general">
              <Card>
                <CardHeader>
                  <CardDescription>
                    Don&apos;t forget to press{" "}
                    <span className="text-secondary">Save</span>
                  </CardDescription>
                  {/* <CardTitle className="flex">
                    <div className="w-full">API Keys</div>
                  </CardTitle> */}
                </CardHeader>
                <CardContent>
                  <FormField
                    control={form.control}
                    name="dailyEmails"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border-2 dark:border-none border-red-300/40 rounded-lg backdrop-blur-sm bg-white/30 text-alternate shadow-xl shadow-red-300/10 dark:shadow-lg dark:shadow-primary/10 ">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>Email Daily Reflection</FormLabel>
                          <FormDescription>
                            Receive an email every day containing your daily
                            reflection
                          </FormDescription>
                        </div>
                      </FormItem>
                    )}
                  />
                  <div className="mt-4">
                    <h3 className="w-full font-semibold">API Keys</h3>
                  </div>
                  <CardDescription>
                    Use these keys to integrate with other apps
                  </CardDescription>
                  {unearthedKeys.map((key) => (
                    <div
                      key={key.id}
                      className="mt-1 flex space-x-2 justify-between items-end"
                    >
                      <div className="w-full p-2 h-10 select-none border-2 bg-card rounded-lg text-sm">
                        <p className="font-bold">{key.name}</p>
                      </div>
                      <div>
                        <ConfirmationDialog
                          isOpen={dialogState[key.id] || false}
                          onOpenChange={(open) => toggleDialog(key.id, open)}
                          onConfirm={() => {
                            deleteUnearthedApiKey(key.id);
                          }}
                          title="Delete Key"
                          description={`Are you sure you want to delete this key? This action cannot be undone.`}
                          confirmText="Yes"
                          cancelText="Cancel"
                        >
                          <AlertDialogTrigger asChild>
                            <TooltipProvider>
                              <Tooltip>
                                <TooltipTrigger asChild>
                                  <Button
                                    type="button"
                                    variant="destructivebrutal"
                                    onClick={() => toggleDialog(key.id, true)}
                                  >
                                    <Trash />
                                  </Button>
                                </TooltipTrigger>
                                <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                                  <p>Delete the Key</p>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </AlertDialogTrigger>
                        </ConfirmationDialog>
                      </div>
                    </div>
                  ))}

                  <div className="mt-4 space-y-4">
                    <div className="flex space-x-2 justify-between items-end">
                      <div className="w-full">
                        <Input
                          className="border-secondary bg-white dark:bg-card"
                          type="text"
                          id="newKeyName"
                          placeholder="New Key Name"
                          value={newKeyName}
                          onChange={(e) => setNewKeyName(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <Button
                        className="w-full"
                        type="button"
                        onClick={() => {
                          generateNewKey(newKeyName);
                          setNewKeyName("");
                        }}
                        disabled={!newKeyName}
                      >
                        {!newKeyName
                          ? "Enter Key Name"
                          : "Generate New Unearthed Key"}
                      </Button>
                    </div>
                  </div>

                  {newUnearthedApiKey && (
                    <div className="w-full mt-2 text-sm">
                      <div className="mt-1 flex space-x-2 justify-between items-end ">
                        <Input
                          disabled
                          type="text"
                          value={newUnearthedApiKey}
                        />
                        <div className="">
                          <Button
                            type="button"
                            variant="brutal"
                            onClick={copyUnearthedApiKey}
                          >
                            <Copy />
                          </Button>
                        </div>
                      </div>
                      <p className="mt-1">
                        Make sure you save this key somehwere now. You will not
                        be able to edit it later.
                        <br />
                        Instead, you will need to generate a new one.
                      </p>
                    </div>
                  )}
                  <div className="w-full">
                    <div className="mt-2">
                      <ObsidianInstructionsDialog />
                    </div>
                    <div className="mt-2">
                      <VideoDialog
                        videoUrl="https://www.youtube.com/embed/uilUlt4wRVs?si=5AFVPu8_clj4AeTl"
                        videoTitle="Obsidian Instructions"
                        videoDescription="Instructions for syncing Kindle to Obsidian"
                        videoButtonText="Watch Obsidian Video"
                      />
                    </div>
                  </div>
                </CardContent>
                <CardFooter>
                  <div className="w-full flex justify-between">
                    <Button
                      className="w-24"
                      variant="brutalprimary"
                      type="submit"
                      disabled={isSaving}
                    >
                      {isSaving ? "Saving..." : "Save"}
                    </Button>
                  </div>
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

                        <div className="text-muted text-sm">
                          Unearthed will sync every 24 hours with Notion, but
                          you can also force a sync here.
                          <br />
                          Starting a new connection will replace the old
                          connection, so be careful.
                        </div>
                        <div className="flex justify-between mt-4">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  type="button"
                                  onClick={() => {
                                    setIsForcingNotionSync(true);
                                    forceNotionSync();
                                  }}
                                  disabled={isForcingNotionSync}
                                  className="w-full"
                                >
                                  {isForcingNotionSync
                                    ? "Sync Started"
                                    : "Force Sync"}
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                                <p>
                                  Start a sync to Notion. Nothing on Notion will
                                  be removed
                                </p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <ConfirmationDialog
                            isOpen={isDialogNotionRemoveOpen}
                            onOpenChange={(open) => {
                              setIsDialogNotionRemoveOpen(open);
                            }}
                            onConfirm={removeNotionConnection}
                            title="Are you sure?"
                            description={`The connection between Notion and Unearthed will be removed.`}
                            confirmText="Yes"
                            cancelText="Cancel"
                          >
                            <AlertDialogTrigger asChild>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="destructivebrutal"
                                      type="button"
                                      onClick={() =>
                                        setIsDialogNotionRemoveOpen(true)
                                      }
                                      disabled={isForcingNotionSync}
                                      className="w-full ml-2"
                                    >
                                      Remove Connection
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                                    <p>Disconnect Notion from Unearthed</p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </AlertDialogTrigger>
                          </ConfirmationDialog>
                        </div>
                        <div className="flex justify-between mt-4">
                          <ConfirmationDialog
                            isOpen={isDialogNotionOpen}
                            onOpenChange={(open) => {
                              setIsDialogNotionOpen(open);
                            }}
                            onConfirm={startNewNotionConnection}
                            title="Are you sure?"
                            description={`A new Notion page and database will be created. Unearthed will sync to that from now on. There old page will not be deleted.`}
                            confirmText="Yes"
                            cancelText="Cancel"
                          >
                            <AlertDialogTrigger asChild>
                              <TooltipProvider>
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button
                                      variant="brutalprimary"
                                      type="button"
                                      onClick={() =>
                                        setIsDialogNotionOpen(true)
                                      }
                                      disabled={isForcingNotionSync}
                                      className="w-full"
                                    >
                                      Replace Connection
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent className="text-white bg-black dark:text-black dark:bg-white">
                                    <p>
                                      Create a new page and database in Notion
                                    </p>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </AlertDialogTrigger>
                          </ConfirmationDialog>
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
                  <CardDescription>
                    Don&apos;t forget to press{" "}
                    <span className="text-secondary">Save</span>
                  </CardDescription>
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
                  <div className="mt-2">
                    <VideoDialog
                      videoUrl="https://www.youtube.com/embed/0gm0d3-EC7A?si=7V9Hr9hmV8q8RiYh"
                      videoTitle="Capacities Instructions"
                      videoDescription="Instructions for getting your Daily Reflection into Capacities"
                      videoButtonText="Watch Capacities Video"
                    />
                  </div>

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
            </TabsContent>{" "}
            <TabsContent value="supernotes">
              <Card>
                <CardHeader>
                  <CardTitle className="flex">
                    <div className="w-full">Supernotes</div>
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
                  <CardDescription>
                    Don&apos;t forget to press{" "}
                    <span className="text-secondary">Save</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <div className="flex flex-wrap justify-center">
                    <Megaphone className="w-16 h-16 text-alternate" />
                    <div className="w-full flex justify-center">
                      <div className="my-4 w-full flex justify-center max-w-[500px]">
                        <HeadingBlur content="Be aware that you may have quoatas on your Supernotes account. So if you are no longer seeing your Daily Reflection, please check that you have not reached your quota." />
                      </div>
                    </div>
                  </div>
                  <FormField
                    control={form.control}
                    name="supernotesApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supernotes API Key</FormLabel>
                        <FormControl>
                          <Input
                            type={showingSecrets ? "text" : "password"}
                            placeholder="Supernotes API Key"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Generate an API token in Supernotes and paste it here
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="mt-2">
                    <VideoDialog
                      videoUrl="https://www.youtube.com/embed/0gm0d3-EC7A?si=7V9Hr9hmV8q8RiYh"
                      videoTitle="Supernotes Instructions"
                      videoDescription="Instructions for getting your Daily Reflection into Supernotes"
                      videoButtonText="Watch Supernotes Video"
                    />
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
            <TabsContent value="ai">
              <Card>
                <CardHeader>
                  <CardTitle className="flex">
                    <div className="w-full">
                      AI
                      <span className="text-sm ml-2">
                        (using Google Gemini 2.0)
                      </span>
                    </div>
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
                  <CardDescription>
                    Use Unearthed&apos;s built in AI or hook up your preferred
                    AI provider here
                    <br />
                    Don&apos;t forget to press{" "}
                    <span className="text-secondary">Save</span>
                  </CardDescription>
                </CardHeader>
                <CardContent className="">
                  <div className="w-full mb-4">
                    <Progress value={aiPercentageUsed} />
                    <div className="text-center mt-2 text-sm font-bold">
                      {aiPercentageUsed}% used{" "}
                      <span className="text-secondary">
                        ({aiDaysLeft} days left)
                      </span>
                    </div>
                  </div>
                  <div className="flex justify-center">
                    <div className="my-4 w-full flex justify-center max-w-[500px]">
                      <HeadingBlur content="Your account comes with AI built in, but there is a limit. Your usage gets reset back to 0 every month. Or feel free to use your own OpenAI compatible provider." />
                    </div>
                  </div>

                  {/* <div className="mb-4 w-full flex justify-center">
                    <VideoDialog
                      videoUrl="https://www.youtube.com/embed/9bTCubJIjEU?si=H5PFO3n3OwafBx5T"
                      videoTitle="AI Chat"
                      videoDescription="Demo and setup guide for AI Chat"
                      videoButtonText="AI Setup Video Instructions"
                    />
                  </div> */}
                  <h3 className="font-bold text-secondary px-0 md:px-24 text-center">
                    Leave all fields below here empty if you would like to use
                    Unearthed&apos;s built in AI
                  </h3>
                  <FormField
                    control={form.control}
                    name="aiApiKey"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI API Key</FormLabel>
                        <FormControl>
                          <Input
                            type={showingSecrets ? "text" : "password"}
                            placeholder="AI API Key"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Generate an API token with your AI provider and paste
                          it
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aiApiUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI URL</FormLabel>
                        <FormControl>
                          <Input type="text" placeholder="AI URL" {...field} />
                        </FormControl>
                        <FormDescription>
                          Find the URL for your AI provider and paste it here
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="aiApiModel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>AI Model</FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="AI Model"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          Your AI provider will offer certain models. Choose the
                          model that works best for you
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
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
