"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
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

  // This would be connected to a context in a real implementation
  const handleColorChange = (variable: string, value: string) => {
    document.documentElement.style.setProperty(`--${variable}`, value)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Customize Color Theme</DialogTitle>
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
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-header", e.target.value)}
                  />
                  <div className="flex-1 h-10 toc-header rounded"></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="top-boxes-color">Need/Vision/Purpose</Label>
                <div className="flex gap-2">
                  <Input
                    id="top-boxes-color"
                    type="color"
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-need", e.target.value)}
                  />
                  <div className="flex-1 h-10 toc-need rounded"></div>
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
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-flow", e.target.value)}
                  />
                  <div className="flex-1 h-10 toc-flow rounded"></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="grouping-color">Grouping Boxes</Label>
                <div className="flex gap-2">
                  <Input
                    id="grouping-color"
                    type="color"
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-grouping", e.target.value)}
                  />
                  <div className="flex-1 h-10 toc-grouping rounded"></div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="columns" className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="column1-color">Inputs/Resources</Label>
                <div className="flex gap-2">
                  <Input
                    id="column1-color"
                    type="color"
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-column-1", e.target.value)}
                  />
                  <div className="flex-1 h-10 toc-column-1 rounded"></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="column5-color">Long-term Outcomes</Label>
                <div className="flex gap-2">
                  <Input
                    id="column5-color"
                    type="color"
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-column-5", e.target.value)}
                  />
                  <div className="flex-1 h-10 toc-column-5 rounded"></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="column6-color">Impact</Label>
                <div className="flex gap-2">
                  <Input
                    id="column6-color"
                    type="color"
                    className="w-12 h-10 p-1"
                    onChange={(e) => handleColorChange("toc-column-6", e.target.value)}
                  />
                  <div className="flex-1 h-10 toc-column-6 rounded"></div>
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
