import "./globals.css";
import { ReactNode } from "react";
import type { Metadata } from "next";
import { Providers } from "./providers";
import ThemeWrapper from "./theme-wrapper";
import RoutePersistence from "@/components/RoutePersistence";

export const metadata: Metadata = {
  title: "LTU Web App [Harman]",
  description:
    "LTU lms things, made by 22586584",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Providers>
          <ThemeWrapper>
            <RoutePersistence />
            {children}
          </ThemeWrapper>
        </Providers>
      </body>
    </html>
  );
}
