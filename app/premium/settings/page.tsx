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

import { ProfileForm } from "@/components/premium/ProfileForm/ProfileForm";
import packageJson from "@/package.json";


export default async function Home() {

  return (
    <div className="pt-32 p-4">
      <div>
        <div className="w-full flex justify-center">
          <div className="">
            <ProfileForm />
            <h4 className="mt-2 text-muted">Version: {packageJson.version}</h4>
          </div>
        </div>
      </div>
    </div>
  );
}
