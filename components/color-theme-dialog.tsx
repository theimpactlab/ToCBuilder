"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface ColorThemeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ColorThemeDialog({ open, onOpenChange }: ColorThemeDialogProps) {
  const [activeTab, setActiveTab] = useState("header")
  const [colors, setColors] = useState({
    header: "#475569",
    need: "#475569",
    flow: "#f1f5f9",
    grouping: "#f5f5dc",
    column1: "#e2e8f0",
    column2: "#e2e8f0",
    column3: "#e2e8f0",
    column4: "#e2e8f0",
    column5: "#e2e8f0",
    column6: "#e2e8f0",
  })

  // Initialize colors from CSS variables when component mounts
  useEffect(() => {
    if (open) {
      const root = document.documentElement
      const style = getComputedStyle(root)

      setColors({
        header: style.getPropertyValue("--toc-header-bg").trim() || "#475569",
        need: style.getPropertyValue("--toc-need-bg").trim() || "#475569",
        flow: style.getPropertyValue("--toc-flow-bg").trim() || "#f1f5f9",
        grouping: style.getPropertyValue("--toc-grouping-bg").trim() || "#f5f5dc",
        column1: style.getPropertyValue("--toc-column-1-bg").trim() || "#e2e8f0",
        column2: style.getPropertyValue("--toc-column-2-bg").trim() || "#e2e8f0",
        column3: style.getPropertyValue("--toc-column-3-bg").trim() || "#e2e8f0",
        column4: style.getPropertyValue("--toc-column-4-bg").trim() || "#e2e8f0",
        column5: style.getPropertyValue("--toc-column-5-bg").trim() || "#e2e8f0",
        column6: style.getPropertyValue("--toc-column-6-bg").trim() || "#e2e8f0",
      })
    }
  }, [open])

  // Function to determine if text should be white or black based on background color
  const getTextColor = (bgColor: string) => {
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
  }

  const handleColorChange = (variable: string, value: string) => {
    // Update the state
    if (variable === "toc-header") {
      setColors((prev) => ({ ...prev, header: value }))
    } else if (variable === "toc-need") {
      setColors((prev) => ({ ...prev, need: value }))
    } else if (variable === "toc-flow") {
      setColors((prev) => ({ ...prev, flow: value }))
    } else if (variable === "toc-grouping") {
      setColors((prev) => ({ ...prev, grouping: value }))
    } else if (variable === "toc-column-1") {
      setColors((prev) => ({ ...prev, column1: value }))
    } else if (variable === "toc-column-2") {
      setColors((prev) => ({ ...prev, column2: value }))
    } else if (variable === "toc-column-3") {
      setColors((prev) => ({ ...prev, column3: value }))
    } else if (variable === "toc-column-4") {
      setColors((prev) => ({ ...prev, column4: value }))
    } else if (variable === "toc-column-5") {
      setColors((prev) => ({ ...prev, column5: value }))
    } else if (variable === "toc-column-6") {
      setColors((prev) => ({ ...prev, column6: value }))
    }

    // Set the background color CSS variable
    document.documentElement.style.setProperty(`--${variable}-bg`, value)

    // Set the text color CSS variable based on the background color
    const textColor = getTextColor(value)
    document.documentElement.style.setProperty(`--${variable}-text`, textColor)
  }

  // Function to update all column colors at once
  const updateAllColumnColors = (value: string) => {
    // Update state for all columns
    setColors((prev) => ({
      ...prev,
      column1: value,
      column2: value,
      column3: value,
      column4: value,
      column5: value,
      column6: value,
    }))

    // Update CSS variables for all columns
    const textColor = getTextColor(value)
    for (let i = 1; i <= 6; i++) {
      document.documentElement.style.setProperty(`--toc-column-${i}-bg`, value)
      document.documentElement.style.setProperty(`--toc-column-${i}-text`, textColor)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customize Color Theme</DialogTitle>
          <DialogDescription>Customize the colors of your Theory of Change diagram.</DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="header" onValueChange={setActiveTab} value={activeTab}>
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="header">Header & Top</TabsTrigger>
            <TabsTrigger value="flow">Flow Elements</TabsTrigger>
            <TabsTrigger value="columns">Columns</TabsTrigger>
          </TabsList>

          <TabsContent value="header" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="header-color">Header Background</Label>
                <div className="flex gap-2">
                  <Input
                    id="header-color"
                    type="color"
                    value={colors.header}
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-header", e.target.value)}
                  />
                  <div
                    className="flex-1 h-10 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: colors.header,
                      color: getTextColor(colors.header),
                    }}
                  >
                    Preview
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="need-color">Need/Vision/Purpose</Label>
                <div className="flex gap-2">
                  <Input
                    id="need-color"
                    type="color"
                    value={colors.need}
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-need", e.target.value)}
                  />
                  <div
                    className="flex-1 h-10 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: colors.need,
                      color: getTextColor(colors.need),
                    }}
                  >
                    Preview
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="flow" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="flow-color">Flow Elements</Label>
                <div className="flex gap-2">
                  <Input
                    id="flow-color"
                    type="color"
                    value={colors.flow}
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-flow", e.target.value)}
                  />
                  <div
                    className="flex-1 h-10 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: colors.flow,
                      color: getTextColor(colors.flow),
                    }}
                  >
                    Preview
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grouping-color">Grouping Boxes</Label>
                <div className="flex gap-2">
                  <Input
                    id="grouping-color"
                    type="color"
                    value={colors.grouping}
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-grouping", e.target.value)}
                  />
                  <div
                    className="flex-1 h-10 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: colors.grouping,
                      color: getTextColor(colors.grouping),
                    }}
                  >
                    Preview
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="columns" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="all-columns-color">All Columns</Label>
                <div className="flex gap-2">
                  <Input
                    id="all-columns-color"
                    type="color"
                    value={colors.column1} // Use column1 as the reference
                    className="w-12 h-10 p-1"
                    onChange={(e) => updateAllColumnColors(e.target.value)}
                  />
                  <div
                    className="flex-1 h-10 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: colors.column1,
                      color: getTextColor(colors.column1),
                    }}
                  >
                    Apply to all columns
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="column1-color">Resources</Label>
                  <div className="flex gap-2">
                    <Input
                      id="column1-color"
                      type="color"
                      value={colors.column1}
                      className="w-12 h-10 p-1"
                      onChange={(e) => handleColorChange("toc-column-1", e.target.value)}
                    />
                    <div
                      className="flex-1 h-10 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: colors.column1,
                        color: getTextColor(colors.column1),
                      }}
                    >
                      Preview
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="column5-color">Long-term Outcomes</Label>
                  <div className="flex gap-2">
                    <Input
                      id="column5-color"
                      type="color"
                      value={colors.column5}
                      className="w-12 h-10 p-1"
                      onChange={(e) => handleColorChange("toc-column-5", e.target.value)}
                    />
                    <div
                      className="flex-1 h-10 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: colors.column5,
                        color: getTextColor(colors.column5),
                      }}
                    >
                      Preview
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="column6-color">Impact</Label>
                  <div className="flex gap-2">
                    <Input
                      id="column6-color"
                      type="color"
                      value={colors.column6}
                      className="w-12 h-10 p-1"
                      onChange={(e) => handleColorChange("toc-column-6", e.target.value)}
                    />
                    <div
                      className="flex-1 h-10 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: colors.column6,
                        color: getTextColor(colors.column6),
                      }}
                    >
                      Preview
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>Apply Changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
