import type { Skyscraper } from "../types/skyscraper";

export async function fetchSkyscrapers(): Promise<Skyscraper[]> {
  const res = await fetch("/api/skyscrapers");
  if (!res.ok) throw new Error("LOAD_SKYSCRAPERS_FAILED");
  return res.json() as Promise<Skyscraper[]>;
}
