import { Metadata } from "next";
import React from "react";
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Privacy Policy - Unearthed App",
  description: "Privacy policy for Unearthed App",
};

const PrivacyPolicy = () => {
  return (
    <div className="flex items-center justify-center px-4 md:px-12 py-32">
      <main className="p-6 max-w-3xl bg-card rounded-lg border-2 shadow-[4px_4px_0px_rgba(0,0,0,1)]">
        <h1
          className={
            crimsonPro.className + " font-extrabold text-xl md:text-3xl"
          }
        >
          Privacy Policy for Unearthed App
        </h1>
        <p className="text-secondary mb-4">
          <strong>Last Updated: October 2, 2024</strong>
        </p>

        <h2
          className={
            crimsonPro.className + " font-extrabold text-lg md:text-2xl"
          }
        >
          Information We Collect
        </h2>
        <ul className="list-disc list-inside mb-4">
          <li>
            <strong className="text-secondary">User Data</strong>: We collect
            (but do not store) information that you provide when you create an
            account, including your email address. This information is stored by
            a third-party service, Clerk Auth.
          </li>
          <li>
            <strong className="text-secondary">Content</strong>: We store your
            books, quotes, and encrypted user notes on our servers.
          </li>
          <li>
            <strong className="text-secondary">API Keys</strong>: We store
            encrypted API keys for app integrations to enhance functionality.
          </li>
          <li>
            <strong className="text-secondary">UTC Time Offset</strong>: We
            store your UTC time offset to ensure accurate time representation in
            the app.
          </li>
        </ul>

        <h2
          className={
            crimsonPro.className + " font-extrabold text-lg md:text-2xl"
          }
        >
          Access to Other Services
        </h2>
        <p className="mb-4">
          Unearthed App does not store your credentials for any third-party
          services. Instead, it accesses your accounts through the browser,
          relying on sessions that are already active. This ensures that no
          login details are stored or transmitted by Unearthed App.
        </p>

        <h2
          className={
            crimsonPro.className + " font-extrabold text-lg md:text-2xl"
          }
        >
          Analytics
        </h2>
        <p className="mb-4">
          We use PostHog for analytics to improve user experience. This feature
          is only activated if you opt in via the cookie consent question; it is
          disabled by default.
        </p>

        <h2
          className={
            crimsonPro.className + " font-extrabold text-lg md:text-2xl"
          }
        >
          How We Use Your Information
        </h2>
        <p className="mb-4">
          We use your information solely to provide and enhance the
          functionality of Unearthed App. We do not share your data with third
          parties beyond Clerk Auth for authentication purposes and PostHog for
          analytics.
        </p>

        <h2
          className={
            crimsonPro.className + " font-extrabold text-lg md:text-2xl"
          }
        >
          Data Security
        </h2>
        <p className="mb-4">
          We implement industry-standard security measures to protect your
          information. Your notes, and API keys are stored securely on our
          servers and are encrypted for your protection.
        </p>

        <h2
          className={
            crimsonPro.className + " font-extrabold text-lg md:text-2xl"
          }
        >
          Changes to This Policy
        </h2>
        <p className="mb-4">
          We may update this policy from time to time. We will notify you of any
          significant changes.
        </p>

        <h2
          className={
            crimsonPro.className + " font-extrabold text-lg md:text-2xl"
          }
        >
          Contact Us
        </h2>
        <p className="mb-4">
          If you have any questions about this policy, please contact us at{" "}
          <a
            href="mailto:support@unearthedapp.com"
            className="text-blue-500 hover:underline"
          >
            contact@unearthed.app
          </a>
        </p>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
