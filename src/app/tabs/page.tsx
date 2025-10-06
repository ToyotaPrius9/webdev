"use client"

import { useState, useEffect, useRef } from "react"
import { useTheme } from "next-themes"
import { themeColors } from "@/config"

export default function TabsPage() {
  const { theme } = useTheme()
  const isDark = theme === "dark"
  const colors = isDark ? themeColors.dark : themeColors.light

  // starting tabs (this is fallback if nothing in local storage)
  const defaultTabs = [
    {
      title: "Setup",
      content:
        "make sure you have vscode installed.\n- install node.js\n- install git\n\n1. open vscode\n2. start coding",
    },
  ]

  const [tabs, setTabs] = useState(defaultTabs)
  const [activeTab, setActiveTab] = useState(0)
  const [editingIndex, setEditingIndex] = useState<number | null>(null)
  const [copied, setCopied] = useState(false)
  const [generatedOutput, setGeneratedOutput] = useState("")
  const didLoad = useRef(false)

  // Load tabs + active tab from local storage one time
  useEffect(() => {
    try {
      const savedTabs = localStorage.getItem("userTabs")
      const savedIndex = localStorage.getItem("activeTabIndex")

      if (savedTabs) {
        const parsed = JSON.parse(savedTabs)
        if (Array.isArray(parsed) && parsed.length > 0) {
          setTabs(parsed)
        }
      }

      if (savedIndex) {
        const idx = parseInt(savedIndex)
        if (!isNaN(idx) && idx >= 0) {
          setActiveTab(idx)
        }
      }
    } catch (err) {
      console.error("could not load tabs", err)
    } finally {
      didLoad.current = true
    }
  }, [])

  // Save tabs to local storage whenever they change (after first load)
  useEffect(() => {
    if (!didLoad.current) return
    try {
      localStorage.setItem("userTabs", JSON.stringify(tabs))
      const html = generateHTML(tabs)
      setGeneratedOutput(html)
    } catch (err) {
      console.error("could not save tabs", err)
    }
  }, [tabs])

  // Save active tab index too
  useEffect(() => {
    if (!didLoad.current) return
    try {
      localStorage.setItem("activeTabIndex", String(activeTab))
    } catch (err) {
      console.error("could not save active tab", err)
    }
  }, [activeTab])

  // Also save to localStorage on page unload as a safety measure
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (didLoad.current) {
        localStorage.setItem("userTabs", JSON.stringify(tabs))
        localStorage.setItem("activeTabIndex", String(activeTab))
      }
    }

    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [tabs, activeTab])

  // add a new tab
  const addTab = () => {
    if (tabs.length >= 15) return
    const newTabs = [
      ...tabs,
      { title: `Step ${tabs.length + 1}`, content: "new tab content..." },
    ]
    setTabs(newTabs)
    setActiveTab(newTabs.length - 1)
  }

  // remove tab (cant remove the first one)
  const removeTab = () => {
    if (activeTab === 0 || tabs.length <= 1) return
    const newTabs = tabs.filter((_, i) => i !== activeTab)
    setTabs(newTabs)
    setActiveTab((prev) =>
      prev > newTabs.length - 1 ? newTabs.length - 1 : prev
    )
  }

  // update title or content
  const updateTab = (
    index: number,
    field: "title" | "content",
    value: string
  ) => {
    const newTabs = [...tabs]
    newTabs[index][field] = value
    setTabs(newTabs)
  }

  // copy generated html
  const copyOutput = () => {
    navigator.clipboard.writeText(generatedOutput)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }



  return (
    <div style={{ color: colors.text, backgroundColor: colors.background }}>
      {/* page title */}
      <div className="px-4 sm:px-6 lg:px-8 pt-6">
        <h2 className="text-2xl font-bold">Tabs</h2>
        <p className="text-sm text-gray-500 mt-1">
          {tabs.length} tab(s) - Tabs are automatically saved
        </p>
      </div>

      {/* main layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-end mb-4">

        </div>

        <div className="grid grid-cols-1 md:grid-cols-[1fr_1.2fr_1.6fr] gap-4 md:gap-6 lg:gap-8">
          {/* left side: tab headers */}
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

          {/* middle: tab content */}
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

          {/* right side: generated html */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold">Output</h3>
              <button
                onClick={copyOutput}
                className={`text-sm px-2 py-0.5 rounded border transition ${
                  isDark
                    ? "border-gray-500 bg-gray-800 text-gray-200 hover:bg-gray-700"
                    : "border-gray-400 bg-gray-100 text-gray-800 hover:bg-gray-200"
                }`}
              >
                {copied ? "copied!" : "copy"}
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

// turn text into html
function parseContent(input: string): string {
  const lines = input.split("\n")
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

  for (const line of lines) {
    const trimmed = line.trim()
    if (trimmed.startsWith("<!DOCTYPE")) {
      return input
    } else if (trimmed.startsWith("- ")) {
      if (!inUL) {
        closeLists()
        html += "<ul>\n"
        inUL = true
      }
      html += `<li>${trimmed.slice(2)}</li>\n`
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
    } else if (trimmed.startsWith("#")) {
      closeLists()
      const level = trimmed.match(/^#+/)?.[0].length || 1
      const text = trimmed.replace(/^#+\s*/, "")
      html += `<h${level}>${text}</h${level}>\n`
    } else {
      closeLists()
      html += `<p>${trimmed}</p>\n`
    }
  }
  closeLists()
  return html
}

// make a full html doc
function generateHTML(tabs: { title: string; content: string }[]): string {
  const body = tabs
    .map(
      (tab) => `
  <section>
    <h2>${tab.title}</h2>
    ${parseContent(tab.content)}
  </section>`
    )
    .join("\n")

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>generated page</title>
</head>
<body>
${body}
</body>
</html>`
}