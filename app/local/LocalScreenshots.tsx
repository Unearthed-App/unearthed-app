"use client";

import Image from "next/image";
import lightScreenshot from "./Unearthed-Local-Screenshot.webp";
import darkScreenshot from "./Unearthed-Local-Screenshot-dark.webp";

export const LocalScreenshots = () => {
  return (
    <div className="w-full max-w-6xl mb-12 px-4">
      <div className="text-center mb-8 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 text-left mb-6">
          <div className="border-2 border-black dark:border-white p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">🔒 Complete Privacy</h3>
            <p className="text-base">
              A desktop app that runs entirely on your computer. Your highlights
              and reading data never leave your machine—no cloud servers, no
              external connections.
            </p>
          </div>

          <div className="border-2 border-black dark:border-white p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">⚙️ Set It & Forget It</h3>
            <p className="text-base">
              Auto-sync runs in the background. Once configured, you never need
              to open the app again—your highlights just appear in Obsidian.
            </p>
          </div>

          <div className="border-2 border-black dark:border-white p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">📚 Manage Your Library</h3>
            <p className="text-base">
              Browse and organise your synced books directly in the app. Search
              highlights, view stats, and keep your reading life organised.
            </p>
          </div>

          <div className="border-2 border-black dark:border-white p-4 rounded-lg">
            <h3 className="text-xl font-bold mb-2">✨ Daily Reflections</h3>
            <p className="text-base">
              Get a daily reflection from your highlights added to your Obsidian
              daily note, or read it directly in the app to start your day.
            </p>
          </div>

          <div className="border-2 border-black dark:border-white p-4 rounded-lg md:col-span-2">
            <h3 className="text-xl font-bold mb-2">📊 Export Your Data</h3>
            <p className="text-base">
              Exports as markdown files for Obsidian, or as CSV files for backup
              and use in other tools. Choose which books to include or
              ignore—complete control over your data.
            </p>
          </div>
        </div>
      </div>

      <div className="border-2 relative overflow-hidden rounded md:rounded-xl shadow-lg hover:shadow-xl shadow-indigo-500/50 dark:shadow-indigo-500/50 transition-all duration-500 hover:shadow-orange-500/70 dark:hover:shadow-orange-500/70 hover:scale-[1.02]">
        <Image
          src={lightScreenshot}
          alt="Unearthed Local App Screenshot"
          className="w-full h-auto block dark:hidden"
          priority
          quality={90}
        />
        <Image
          src={darkScreenshot}
          alt="Unearthed Local App Screenshot"
          className="w-full h-auto hidden dark:block"
          priority
          quality={90}
        />
      </div>

      <div className="text-center mt-6">
        <p className="text-base italic opacity-80">
          100% local. Your data stays on your computer and is never sent
          anywhere. No cloud servers, no tracking, no subscriptions.
        </p>
      </div>
    </div>
  );
};
