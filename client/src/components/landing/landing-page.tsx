import { LandingNav } from "@/components/landing/landing-nav";
import { LandingHero } from "@/components/landing/landing-hero";
import { LandingHow } from "@/components/landing/landing-how";
import { LandingFooter } from "@/components/landing/landing-footer";

export function LandingPage() {
  return (
    <div className="paper-grid relative min-h-full">
      <div className="paper-fade pointer-events-none absolute inset-0" />
      <LandingNav />
      <LandingHero />
      <LandingHow />
      <LandingFooter />
    </div>
  );
}
