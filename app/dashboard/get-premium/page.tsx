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

import { Checkout } from "@/components/Checkout";
import { FeaturePremiumCard } from "@/components/FeaturePremiumCard";
import { HeadingBlur } from "@/components/HeadingBlur";
import { Megaphone } from "lucide-react";

export default async function GetPremium() {
  return (
    <div className="w-full pt-32 p-4 flex flex-wrap justify-center">
      <Megaphone className="w-16 h-16 text-alternate" />
      <div className="my-4 w-full flex justify-center px-2 md:px-24 lg:px-64">
        <HeadingBlur content="AI features: If you are wanting to take advantage of these, be aware that you will need to connect your own AI model with Unearthed via Settings." />
      </div>

      <div className="w-full">
        <FeaturePremiumCard />
      </div>
      <div className="w-full flex justify-center mt-12">
        <Checkout />
      </div>
    </div>
  );
}
