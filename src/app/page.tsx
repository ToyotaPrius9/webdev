// src/app/page.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default function Home() {
  const cookieStore = cookies();
  const lastVisited = cookieStore.get("lastVisited")?.value;

  if (lastVisited) {
    // Go back to where user left off
    redirect(lastVisited);
  } else {
    // Default to /tabs if no cookie
    redirect("/tabs");
  }
}
