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
import { useToast } from "@/hooks/use-toast"
import { FolderOpen, Upload, Loader2, FileText } from "lucide-react"
import { fileSystemStorage } from "@/lib/file-system-storage"
import { useTheoryOfChangeStore } from "@/lib/store"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoadFromFileDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDiagramLoaded: (diagramName: string) => void
}

export function LoadFromFileDialog({ open, onOpenChange, onDiagramLoaded }: LoadFromFileDialogProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  // Add a client-side check for the file system support
  const [isFileSystemSupported, setIsFileSystemSupported] = useState(false)

  // Check file system support on client side only
  useEffect(() => {
    setIsFileSystemSupported(fileSystemStorage.isSupported())
  }, [])

  const handleLoadFromFile = async () => {
    setIsLoading(true)

    try {
      const diagram = await fileSystemStorage.loadDiagramFromFile()

      if (!diagram) {
        // User cancelled the file selection
        setIsLoading(false)
        return
      }

      // Load diagram into store
      const store = useTheoryOfChangeStore.getState()
      store.updateHeaderData(diagram.headerData)
      store.updateFlowData(diagram.flowData)

      // Replace groups and columns
      // First, clear existing groups
      while (store.groups.length > 0) {
        store.removeGroup(store.groups[0].id)
      }

      // Then add new groups
      diagram.groups.forEach(() => {
        store.addGroup()
      })

      // Update group names
      diagram.groups.forEach((group, index) => {
        if (store.groups[index]) {
          store.updateGroupName(store.groups[index].id, group.name)
        }
      })

      // Update column content
      Object.keys(diagram.columns).forEach((columnKey) => {
        const column = columnKey as keyof typeof diagram.columns
        diagram.columns[column].forEach((content, index) => {
          store.updateColumnContent(column, index, content)
        })
      })

      // Update theme colors
      Object.keys(diagram.themeColors).forEach((colorKey) => {
        if (colorKey === "columns") {
          diagram.themeColors.columns.forEach((color, index) => {
            store.updateThemeColor("column", color, index)
          })
        } else {
          const key = colorKey as keyof typeof diagram.themeColors
          if (key !== "columns") {
            store.updateThemeColor(key, diagram.themeColors[key])
          }
        }
      })

      // Update logo and grouping column visibility
      store.setLogoUrl(diagram.logoUrl)

      // Reset grouping column state first, then set it if needed
      if (store.showGroupingColumn !== diagram.showGroupingColumn) {
        store.toggleGroupingColumn()
      }

      toast({
        title: "Diagram loaded",
        description: `"${diagram.name}" has been loaded successfully.`,
      })

      onDiagramLoaded(diagram.name)
      onOpenChange(false)
    } catch (error) {
      console.error("Error loading diagram:", error)
      toast({
        title: "Load failed",
        description:
          error instanceof Error ? error.message : "There was an error loading your diagram. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[450px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FolderOpen className="h-5 w-5" />
            Load Diagram from File
          </DialogTitle>
          <DialogDescription>Load a previously saved Theory of Change diagram from your computer.</DialogDescription>
        </DialogHeader>

        <div className="py-6">
          {!isFileSystemSupported && (
            <Alert className="mb-4">
              <Upload className="h-4 w-4" />
              <AlertDescription>
                Your browser doesn't support the File System Access API. You'll need to select the file using a file
                picker.
              </AlertDescription>
            </Alert>
          )}

          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center">
              <FileText className="h-8 w-8 text-muted-foreground" />
            </div>

            <div>
              <h3 className="font-medium">Select a Theory of Change file</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Choose a .toc.json file or any JSON file containing diagram data
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-muted-foreground">Supported formats: .toc.json, .json</p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button onClick={handleLoadFromFile} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                {isFileSystemSupported ? <FolderOpen className="mr-2 h-4 w-4" /> : <Upload className="mr-2 h-4 w-4" />}
                {isFileSystemSupported ? "Browse Files" : "Select File"}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
