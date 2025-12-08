"use client";

import { ThemeProvider } from "next-themes";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider
      attribute="class"   // class strategy
      defaultTheme="system" // fallback theme
      enableSystem        // respect system preference
      disableTransitionOnChange // prevents flicker when switching themes
    >
      {children}
    </ThemeProvider>
  );
}
