import { auth } from "@clerk/nextjs/server";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

export async function apiFetch(path: string, init: RequestInit = {}) {
  const { getToken } = await auth();
  const token = await getToken();

  const headers = new Headers(init.headers);
  headers.set("Content-Type", "application/json");
  if (token) headers.set("Authorization", `Bearer ${token}`);

  return fetch(`${API_URL}${path}`, { ...init, headers });
}
