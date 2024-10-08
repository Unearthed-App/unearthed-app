import { DailyQuoteCard } from "@/components/DailyQuoteCard";
import { OnboardingCard } from "@/components/OnboardingCard";
import { getBookTitles } from "@/server/actions";

export default async function Home() {
  const books = await getBookTitles();

  return (
    <div className="pt-32 p-4">
      {books.length == 0 && (
        <div className="w-full flex flex-wrap justify-center items-center">
          <OnboardingCard />
        </div>
      )}
      <div className="flex items-center justify-center">
        <DailyQuoteCard />
      </div>
      <div className="mt-8">
        <p className="text-muted text-center">
          Remember, you can also view your Daily Reflection in the web
          extension.
        </p>
      </div>
    </div>
  );
}
