import { auth } from "@clerk/nextjs/server";
import { HistoryClient } from "@/app/history-client";

export default async function HistoryPage() {
  await auth.protect();
  return <HistoryClient />;
}
