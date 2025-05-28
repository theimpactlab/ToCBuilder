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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { Save, Download, Loader2, FolderOpen, FileText, FileSpreadsheet } from "lucide-react"
import { fileSystemStorage } from "@/lib/file-system-storage"
import { useTheoryOfChangeStore } from "@/lib/store"
import { v4 as uuidv4 } from "uuid"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface SaveToFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SaveToFileDialog({ open, onOpenChange }: SaveToFileDialogProps) {
  const { toast } = useToast()
  const [fileName, setFileName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const [activeTab, setActiveTab] = useState("json")
  const { headerData, flowData, groups, columns, themeColors, logoUrl, showGroupingColumn } = useTheoryOfChangeStore()

  // Add a client-side check for the file system support
  const [isFileSystemSupported, setIsFileSystemSupported] = useState(false)

  // Check file system support on client side only
  useEffect(() => {
    setIsFileSystemSupported(fileSystemStorage.isSupported())
  }, [])

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      setFileName(headerData.title || "My Theory of Change")
    }
    onOpenChange(open)
  }

  const createDiagramObject = () => {
    return {
      id: uuidv4(),
      name: fileName.trim(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      headerData,
      flowData,
      groups,
      columns,
      themeColors,
      logoUrl,
      showGroupingColumn,
    }
  }

  const handleSaveAsJSON = async () => {
    if (!fileName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your diagram",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const diagram = createDiagramObject()
      const success = await fileSystemStorage.saveDiagramToFile(diagram, {
        suggestedName: `${fileName.trim()}.toc.json`,
        startIn: "documents",
      })

      if (success) {
        toast({
          title: "Diagram saved",
          description: `"${fileName}" has been saved to your chosen location.`,
        })
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error saving diagram:", error)
      toast({
        title: "Save failed",
        description: "There was an error saving your diagram. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleExportAs = async (format: "csv" | "txt") => {
    if (!fileName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your diagram",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      const diagram = createDiagramObject()
      const success = await fileSystemStorage.exportDiagram(diagram, format, {
        suggestedName: `${fileName.trim()}.${format}`,
        startIn: "documents",
      })

      if (success) {
        toast({
          title: "Export successful",
          description: `"${fileName}" has been exported as ${format.toUpperCase()}.`,
        })
        onOpenChange(false)
      }
    } catch (error) {
      console.error("Error exporting diagram:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your diagram. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Save className="h-5 w-5" />
            Save Diagram to File
          </DialogTitle>
          <DialogDescription>Save your Theory of Change diagram to your computer in various formats.</DialogDescription>
        </DialogHeader>

        {!isFileSystemSupported && (
          <Alert>
            <Download className="h-4 w-4" />
            <AlertDescription>
              Your browser doesn't support the File System Access API. Files will be downloaded to your default download
              folder.
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="file-name">File Name</Label>
            <Input
              id="file-name"
              placeholder="My Theory of Change"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              autoFocus
            />
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="json" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                JSON
              </TabsTrigger>
              <TabsTrigger value="csv" className="flex items-center gap-2">
                <FileSpreadsheet className="h-4 w-4" />
                CSV
              </TabsTrigger>
              <TabsTrigger value="txt" className="flex items-center gap-2">
                <FileText className="h-4 w-4" />
                Text
              </TabsTrigger>
            </TabsList>

            <TabsContent value="json" className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>Save as a JSON file that can be loaded back into the Theory of Change Builder.</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="secondary">Recommended</Badge>
                  <span className="text-xs">Preserves all formatting and colors</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="csv" className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>Export as a CSV file that can be opened in spreadsheet applications like Excel.</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">Data Only</Badge>
                  <span className="text-xs">Content without formatting</span>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="txt" className="space-y-3">
              <div className="text-sm text-muted-foreground">
                <p>Export as a plain text file for easy reading and sharing.</p>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline">Human Readable</Badge>
                  <span className="text-xs">Easy to read and print</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>

          {activeTab === "json" ? (
            <Button onClick={handleSaveAsJSON} disabled={isSaving || !fileName.trim()}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  {isFileSystemSupported ? (
                    <FolderOpen className="mr-2 h-4 w-4" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  {isFileSystemSupported ? "Save to Folder" : "Download"}
                </>
              )}
            </Button>
          ) : (
            <Button onClick={() => handleExportAs(activeTab as "csv" | "txt")} disabled={isSaving || !fileName.trim()}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Exporting...
                </>
              ) : (
                <>
                  {isFileSystemSupported ? (
                    <FolderOpen className="mr-2 h-4 w-4" />
                  ) : (
                    <Download className="mr-2 h-4 w-4" />
                  )}
                  Export as {activeTab.toUpperCase()}
                </>
              )}
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
