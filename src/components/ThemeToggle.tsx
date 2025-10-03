"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Ensure theme is only used after client has mounted
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    // Prevent mismatches by rendering nothing on SSR
    return (
      <button
        className="flex items-center justify-center w-10 h-10 rounded-full"
        aria-hidden="true"
      />
    );
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        flex items-center justify-center w-10 h-10 rounded-full transition-colors
        ${isDark
          ? "hover:bg-gray-700 text-white"
          : "hover:bg-gray-200 text-gray-800"}
      `}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
