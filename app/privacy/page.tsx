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

import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-32 max-w-4xl">
      <h1
        className={`${crimsonPro.className} text-4xl font-bold mb-8 text-center`}
      >
        Privacy Policy
      </h1>

      <div className="prose prose-lg dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">1. Introduction</h2>
          <p>
            Welcome to Unearthed. We respect your privacy and are committed to
            protecting your personal data. This privacy policy will inform you
            about how we look after your personal data and tell you about your
            privacy rights.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">2. Data We Collect</h2>
          <p>
            We may collect, use, store and transfer different kinds of personal
            data about you:
          </p>
          <ul className="list-disc pl-6 mt-2">
            <li>Identity Data: name, username</li>
            <li>Contact Data: email address</li>
            <li>Usage Data: information about how you use our service</li>
            <li>Reading Data: books, highlights, and notes you import</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            3. How We Use Your Data
          </h2>
          <p>We use your personal data to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Provide and maintain our service</li>
            <li>Process your reading highlights and notes</li>
            <li>Send you important service updates</li>
            <li>Improve our AI-powered features</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">4. Data Security</h2>
          <p>
            We have implemented appropriate security measures to prevent your
            personal data from being accidentally lost, used, or accessed in an
            unauthorized way.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">5. Your Rights</h2>
          <p>You have the right to:</p>
          <ul className="list-disc pl-6 mt-2">
            <li>Access your personal data</li>
            <li>Correct your personal data</li>
            <li>Delete your personal data</li>
            <li>Export your data</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">6. Contact Us</h2>
          <p>
            If you have any questions about this privacy policy, please contact
            us through our support channels.
          </p>
        </section>
      </div>
    </div>
  );
}
