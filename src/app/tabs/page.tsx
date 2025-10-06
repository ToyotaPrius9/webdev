"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { themeColors } from "@/config"

// helper to load tabs
function loadTabsFromStorage() {
  if (typeof window === "undefined") return null
  try {
    const savedTabs = localStorage.getItem("userTabs")
    if (savedTabs) {
      const parsed = JSON.parse(savedTabs)
      if (Array.isArray(parsed) && parsed.length > 0) return parsed
    }
  } catch (err) {
    console.error("could not load tabs", err)
  }
  return null
}

// helper to load which tab was active
function loadActiveTabFromStorage() {
  if (typeof window === "undefined") return 0
  try {
    const savedIndex = localStorage.getItem("activeTabIndex")
    if (savedIndex) {
      const idx = parseInt(savedIndex)
      if (!isNaN(idx) && idx >= 0) return idx
    }
  } catch (err) {
    console.error("could not load active tab", err)
  }
  return 0
}

export default function TabsPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const colors = isDark ? themeColors.dark : themeColors.light

  const defaultTabs = [
    {
      title: "Setup",
      content:
        "make sure you have vscode installed.\n- install node.js\n- install git\n\n1. open vscode\n2. start coding",
    },
  ]

  const [tabs, setTabs] = useState(() => loadTabsFromStorage() || defaultTabs)
  const [activeTab, setActiveTab] = useState(() => loadActiveTabFromStorage())
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [generatedOutput, setGeneratedOutput] = useState("")
  const didLoad = useRef(false)

  // update generated html when tabs change
  useEffect(() => {
    const html = generateHTML(tabs)
    setGeneratedOutput(html)
  }, [tabs])

  // save tabs when changed
  useEffect(() => {
    try {
      localStorage.setItem("userTabs", JSON.stringify(tabs))
    } catch (err) {
      console.error("could not save tabs", err)
    }
  }, [tabs])

  // save active tab too
  useEffect(() => {
    try {
      localStorage.setItem("activeTabIndex", String(activeTab))
    } catch (err) {
      console.error("could not save active tab", err)
    }
  }, [activeTab])

  // save again before page unload
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.setItem("userTabs", JSON.stringify(tabs))
      localStorage.setItem("activeTabIndex", String(activeTab))
    }
    window.addEventListener("beforeunload", handleBeforeUnload)
    return () => window.removeEventListener("beforeunload", handleBeforeUnload)
  }, [tabs, activeTab])

  // add tab
  const addTab = () => {
    if (tabs.length >= 15) return
    const newTabs = [
      ...tabs,
      { title: `Step ${tabs.length + 1}`, content: "new tab content..." },
    ]
    setTabs(newTabs)
    setActiveTab(newTabs.length - 1)
  }

  // remove tab
  const removeTab = () => {
    if (activeTab === 0 || tabs.length <= 1) return
    const newTabs = tabs.filter((_, i) => i !== activeTab)
    setTabs(newTabs)
    setActiveTab((prev) =>
      prev > newTabs.length - 1 ? newTabs.length - 1 : prev
    )
  }

  // update tab title or content
  const updateTab = (
    index: number,
    field: "title" | "content",
    value: string
  ) => {
    const newTabs = [...tabs]
    newTabs[index][field] = value
    setTabs(newTabs)
  }

  // copy html
  const copyOutput = () => {
    navigator.clipboard.writeText(generatedOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  return (
    <div style={{ color: colors.text, backgroundColor: colors.background }}>
      {/* title */}
      <div className="px-4 sm:px-6 lg:px-2 pt-3">
        <h2 className="text-3xl font-bold">Tabs</h2>
        <p className="text-sm text-gray-500 mt-1">{tabs.length} tab(s)</p>
      </div>

      {/* layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-5 py-4">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1.6fr] gap-4 md:gap-6 lg:gap-8">
          {/* headers */}
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
                    className="px-4 py-2 rounded border text-center border-2 font-bold w-full max-w-[280px]"
                  />
                ) : (
                  <button
                    key={index}
                    onClick={() => setActiveTab(index)}
                    onDoubleClick={() => index !== 0 && setEditingIndex(index)}
                    className={`px-4 py-2 rounded border text-center transition truncate w-full max-w-[160px] sm:max-w-[240px] md:max-w-[160px] ${
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

          {/* content */}
          <div>
            <h3 className="font-semibold mb-2">Tabs Content</h3>
            <textarea
              value={tabs[activeTab].content}
              onChange={(e) => updateTab(activeTab, "content", e.target.value)}
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

          {/* output */}
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
  )
}

/* Escape HTML so raw <tags> don't render */
function escapeHTML(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;")
}

/* Convert beginner text into HTML OR detect raw code */
function parseContent(input: string): string {
  const lines = input.split("\n")
  const looksLikeCode = lines.some(
    (line) =>
      line.trim().startsWith("<") || line.trim().startsWith("!DOCTYPE")
  )

  if (looksLikeCode) {
    return `<pre style="
      background: #f8f8f8;
      color: #333;
      padding: 1em;
      border-radius: 6px;
      font-family: Menlo, Monaco, Consolas, 'Courier New', monospace;
      font-size: 0.9rem;
      overflow-x: auto;
      border: 1px solid #ddd;
    "><code>${escapeHTML(input)}</code></pre>`
  }

  let html = ""
  let inUL = false
  let inOL = false

  const closeLists = () => {
    if (inUL) {
      html += "</ul>\n"
      inUL = false
    }
    if (inOL) {
      html += "</ol>\n"
      inOL = false
    }
  }

  lines.forEach((line) => {
    const trimmed = line.trim()
    if (trimmed.startsWith("-") || trimmed.startsWith("*")) {
      if (!inUL) {
        closeLists()
        html += "<ul>\n"
        inUL = true
      }
      html += `<li>${trimmed.replace(/^[-*]\s*/, "")}</li>\n`
    } else if (/^\d+\./.test(trimmed)) {
      if (!inOL) {
        closeLists()
        html += "<ol>\n"
        inOL = true
      }
      html += `<li>${trimmed.replace(/^\d+\.\s*/, "")}</li>\n`
    } else if (trimmed === "") {
      closeLists()
      html += "<br/>\n"
    } else {
      closeLists()
      html += `<p>${escapeHTML(trimmed)}</p>\n`
    }
  })

  closeLists()
  return html
}

/* Full HTML generator with tabs & interactivity */
function generateHTML(tabs: { title: string; content: string }[]): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Hello</title>
</head>
<body style="font-family: Arial, sans-serif; margin: 20px;">

<!-- Tabs Header -->
<div style="
  overflow: hidden;
  border: 1px solid #ccc;
  background-color: #f1f1f1;
">
${tabs
  .map(
    (tab, i) => `
<button onclick="openTab(event, 'tab${i}')" style="
  background-color: inherit;
  border: none;
  outline: none;
  cursor: pointer;
  padding: 14px 16px;
  transition: background-color 0.3s;
  font-size: 16px;
  display: inline-block;
" onmouseover="this.style.backgroundColor='#ddd'"
onmouseout="if(!this.classList.contains('active')) this.style.backgroundColor='inherit'">
${i + 1}. ${tab.title}
</button>`
  )
  .join("\n")}
</div>

<!-- Tabs Content -->
${tabs
  .map(
    (tab, i) => `
<div id="tab${i}" style="
  display: ${i === 0 ? "block" : "none"};
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-top: none;
">
<h3 style="margin-top: 0;">${tab.title}</h3>
${parseContent(tab.content)}
</div>`
  )
  .join("\n")}

<script>
function openTab(evt, tabId) {
  var i, tabcontent, buttons;
  tabcontent = document.querySelectorAll('[id^="tab"]');
  buttons = document.querySelectorAll('button');
  tabcontent.forEach(el => el.style.display = "none");
  buttons.forEach(b => {
    b.classList.remove('active');
    b.style.backgroundColor = "inherit";
  });
  document.getElementById(tabId).style.display = "block";
  evt.currentTarget.classList.add('active');
  evt.currentTarget.style.backgroundColor = "#ccc";
}
</script>

</body>
</html>`
}
