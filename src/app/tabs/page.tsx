"use client";

import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { themeColors } from "@/config";

export default function TabsPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const colors = isDark ? themeColors.dark : themeColors.light;

  // Default tab
  const defaultTabs = [
    {
      title: "Setup",
      content:
        "Make sure you have VSCode installed.\n- Install Node.js\n- Install Git\n\n1. Open VSCode\n2. Start coding",
    },
  ];

  const [tabs, setTabs] = useState(defaultTabs);
  const [activeTab, setActiveTab] = useState(0);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [copied, setCopied] = useState(false);
  const [generatedOutput, setGeneratedOutput] = useState("");

  // Load from localStorage on first mount
  useEffect(() => {
    const saved = localStorage.getItem("userTabs");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTabs(parsed);
        }
      } catch (err) {
        console.error("Failed to parse saved tabs", err);
      }
    }
  }, []);

  // Save to localStorage + regenerate HTML when tabs change
  useEffect(() => {
    localStorage.setItem("userTabs", JSON.stringify(tabs));
    const html = generateHTML(tabs);
    setGeneratedOutput(html);
  }, [tabs]);

  // Add new tab
  const addTab = () => {
    if (tabs.length >= 15) return;
    setTabs([
      ...tabs,
      { title: `Step ${tabs.length}`, content: "New tab content..." },
    ]);
    setActiveTab(tabs.length);
  };

  // Remove currently selected tab (but not Setup tab at index 0)
  const removeTab = () => {
    if (activeTab === 0 || tabs.length <= 1) return; // Prevent removing Setup

    const newTabs = tabs.filter((_, i) => i !== activeTab);
    setTabs(newTabs);

    // Adjust activeTab index
    setActiveTab((prev) =>
      prev > newTabs.length - 1 ? newTabs.length - 1 : prev
    );
  };

  // Update a tab
  const updateTab = (
    index: number,
    field: "title" | "content",
    value: string
  ) => {
    const newTabs = [...tabs];
    newTabs[index][field] = value;
    setTabs(newTabs);
  };

  // Copy HTML output
  const copyOutput = () => {
    navigator.clipboard.writeText(generatedOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
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
              <button
                onClick={removeTab}
                disabled={activeTab === 0 || tabs.length <= 1}
                className="w-5 h-5 rounded border text-sm font-bold flex items-center justify-center 
                  hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                −
              </button>
              <button
                onClick={addTab}
                disabled={tabs.length >= 15}
                className="w-5 h-5 rounded border text-sm font-bold flex items-center justify-center 
                  hover:border-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
              >
                +
              </button>
            </div>

            <div className="flex flex-col gap-3 w-full items-center">
              {tabs.map((tab, index) =>
                editingIndex === index ? (
                  <input
                    key={index}
                    value={tab.title}
                    autoFocus
                    onChange={(e) => updateTab(index, "title", e.target.value)}
                    onBlur={() => setEditingIndex(null)}
                    onKeyDown={(e) => e.key === "Enter" && setEditingIndex(null)}
                    className="px-4 py-2 rounded border text-center border-2 font-bold 
                               w-full max-w-[280px]"
                  />
                ) : (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    onDoubleClick={() =>
                      index !== 0 && setEditingIndex(index)
                    }
                    className={`px-4 py-2 rounded border text-center transition truncate 
                                w-full max-w-[160px] sm:max-w-[240px] md:max-w-[160px]
                                ${
                                  activeTab === index
                                    ? "font-bold border-2"
                                    : "border hover:border-gray-400"
                                }`}
                    title={tab.title}
                  >
                    {tab.title}
                  </button>
                )
              )}
            </div>
          </div>

          {/* Tabs Content */}
          <div>
            <h3 className="font-semibold mb-2">Tabs Content</h3>
            <textarea
              value={tabs[activeTab].content}
              onChange={(e) =>
                updateTab(activeTab, "content", e.target.value)
              }
              style={{
                width: "100%",
                minHeight: "43vh",
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
              <h3 className="font-semibold">Generated HTML Output</h3>
              <button
                onClick={copyOutput}
                className={`text-sm px-2 py-0.5 rounded border transition ${
                  isDark
                    ? "border-gray-500 bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "border-gray-400 bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <textarea
              value={generatedOutput}
              readOnly
              style={{
                width: "100%",
                minHeight: "40vh",
                border: `1px solid ${colors.border}`,
                borderRadius: "0.5rem",
                padding: "0.75rem",
                backgroundColor: "#1e1e1e",
                color: "#d4d4d4",
                fontFamily:
                  "Menlo, Monaco, Consolas, 'Courier New', monospace",
                fontSize: "0.9rem",
                resize: "none",
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* Escape HTML so raw <tags> don't render */
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/* Convert beginner text into HTML OR detect raw code */
function parseContent(input: string): string {
  const lines = input.split("\n");

  // Detect if this looks like raw HTML/Code
  const looksLikeCode = lines.some(
    (line) => line.trim().startsWith("<") || line.trim().startsWith("!DOCTYPE")
  );

  if (looksLikeCode) {
    // Render entire block as styled code editor
    return `<pre style="
      background: #f8f8f8;
      color: #333;
      padding: 1em;
      border-radius: 6px;
      font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
      font-size: 0.9rem;
      overflow-x: auto;
      border: 1px solid #ddd;
    "><code>${escapeHTML(input)}</code></pre>`;
  }

  // Otherwise, normal beginner-friendly parsing
  let html = "";
  let inUL = false;
  let inOL = false;

  const closeLists = () => {
    if (inUL) {
      html += "</ul>\n";
      inUL = false;
    }
    if (inOL) {
      html += "</ol>\n";
      inOL = false;
    }
  };

  lines.forEach((line) => {
    const trimmed = line.trim();

    if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
      if (!inUL) {
        closeLists();
        html += "<ul>\n";
        inUL = true;
      }
      html += `<li>${trimmed.replace(/^[-*]\s*/, "")}</li>\n`;
    } else if (/^\d+\./.test(trimmed)) {
      if (!inOL) {
        closeLists();
        html += "<ol>\n";
        inOL = true;
      }
      html += `<li>${trimmed.replace(/^\d+\.\s*/, "")}</li>\n`;
    } else if (trimmed === "") {
      closeLists();
      html += "<br/>\n";
    } else {
      closeLists();
      html += `<p>${escapeHTML(trimmed)}</p>\n`;
    }
  });

  closeLists();
  return html;
}

/* Generate exportable HTML from current tabs */
function generateHTML(tabs: { title: string; content: string }[]): string {
  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Tabs Example</title>
  <style>
    body { font-family: Arial, sans-serif; }
    .tab { overflow: hidden; border: 1px solid #ccc; background-color: #f1f1f1; }
    .tab button {
      background-color: inherit; border: none; outline: none;
      cursor: pointer; padding: 14px 16px; transition: 0.3s; font-size: 16px;
    }
    .tab button:hover { background-color: #ddd; }
    .tab button.active { background-color: #ccc; }
    .tabcontent {
      display: none; padding: 6px 12px;
      border: 1px solid #ccc; border-top: none;
    }
  </style>
</head>
<body>

<div class="tab">
  ${tabs
    .map(
      (tab, i) =>
        `<button class="tablinks" onclick="openTab(event, 'tab${i}')">${i + 1}. ${tab.title}</button>`
    )
    .join("\n")}
</div>

${tabs
  .map(
    (tab, i) => `
<div id="tab${i}" class="tabcontent" style="${i === 0 ? "display:block;" : ""}">
  <h3>${tab.title}</h3>
  ${parseContent(tab.content)}
</div>`
  )
  .join("\n")}

<script>
function openTab(evt, tabId) {
  var i, tabcontent, tablinks;
  tabcontent = document.getElementsByClassName("tabcontent");
  for (i = 0; i < tabcontent.length; i++) {
    tabcontent[i].style.display = "none";
  }
  tablinks = document.getElementsByClassName("tablinks");
  for (i = 0; i < tablinks.length; i++) {
    tablinks[i].className = tablinks[i].className.replace(" active", "");
  }
  document.getElementById(tabId).style.display = "block";
  evt.currentTarget.className += " active";
}
</script>

</body>
</html>`;
}
