"use client";

import { useTheme } from "next-themes";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className={`
        flex items-center justify-center w-10 h-10 rounded-full transition-colors
        text-xl
        bg-transparent border border-transparent
        hover:bg-gray-700 hover:border-gray-600
        active:bg-gray-600
      `}
      style={{
        color: isDark ? "#ffffff" : "#ffffff", 
      }}
    >
      {isDark ? "🌙" : "☀️"}
    </button>
  );
}
