"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import Cookies from "js-cookie";

export default function RoutePersistence() {
  const pathname = usePathname();
  const router = useRouter();

  // Save current route in cookies when it changes
  useEffect(() => {
    if (pathname) {
      Cookies.set("lastVisited", pathname, { expires: 7 });
    }
  }, [pathname]);

  // On first load, redirect to last visited route
  useEffect(() => {
    const lastVisited = Cookies.get("lastVisited");
    if (lastVisited && lastVisited !== pathname && pathname === "/") {
      router.replace(lastVisited);
    }
  }, []);

  return null; // invisible helper
}
