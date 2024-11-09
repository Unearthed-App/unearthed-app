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


import { SignUp } from "@clerk/nextjs";
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export default function SignUpPage() {
  return (
    <section className="py-24">
      <div className="container flex items-center justify-center">
        <SignUp
          appearance={{
            elements: {
              card: "bg-card rounded-lg text-foreground",
              header: "text-foreground",
              headerTitle: `${crimsonPro.className} font-extrabold text-3xl text-foreground`,
              headerSubtitle: "text-foreground",
              dividerRow: "text-foreground",
              dividerText: "text-foreground",
              formFieldLabel: "text-foreground",
              socialButtonsBlockButtonText: "text-foreground",
              footer: "bg-card rounded-lg text-foreground",
              footerActionText: "text-foreground",
              formButtonPrimary: "bg-white text-black hover:bg-secondary ",
            },
          }}
        />
      </div>
    </section>
  );
}
