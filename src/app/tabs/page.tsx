"use client";

import { useState } from "react";
import { useTheme } from "next-themes";
import { themeColors } from "@/config";

export default function TabsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = isDark ? themeColors.dark : themeColors.light;

  // State for dynamic tabs
  const [tabs, setTabs] = useState([
    {
      title: "Step 1",
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
  ]);

  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  // Add new tab
  const addTab = () => {
    if (tabs.length >= 15) return; // limit to 15
    setTabs([
      ...tabs,
      {
        title: `Step ${tabs.length + 1}`,
        content: "New tab content...",
        output: "<!-- New tab output -->",
      },
    ]);
    setActiveTab(tabs.length); // focus new tab
  };

  // Remove last tab
  const removeTab = () => {
    if (tabs.length <= 1) return; // keep at least 1 tab
    const newTabs = tabs.slice(0, -1);
    setTabs(newTabs);
    setActiveTab(Math.min(activeTab, newTabs.length - 1));
  };

  // Update tab content
  const updateTab = (index: number, field: "content" | "output", value: string) => {
    const newTabs = [...tabs];
    newTabs[index][field] = value;
    setTabs(newTabs);
  };

  // Copy output to clipboard with feedback
  const copyOutput = () => {
    navigator.clipboard.writeText(tabs[activeTab].output);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000); // reset after 3s
  };

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
            <div className="flex items-center gap-2 mb-4">
              <h3 className="font-semibold">Tabs Headers</h3>

              {/* Remove Tab Button */}
              <button
                onClick={removeTab}
                disabled={tabs.length <= 1}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "25%",
                  border: `1px solid transparent`,
                  backgroundColor: "transparent",
                  cursor: tabs.length <= 1 ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  color: colors.text,
                  lineHeight: "1",
                  transition: "all 0.2s",
                }}
                className="hover:border hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Remove Tab"
              >
                −
              </button>

              {/* Add Tab Button */}
              <button
                onClick={addTab}
                disabled={tabs.length >= 15}
                style={{
                  width: "20px",
                  height: "20px",
                  borderRadius: "25%",
                  border: `1px solid transparent`,
                  backgroundColor: "transparent",
                  cursor: tabs.length >= 15 ? "not-allowed" : "pointer",
                  fontWeight: "bold",
                  color: colors.text,
                  lineHeight: "1",
                  transition: "all 0.2s",
                }}
                className="hover:border hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                title="Add Tab"
              >
                +
              </button>
            </div>

            <div className="flex flex-col gap-3 w-full items-center">
              {tabs.map((tab, index) => (
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
                  {tab.title}
                </button>
              ))}
            </div>
          </div>

          {/* Tabs Content */}
          <div>
            <h3 className="font-semibold mb-2">Tabs Content</h3>
            <textarea
              value={tabs[activeTab].content}
              onChange={(e) => updateTab(activeTab, "content", e.target.value)}
              style={{
                width: "100%",
                minHeight: "40vh",
                border: `1px solid ${colors.border}`,
                borderRadius: "0.5rem",
                padding: "0.75rem",
                fontFamily: "sans-serif",
                fontSize: "0.95rem",
                backgroundColor: colors.surface,
                color: colors.text,
                resize: "vertical",
              }}
            />
          </div>

          {/* Output */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Output</h3>
              <button
                onClick={copyOutput}
                className={`text-sm px-2 py-1 rounded border transition ${
                  isDark
                    ? "border-gray-500 bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "border-gray-400 bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>

            <div
              style={{
                width: "100%",
                minHeight: "40vh",
                border: `1px solid ${colors.border}`,
                borderRadius: "0.5rem",
                padding: "0.75rem",
                backgroundColor: "#1e1e1e", // always dark editor bg
                color: "#d4d4d4",
                fontFamily: "Menlo, Monaco, Consolas, 'Courier New', monospace",
                fontSize: "0.9rem",
                overflowY: "auto",
                whiteSpace: "pre-wrap",
              }}
            >
              <textarea
                value={tabs[activeTab].output}
                onChange={(e) => updateTab(activeTab, "output", e.target.value)}
                style={{
                  width: "100%",
                  minHeight: "38vh",
                  border: "none",
                  outline: "none",
                  resize: "none",
                  backgroundColor: "transparent",
                  color: "#d4d4d4",
                  fontFamily:
                    "Menlo, Monaco, Consolas, 'Courier New', monospace",
                  fontSize: "0.9rem",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
