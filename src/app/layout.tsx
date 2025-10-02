import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "./providers";
import ThemeWrapper from "./theme-wrapper";
import RoutePersistence from "@/components/RoutePersistence";

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
