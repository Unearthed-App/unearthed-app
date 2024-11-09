import { SignIn } from "@clerk/nextjs";
import { Crimson_Pro } from "next/font/google";
const crimsonPro = Crimson_Pro({ subsets: ["latin"] });

export default function SignInPage() {
  return (
    <section className="py-24">
      <div className="container flex items-center justify-center">
        <SignIn
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
