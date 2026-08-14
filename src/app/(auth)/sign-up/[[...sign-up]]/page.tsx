import { SignUp } from "@clerk/nextjs";
import { Briefcase } from "lucide-react";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign up",
  robots: { index: false, follow: false },
};

export default function SignUpPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="bg-hero-gradient pointer-events-none absolute inset-0" />
      <div className="bg-grid-pattern pointer-events-none absolute inset-0 opacity-40" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex flex-col items-center gap-3">
          <div className="bg-brand-gradient flex h-14 w-14 items-center justify-center rounded-2xl text-white shadow-lg shadow-orange-500/40">
            <Briefcase className="h-7 w-7" />
          </div>
          <div className="text-center">
            <h1 className="text-gradient text-2xl font-bold tracking-tight">Job Tracker</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              Create your account and take control of your job hunt
            </p>
          </div>
        </div>

        <div className="rounded-2xl border bg-card/90 p-6 shadow-xl shadow-orange-500/10 backdrop-blur-xl sm:p-8">
          <SignUp
            appearance={{
              elements: {
                rootBox: "mx-auto w-full",
                card: "shadow-none border-0 bg-transparent",
                footer: "hidden",
              },
            }}
          />
        </div>
      </div>
    </div>
  );
}
