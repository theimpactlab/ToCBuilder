"use client"

import { useState } from "react"
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
import { useColorTheme } from "@/lib/color-theme-context"

interface ColorThemeDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ColorThemeDialog({ open, onOpenChange }: ColorThemeDialogProps) {
  const [activeTab, setActiveTab] = useState("header")
  const { colors, updateColor, updateAllColumnColors } = useColorTheme()

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
                    onChange={(e) => updateColor("header", e.target.value)}
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
                    onChange={(e) => updateColor("need", e.target.value)}
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
                    onChange={(e) => updateColor("flow", e.target.value)}
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
                    onChange={(e) => updateColor("grouping", e.target.value)}
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
                    value={colors.columns[0]} // Use first column as reference
                    className="w-12 h-10 p-1"
                    onChange={(e) => updateAllColumnColors(e.target.value)}
                  />
                  <div
                    className="flex-1 h-10 rounded flex items-center justify-center"
                    style={{
                      backgroundColor: colors.columns[0],
                      color: getTextColor(colors.columns[0]),
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
                      value={colors.columns[0]}
                      className="w-12 h-10 p-1"
                      onChange={(e) => updateColor("column", e.target.value, 0)}
                    />
                    <div
                      className="flex-1 h-10 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: colors.columns[0],
                        color: getTextColor(colors.columns[0]),
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
                      value={colors.columns[4]}
                      className="w-12 h-10 p-1"
                      onChange={(e) => updateColor("column", e.target.value, 4)}
                    />
                    <div
                      className="flex-1 h-10 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: colors.columns[4],
                        color: getTextColor(colors.columns[4]),
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
                      value={colors.columns[5]}
                      className="w-12 h-10 p-1"
                      onChange={(e) => updateColor("column", e.target.value, 5)}
                    />
                    <div
                      className="flex-1 h-10 rounded flex items-center justify-center"
                      style={{
                        backgroundColor: colors.columns[5],
                        color: getTextColor(colors.columns[5]),
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
