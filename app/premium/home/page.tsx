/**
 * Copyright (C) 2024 Unearthed App
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


import { DailyQuoteCard } from "@/components/premium/DailyQuoteCard";
import { OnboardingCard } from "@/components/OnboardingCard";
import { getBookTitles } from "@/server/actions";
import { HeadingBlur } from "@/components/HeadingBlur";

export default async function Home() {
  const books = await getBookTitles();

  return (
    <div className="pt-32 p-4">
      {books.length == 0 ? (
        <div className="w-full flex flex-wrap justify-center items-center">
          <OnboardingCard />
        </div>
      ) : (
        <div>
          <div className="flex items-center justify-center">
            <DailyQuoteCard />
          </div>
          <div className="mt-8 w-full flex justify-center">
            <div className="">
              <HeadingBlur
                content="Remember, you can also view your Daily Reflection in the web extension."
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
