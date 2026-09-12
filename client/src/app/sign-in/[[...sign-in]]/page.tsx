import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <main className="paper-grid flex min-h-full items-center justify-center px-4 py-16">
      <div className="paper-fade pointer-events-none absolute inset-0" />
      <div className="relative z-10">
        <SignIn forceRedirectUrl="/app" signUpUrl="/sign-up" />
      </div>
    </main>
  );
}
