import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <section className="py-24">
      <div className="container flex items-center justify-center">
        <SignIn
          appearance={{
            elements: {
              rootBox: "rounded-none ",
              cardBox: "rounded-lg shadow border border-black border-2",
              card: "rounded-none ",
              formButtonPrimary:
                "bg-white hover:bg-neutral-100 text-black rounded-xl px-8 py-4 font-semibold uppercase border-primary-700 border leading-none transition-all duration-[250ms] ease-in-out hover:rounded-2xl",
            },
          }}
        />
      </div>
    </section>
  );
}
