import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <main className="paper-grid flex min-h-full items-center justify-center px-4 py-16">
      <div className="paper-fade pointer-events-none absolute inset-0" />
      <div className="relative z-10">
        <SignUp forceRedirectUrl="/app" signInUrl="/sign-in" />
      </div>
    </main>
  );
}
