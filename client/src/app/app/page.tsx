import { auth } from "@clerk/nextjs/server";
import { HomeClient } from "@/app/home-client";

export default async function AppPage() {
  await auth.protect();
  return <HomeClient />;
}
