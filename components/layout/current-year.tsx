import { cacheLife } from "next/cache";

// Cached and revalidated daily, so the static shell picks up a new year
// without rendering the footer on every request.
export async function CurrentYear() {
  "use cache";
  cacheLife("days");
  return <>{new Date().getFullYear()}</>;
}
