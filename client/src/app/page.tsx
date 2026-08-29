import { auth } from "@clerk/nextjs/server";
// import { HomeClient } from "./home-client";

export default async function Page() {
  await auth.protect();
  return <div>Home</div>;
}