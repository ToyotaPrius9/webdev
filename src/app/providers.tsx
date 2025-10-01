"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"   // adds "class" to <html> (so Tailwind's dark mode works)
      defaultTheme="system" // fallback theme
      enableSystem        // respect system preference
      disableTransitionOnChange // prevents flicker when switching themes
    >
      {children}
    </ThemeProvider>
  );
}
