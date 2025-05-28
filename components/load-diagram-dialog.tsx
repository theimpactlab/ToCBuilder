"use client"

import type React from "react"

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
import { FolderOpen, Trash2, Loader2, FileText, Clock, Calendar } from "lucide-react"
import { storageService, type DiagramMetadata } from "@/lib/storage-service"
import { useTheoryOfChangeStore } from "@/lib/store"
import { format } from "date-fns"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface LoadDiagramDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onDiagramLoaded: (diagramId: string) => void
}

export function LoadDiagramDialog({ open, onOpenChange, onDiagramLoaded }: LoadDiagramDialogProps) {
  const { toast } = useToast()
  const [diagrams, setDiagrams] = useState<DiagramMetadata[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDiagramId, setSelectedDiagramId] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [diagramToDelete, setDiagramToDelete] = useState<string | null>(null)

  // Load diagrams when dialog opens
  useEffect(() => {
    if (open) {
      loadDiagrams()
    }
  }, [open])

  const loadDiagrams = () => {
    try {
      const diagramMetadata = storageService.getDiagramMetadata()
      // Sort by updated date, newest first
      diagramMetadata.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
      setDiagrams(diagramMetadata)
    } catch (error) {
      console.error("Error loading diagrams:", error)
      toast({
        title: "Error loading diagrams",
        description: "There was a problem loading your saved diagrams.",
        variant: "destructive",
      })
    }
  }

  const handleLoadDiagram = async () => {
    if (!selectedDiagramId) return

    setIsLoading(true)

    try {
      const diagram = storageService.getDiagramById(selectedDiagramId)

      if (!diagram) {
        throw new Error("Diagram not found")
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
      diagram.groups.forEach((group) => {
        store.addGroup()
      })

      // Update group names
      diagram.groups.forEach((group, index) => {
        store.updateGroupName(store.groups[index].id, group.name)
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
      if (diagram.showGroupingColumn) {
        store.toggleGroupingColumn()
      }

      toast({
        title: "Diagram loaded",
        description: `"${diagram.name}" has been loaded successfully.`,
      })

      onDiagramLoaded(selectedDiagramId)
      onOpenChange(false)
    } catch (error) {
      console.error("Error loading diagram:", error)
      toast({
        title: "Load failed",
        description: "There was an error loading your diagram. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const confirmDeleteDiagram = (id: string, e: React.MouseEvent) => {
    e.stopPropagation() // Prevent selecting the diagram
    setDiagramToDelete(id)
    setDeleteDialogOpen(true)
  }

  const handleDeleteDiagram = () => {
    if (!diagramToDelete) return

    try {
      const success = storageService.deleteDiagram(diagramToDelete)

      if (success) {
        toast({
          title: "Diagram deleted",
          description: "The diagram has been deleted successfully.",
        })

        // Refresh the list
        loadDiagrams()

        // If the deleted diagram was selected, clear selection
        if (diagramToDelete === selectedDiagramId) {
          setSelectedDiagramId(null)
        }
      } else {
        throw new Error("Failed to delete diagram")
      }
    } catch (error) {
      console.error("Error deleting diagram:", error)
      toast({
        title: "Delete failed",
        description: "There was an error deleting the diagram. Please try again.",
        variant: "destructive",
      })
    } finally {
      setDeleteDialogOpen(false)
      setDiagramToDelete(null)
    }
  }

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "MMM d, yyyy h:mm a")
    } catch (e) {
      return dateString
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FolderOpen className="h-5 w-5" />
              Load Diagram
            </DialogTitle>
            <DialogDescription>Select a previously saved Theory of Change diagram to load.</DialogDescription>
          </DialogHeader>

          <div className="py-4">
            {diagrams.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <FileText className="mx-auto h-12 w-12 opacity-30 mb-2" />
                <p>No saved diagrams found.</p>
                <p className="text-sm mt-1">Save your current diagram to see it here.</p>
              </div>
            ) : (
              <div className="border rounded-md divide-y">
                {diagrams.map((diagram) => (
                  <div
                    key={diagram.id}
                    className={`p-4 flex justify-between items-center cursor-pointer hover:bg-muted transition-colors ${
                      selectedDiagramId === diagram.id ? "bg-muted" : ""
                    }`}
                    onClick={() => setSelectedDiagramId(diagram.id)}
                  >
                    <div className="flex items-center gap-3">
                      <FileText className="h-5 w-5 text-blue-500" />
                      <div>
                        <p className="font-medium">{diagram.name}</p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Updated: {formatDate(diagram.updatedAt)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            <span>Created: {formatDate(diagram.createdAt)}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={(e) => confirmDeleteDiagram(diagram.id, e)}
                      className="opacity-50 hover:opacity-100"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button onClick={handleLoadDiagram} disabled={isLoading || !selectedDiagramId || diagrams.length === 0}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Loading...
                </>
              ) : (
                <>
                  <FolderOpen className="mr-2 h-4 w-4" />
                  Load Selected
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this diagram. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteDiagram} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
