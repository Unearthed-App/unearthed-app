"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, Download, Info } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { getLatestLocalVersion } from "@/server/actions";

type LatestVersion = {
  version: number;
  productName: string;
  productLinkWindows?: string | null;
  productLinkMacIntel?: string | null;
  productLinkMacSilicon?: string | null;
  productLinkLinux?: string | null;
};

export default function FreeNoMorePage() {
  const [latestVersion, setLatestVersion] = useState<LatestVersion | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLatestVersion = async () => {
      try {
        const result = await getLatestLocalVersion();
        if (result.success && result.data) {
          setLatestVersion(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch latest version:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchLatestVersion();
  }, []);
  return (
    <div className="min-h-screen p-6 pt-32">
      <div className="max-w-4xl mx-auto">
        <Card className="shadow-xl border-2 border-black dark:border-white bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm">
          <CardHeader className="text-center pb-4 border-b-2 border-black dark:border-white">
            <CardTitle className="text-4xl font-bold text-gray-800 dark:text-white mb-4">
              Changes to Unearthed
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-8 px-8 pb-8 pt-8">
            {/* Greeting Section */}
            <div className="text-center ">
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                Hey! I&apos;m happy to announce that a lot of people are using
                Unearthed, thank you ☺️
              </p>
            </div>

            {/* Problem Statement */}
            <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-400 dark:border-amber-500 p-6 rounded-lg">
              <div className="flex items-start">
                <AlertCircle className="h-6 w-6 text-amber-600 dark:text-amber-400 mt-1 mr-3 flex-shrink-0" />
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed">
                  That&apos;s great, but the problem is the vast majority are
                  doing so for free. Which means I need to change something so
                  that my personal costs don&apos;t continue to grow for the
                  rest of my life 😅
                </p>
              </div>
            </div>

            {/* Solution */}
            <div className="text-center">
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed mb-6">
                The solution I&apos;ve come up with is to offer something that
                runs <span className="italic">locally</span> on your computer,
                which means there&apos;s no hosting costs involved for me, and
                that means there will be no monthly costs for you.
              </p>
            </div>

            {/* Good News Section */}
            <Card className="bg-green-50 dark:bg-green-900/30 border-2 border-green-600 dark:border-green-400">
              <CardHeader className="border-b-2 border-green-600 dark:border-green-400">
                <CardTitle className="text-2xl text-green-800 dark:text-green-300 flex items-center">
                  <span className="mr-2">🎉</span>
                  Good News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed pt-4">
                  You get a free app (Unearthed Local) forever, no subscription
                  required. The one condition is that you download it before the
                  1st of October. If you try to get it after that it will ask
                  you for a one time payment, which will also let you keep it
                  forever after that.
                </p>
                <p className="text-green-500 font-bold mb-4">
                  Unearthed Local does not require a Browser extension or
                  Obsidian Plugin. It is also completely private and does not
                  see your Amazon credentials either.
                </p>
                <div className="space-y-3">
                  <Link href="/local" target="_blank">
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 mb-3 border-2 border-black dark:border-white">
                      <Info className="mr-2 h-5 w-5" />
                      Read about it
                    </Button>
                  </Link>

                  <div className="border-t border-green-600 dark:border-green-400 pt-3">
                    <h4 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-2 flex items-center">
                      <Download className="mr-2 h-5 w-5" />
                      Download it
                    </h4>
                    {loading ? (
                      <Button
                        disabled
                        className="w-full bg-gray-400 text-white font-medium py-2 border-2 border-black dark:border-white text-sm"
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Loading downloads...
                      </Button>
                    ) : (
                      <div className="flex flex-wrap gap-2">
                        {latestVersion?.productLinkWindows && (
                          <Link
                            href={latestVersion.productLinkWindows}
                            target="_blank"
                            className="flex-1 min-w-[120px]"
                          >
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 border-2 border-black dark:border-white text-sm">
                              <Download className="mr-1 h-4 w-4" />
                              Windows
                            </Button>
                          </Link>
                        )}
                        {latestVersion?.productLinkMacIntel && (
                          <Link
                            href={latestVersion.productLinkMacIntel}
                            target="_blank"
                            className="flex-1 min-w-[120px]"
                          >
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 border-2 border-black dark:border-white text-sm">
                              <Download className="mr-1 h-4 w-4" />
                              macOS (Intel)
                            </Button>
                          </Link>
                        )}
                        {latestVersion?.productLinkMacSilicon && (
                          <Link
                            href={latestVersion.productLinkMacSilicon}
                            target="_blank"
                            className="flex-1 min-w-[120px]"
                          >
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 border-2 border-black dark:border-white text-sm">
                              <Download className="mr-1 h-4 w-4" />
                              macOS (Silicon)
                            </Button>
                          </Link>
                        )}
                        {latestVersion?.productLinkLinux && (
                          <Link
                            href={latestVersion.productLinkLinux}
                            target="_blank"
                            className="flex-1 min-w-[120px]"
                          >
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 border-2 border-black dark:border-white text-sm">
                              <Download className="mr-1 h-4 w-4" />
                              Linux
                            </Button>
                          </Link>
                        )}
                        {!latestVersion && (
                          <Link
                            href="/local-download"
                            target="_blank"
                            className="w-full"
                          >
                            <Button className="w-full bg-green-600 hover:bg-green-700 text-white font-medium py-2 border-2 border-black dark:border-white text-sm">
                              <Download className="mr-1 h-4 w-4" />
                              Download (Enter Purchase ID)
                            </Button>
                          </Link>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-red-50 dark:bg-red-900/30 border-2 border-red-600 dark:border-red-400">
              <CardHeader className="border-b-2 border-red-600 dark:border-red-400">
                <CardTitle className="text-2xl text-red-800 dark:text-red-300 flex items-center">
                  <span className="mr-2">😔</span>
                  Bad News
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 dark:text-gray-200 leading-relaxed pt-4">
                  I&apos;ve decided to simplify Unearthed.app (Unearthed Online)
                  and just offer the one tier which will be not be free anymore,
                  sorry!
                </p>
                <p className="text-red-500 font-bold">
                  After the 1st of October you will lose access to your data, so
                  please take action before then. Even if it just syncing it to
                  your Obsidian Vault and removing the Unearthed connection.
                </p>
              </CardContent>
            </Card>

            {/* <div className="text-center bg-blue-50 dark:bg-blue-900/30 p-6 rounded-lg border-2 border-blue-600 dark:border-blue-400">
              <p className="text-gray-700 dark:text-gray-200 mb-4">
                I made a video explaining this too
              </p>
              <Link href="https://www.youtube.com/@CheersCal" target="_blank">
                <Button
                  variant="outline"
                  className="border-2 border-blue-600 dark:border-blue-400 text-blue-700 dark:text-blue-300 hover:bg-blue-100 dark:hover:bg-blue-900/50"
                >
                  Watch Video
                </Button>
              </Link>
            </div> */}

            {/* Closing Message */}
            <div className="text-center space-y-4">
              <p className="text-lg text-gray-700 dark:text-gray-200 leading-relaxed">
                I didn&apos;t want to just kick people out without giving them
                an alternative.
              </p>
              <p className="text-lg font-medium text-gray-800 dark:text-white">
                I hope that you agree on the solution that I&apos;ve come up
                with 🙂
              </p>
              <p className="text-gray-600 dark:text-gray-400 italic">
                Thanks for listening.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
