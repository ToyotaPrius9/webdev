import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const lastVisited = cookieStore.get("lastVisited")?.value;

  if (lastVisited) {
    // go back to where user left off
    redirect(lastVisited);
  } else {
    // def to /tabs if no cookie
    redirect("/tabs");
  }
}