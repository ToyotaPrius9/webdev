"use client";

import { ReactNode, useState, useEffect, useRef } from "react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname } from "next/navigation";
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
  const pathname = usePathname();
  const isDark = theme === "dark";
  const colors = isDark ? themeColors.dark : themeColors.light;

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuPos, setMenuPos] = useState<{ top: number; right: number }>({
    top: 0,
    right: 0,
  });

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

  const toggleMenu = () => {
    if (isMobile && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setMenuPos({
        top: rect.bottom + window.scrollY,
        right: window.innerWidth - rect.right,
      });
    }
    setMenuOpen((prev) => !prev);
  };

  // Close menu on outside click (mobile only)
  useEffect(() => {
    if (!isMobile) return;

    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen, isMobile]);

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
        <span
          style={{ fontSize: "1.125rem", fontWeight: 600, color: colors.text }}
        >
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
              style={{
                color: colors.headerText,
                textDecoration: pathname === link.href ? "underline" : "none",
                textDecorationThickness: "1px", // 👈 thinner underline
                textUnderlineOffset: "3px", // 👈 move underline slightly down
              }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right side (desktop) */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />
          <button
            ref={buttonRef}
            className="text-2xl transition-transform"
            style={{
              background: "none",
              border: "none",
              color: colors.headerText,
            }}
            onClick={toggleMenu}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Layout */}
        <div className="flex md:hidden justify-between w-full items-center">
          <ThemeToggle />
          <button
            ref={buttonRef}
            className="text-2xl transition-transform"
            style={{
              background: "none",
              border: "none",
              color: colors.headerText,
            }}
            onClick={toggleMenu}
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>
      </header>

      {/* Popup Menu */}
      {menuOpen &&
        (isMobile ? (
          // Mobile absolute-position popup
          <div
            ref={menuRef}
            className={`transform transition-all duration-200 ease-out ${
              menuOpen
                ? "opacity-100 scale-100"
                : "opacity-0 scale-95 pointer-events-none"
            } flex flex-col space-y-2 px-4 py-3 absolute rounded shadow-lg`}
            style={{
              top: menuPos.top,
              right: menuPos.right,
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
              zIndex: 50,
            }}
          >
            {[...links, aboutLink].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: colors.text,
                  textDecoration: pathname === link.href ? "underline" : "none",
                  textDecorationThickness: "1px", // 👈 thinner underline
                  textUnderlineOffset: "3px",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ) : (
          // Desktop css transform dropdown
          <div
            ref={menuRef}
            className={`absolute right-4 mt-2 w-40 flex flex-col space-y-2 px-4 py-3 rounded shadow-lg transform transition-all duration-200 ease-out ${
              menuOpen
                ? "opacity-100 scale-100 translate-y-0"
                : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
            }`}
            style={{
              backgroundColor: colors.background,
              border: `1px solid ${colors.border}`,
              zIndex: 50,
            }}
          >
            {[aboutLink].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  color: colors.text,
                  textDecoration: pathname === link.href ? "underline" : "none",
                  textDecorationThickness: "1px", // 👈 thinner underline
                  textUnderlineOffset: "3px",
                }}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        ))}

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
