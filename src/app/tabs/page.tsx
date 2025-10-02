"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { themeColors } from "@/config";

export default function TabsPage() {
  const [activeTab, setActiveTab] = useState(0);
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = isDark ? themeColors.dark : themeColors.light;

  const tabHeaders = ["Step 1", "Step 2", "Step 3"];
  const tabContents = [
    {
      content: "Step 1: Install VSCode\nThis is your HTML + JS output.",
      output: `<!DOCTYPE html>
<html>
  <head><title>Generated</title></head>
  <body style="font-family: Arial;">
    <h1>Step 1: Install VSCode</h1>
    <p>This is your HTML + JS output.</p>
  </body>
</html>`,
    },
    {
      content:
        "Step 2:\n  1. Install VSCode\n  2. Install Chrome\n  3. Install Node\n  4. etc ",
      output: `<div class="tab" style="overflow: hidden; border: 1px solid #ccc; background-color: #f1f1f1;">
    <button class="tablinks" onclick="openTab(event, 'NodeInstallPart1')">1. Setup</button>
    <button class="tablinks" onclick="openTab(event, 'DockerInstallPart1')">2. Terminal Commands</button>
    <button class="tablinks" onclick="openTab(event, 'DockerHelloWorldPart1')">3. Index.html</button>
    <button class="tablinks" onclick="openTab(event, 'HTTPS')">4. HTTPS</button>
    <button class="tablinks" onclick="openTab(event, 'Cookies')">5. Cookies</button>
</div>`,
    },
    {
      content: "Step 3: Content coming soon...",
      output: "<!-- Step 3 HTML + JS output -->",
    },
  ];

  return (
    <div style={{ color: colors.text, backgroundColor: colors.background }}>
      {/* Page Title */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <h2 className="text-2xl font-bold">Tabs</h2>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1.6fr] gap-4 md:gap-6 lg:gap-8">
          {/* Tabs Headers */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-4">Tabs Headers: [+]</h3>
            <div className="flex flex-col gap-3 w-full items-center">
              {tabHeaders.map((tab, index) => (
                <button
                  key={index}
                  onClick={() => setActiveTab(index)}
                  style={{
                    minWidth: "140px",
                    padding: "0.75rem 1rem",
                    border: `1px solid ${colors.border}`,
                    borderRadius: "0.5rem",
                    backgroundColor:
                      activeTab === index ? colors.surfaceAlt : colors.surface,
                    fontWeight: activeTab === index ? "bold" : "normal",
                    textAlign: "center",
                    fontSize: "1rem",
                    color: colors.text,
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs Content */}
          <div>
            <h3 className="font-semibold mb-2">Tabs Content</h3>
            <div
              style={{
                padding: "1rem",
                border: `1px solid ${colors.border}`,
                borderRadius: "0.5rem",
                backgroundColor: colors.surface,
                minHeight: "40vh",
                whiteSpace: "pre-line",
                color: colors.text,
              }}
            >
              {tabContents[activeTab].content}
            </div>
          </div>

          {/* Output */}
          <div>
            <h3 className="font-semibold mb-2">Output</h3>
            <textarea
              readOnly
              style={{
                width: "100%",
                minHeight: "40vh",
                border: `1px solid ${colors.border}`,
                borderRadius: "0.5rem",
                padding: "0.75rem",
                fontFamily: "monospace",
                fontSize: "0.9rem",
                backgroundColor: colors.surface,
                color: colors.text,
              }}
              value={tabContents[activeTab].output}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
