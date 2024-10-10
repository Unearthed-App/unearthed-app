import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { LogIn } from "lucide-react";
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export const HomeHeader = () => {
  return (
    <>
      <div className="w-full">
        <div
          className="text-center"
        >
          <div className="flex items-center justify-center">
            <div className="relative">
              <Badge
                className="hidden md:flex absolute top-2 left-24"
                variant="brutalinvert"
              >
                ALPHA
              </Badge>
              <h1
                className={
                  crimsonPro.className +
                  " font-extrabold text-6xl md:text-9xl bg-clip-text text-transparent bg-gradient-to-t from-[hsl(337,65%,3%)] to-[hsl(337,65%,20%)] dark:from-primary dark:to-[hsl(337,55%,35%)]"
                }
              >
                Unearthed
              </h1>
            </div>
          </div>
          <h3 className="text bold font-bold text-secondary mb-12">
            Lost wisdom, found again
          </h3>
        </div>
      </div>
      <div
        className="md:mb-12"
      >
        <Link href="/dashboard/home">
          <Button
            variant="brutalprimary"
            className="flex space-x-2 px-12 py-6"
          >
            Sign In / Up
            <LogIn className="ml-2" />
          </Button>
        </Link>
      </div>
    </>
  );
};
