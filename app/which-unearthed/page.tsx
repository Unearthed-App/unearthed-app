import type { Metadata } from "next";
import { WhichUnearthedPage } from "@/components/WhichUnearthedPage";

export const metadata: Metadata = {
  title: "Which Unearthed Is Right for You?",
  description:
    "Compare Unearthed Local, Online, and Mobile to find the best setup for how you read, save highlights, and manage your knowledge.",
  alternates: {
    canonical: "https://unearthed.app/which-unearthed",
  },
};

export default function WhichUnearthed() {
  return <WhichUnearthedPage />;
}
