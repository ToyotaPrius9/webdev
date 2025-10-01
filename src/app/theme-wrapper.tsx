"use client";

import { ReactNode, useState } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import ThemeToggle from "@/components/ThemeToggle";
import { studentInfo, themeColors } from "@/config";

const links = [
  { href: "/tabs", label: "Tabs" },
  { href: "/prelab", label: "Pre-lab Questions" },
  { href: "/escape", label: "Escape Room" },
  { href: "/coding", label: "Coding Races" },
];

const aboutLink = { href: "/about", label: "About" };

export default function ThemeWrapper({ children }: { children: ReactNode }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = isDark ? themeColors.dark : themeColors.light;

  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      {/* Top bar */}
      <div
        className="flex justify-between items-center px-4 py-2 border-b"
        style={{
          borderColor: colors.border,
          backgroundColor: colors.topbarBg,
        }}
      >
        <span style={{ fontWeight: "bold", color: colors.text }}>
          Student No: {studentInfo.number}
        </span>
        <span style={{ fontSize: "1.125rem", fontWeight: 600, color: colors.text }}>
          LTU Web App
        </span>
      </div>

      {/* Header/Nav */}
      <header
        className="flex justify-between items-center px-4 py-3"
        style={{
          backgroundColor: colors.headerBg,
          color: colors.headerText,
        }}
      >
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-4">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:underline"
              style={{ color: colors.headerText, textDecoration: "none" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <button
            className="text-2xl"
            style={{
              background: "none",
              border: "none",
              color: colors.headerText,
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden justify-between w-full items-center">
          {/* Theme toggle on the left */}
          <ThemeToggle />

          {/* Kebab menu on the right */}
          <button
            className="text-2xl"
            style={{
              background: "none",
              border: "none",
              color: colors.headerText,
            }}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>
        </div>
      </header>

      {/* Popup Menu */}
      {menuOpen && (
        <div
          className="flex flex-col space-y-2 px-4 py-3 md:absolute md:right-4 md:mt-2 md:w-40 md:rounded md:shadow-lg"
          style={{
            backgroundColor: colors.background,
            border: `1px solid ${colors.border}`,
            zIndex: 50,
          }}
        >
          {/* Mobile → all links, Desktop → only About */}
          {(window.innerWidth < 768 ? [...links, aboutLink] : [aboutLink]).map(
            (link) => (
              <Link
                key={link.href}
                href={link.href}
                className="hover:underline"
                style={{ color: colors.text }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            )
          )}
        </div>
      )}

      {/* Page Content */}
      <main
        className="flex-1 px-4 md:px-6 lg:px-8 py-6"
        style={{
          backgroundColor: colors.background,
          color: colors.text,
        }}
      >
        {children}
      </main>

      {/* Footer */}
      <footer
        className="text-center py-2 text-sm"
        style={{
          backgroundColor: colors.footerBg,
          color: colors.footerText,
        }}
      >
        {studentInfo.copyright} | {studentInfo.name} | {studentInfo.number} |{" "}
        {new Date().toISOString().split("T")[0]}
      </footer>
    </>
  );
}
