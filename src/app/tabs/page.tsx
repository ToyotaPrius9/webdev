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
      <div className="max-w-7xl mx-auto px-4 md:px-6 lg:px-8 py-8">
        <h2 className="text-2xl font-bold mb-6">Tabs</h2>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.5fr_1fr] gap-6">
          {/* Tabs Headers */}
          <div>
            <h3 className="font-semibold mb-2">Tabs Headers: [+]</h3>
            {tabHeaders.map((tab, index) => (
              <button
                key={index}
                onClick={() => setActiveTab(index)}
                style={{
                  width: "100%",
                  marginBottom: "0.5rem",
                  padding: "0.5rem",
                  border: `1px solid ${colors.border}`,
                  borderRadius: "0.375rem",
                  backgroundColor:
                    activeTab === index ? colors.surfaceAlt : colors.surface,
                  fontWeight: activeTab === index ? "bold" : "normal",
                  textAlign: "left",
                  color: colors.text,
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tabs Content */}
          <div>
            <h3 className="font-semibold mb-2">Tabs Content</h3>
            <div
              style={{
                padding: "1rem",
                border: `1px solid ${colors.border}`,
                borderRadius: "0.375rem",
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
                borderRadius: "0.375rem",
                padding: "0.5rem",
                fontFamily: "monospace",
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
