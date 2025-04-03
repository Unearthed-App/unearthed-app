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

export const HeadingBlur = ({ content }: { content: string }) => {
  return (
    <div className="text-center p-4 rounded-lg backdrop-blur-sm bg-white/30 text-alternate shadow-xl shadow-red-300/10 dark:shadow-lg dark:shadow-primary/10">
      <h3 className="font-bold text-xs">{content}</h3>
    </div>
  );
};
