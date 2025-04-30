"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"

type ThemeColors = {
  header: string
  need: string
  flow: string
  grouping: string
  columns: string[]
}

interface ColorThemeContextType {
  colors: ThemeColors
  updateColor: (key: keyof ThemeColors | "column", value: string, index?: number) => void
  updateAllColumnColors: (value: string) => void
  resetColors: () => void
  isUpdating: boolean
}

const defaultColors: ThemeColors = {
  header: "#475569",
  need: "#475569",
  flow: "#f1f5f9",
  grouping: "#f5f5dc",
  columns: ["#e2e8f0", "#e2e8f0", "#e2e8f0", "#e2e8f0", "#e2e8f0", "#e2e8f0"],
}

const ColorThemeContext = createContext<ColorThemeContextType | undefined>(undefined)

export function ColorThemeProvider({ children }: { children: React.ReactNode }) {
  const [colors, setColors] = useState<ThemeColors>(defaultColors)
  const [isUpdating, setIsUpdating] = useState(false)

  // Function to determine if text should be white or black based on background color
  const getTextColor = useCallback((bgColor: string) => {
    // Remove the # if it exists
    const hex = bgColor.replace("#", "")

    // Convert hex to RGB
    const r = Number.parseInt(hex.substring(0, 2), 16)
    const g = Number.parseInt(hex.substring(2, 4), 16)
    const b = Number.parseInt(hex.substring(4, 6), 16)

    // Calculate luminance - a measure of how bright the color appears
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255

    // Return white for dark backgrounds, black for light backgrounds
    return luminance > 0.5 ? "#000000" : "#ffffff"
  }, [])

  // Apply colors to CSS variables
  const applyColors = useCallback(() => {
    // Use requestAnimationFrame to batch CSS updates
    requestAnimationFrame(() => {
      try {
        // Apply header color
        document.documentElement.style.setProperty("--toc-header-bg", colors.header)
        document.documentElement.style.setProperty("--toc-header-text", getTextColor(colors.header))

        // Apply need/vision/purpose color
        document.documentElement.style.setProperty("--toc-need-bg", colors.need)
        document.documentElement.style.setProperty("--toc-need-text", getTextColor(colors.need))

        // Apply flow color
        document.documentElement.style.setProperty("--toc-flow-bg", colors.flow)
        document.documentElement.style.setProperty("--toc-flow-text", getTextColor(colors.flow))

        // Apply grouping color
        document.documentElement.style.setProperty("--toc-grouping-bg", colors.grouping)
        document.documentElement.style.setProperty("--toc-grouping-text", getTextColor(colors.grouping))

        // Apply column colors
        colors.columns.forEach((color, index) => {
          document.documentElement.style.setProperty(`--toc-column-${index + 1}-bg`, color)
          document.documentElement.style.setProperty(`--toc-column-${index + 1}-text`, getTextColor(color))
        })
      } finally {
        // Ensure pointer events are always enabled
        document.body.style.pointerEvents = "auto"
        setIsUpdating(false)
      }
    })
  }, [colors, getTextColor])

  // Apply colors whenever they change
  useEffect(() => {
    setIsUpdating(true)
    applyColors()
  }, [applyColors])

  // Initialize colors from CSS variables when component mounts
  useEffect(() => {
    const root = document.documentElement
    const style = getComputedStyle(root)

    const initialColors: ThemeColors = {
      header: style.getPropertyValue("--toc-header-bg").trim() || defaultColors.header,
      need: style.getPropertyValue("--toc-need-bg").trim() || defaultColors.need,
      flow: style.getPropertyValue("--toc-flow-bg").trim() || defaultColors.flow,
      grouping: style.getPropertyValue("--toc-grouping-bg").trim() || defaultColors.grouping,
      columns: [
        style.getPropertyValue("--toc-column-1-bg").trim() || defaultColors.columns[0],
        style.getPropertyValue("--toc-column-2-bg").trim() || defaultColors.columns[1],
        style.getPropertyValue("--toc-column-3-bg").trim() || defaultColors.columns[2],
        style.getPropertyValue("--toc-column-4-bg").trim() || defaultColors.columns[3],
        style.getPropertyValue("--toc-column-5-bg").trim() || defaultColors.columns[4],
        style.getPropertyValue("--toc-column-6-bg").trim() || defaultColors.columns[5],
      ],
    }

    setColors(initialColors)

    // Ensure pointer events are enabled
    document.body.style.pointerEvents = "auto"
  }, [])

  // Update a specific color
  const updateColor = useCallback((key: keyof ThemeColors | "column", value: string, index?: number) => {
    setIsUpdating(true)
    setColors((prev) => {
      if (key === "column" && typeof index === "number") {
        const newColumns = [...prev.columns]
        newColumns[index] = value
        return {
          ...prev,
          columns: newColumns,
        }
      }

      if (key !== "column") {
        return {
          ...prev,
          [key]: value,
        }
      }

      return prev
    })
  }, [])

  // Update all column colors at once
  const updateAllColumnColors = useCallback((value: string) => {
    setIsUpdating(true)
    setColors((prev) => ({
      ...prev,
      columns: prev.columns.map(() => value),
    }))
  }, [])

  // Reset colors to default
  const resetColors = useCallback(() => {
    setIsUpdating(true)
    setColors(defaultColors)

    // Ensure pointer events are enabled
    document.body.style.pointerEvents = "auto"
  }, [])

  return (
    <ColorThemeContext.Provider value={{ colors, updateColor, updateAllColumnColors, resetColors, isUpdating }}>
      {children}
    </ColorThemeContext.Provider>
  )
}

export function useColorTheme() {
  const context = useContext(ColorThemeContext)
  if (context === undefined) {
    throw new Error("useColorTheme must be used within a ColorThemeProvider")
  }
  return context
}
