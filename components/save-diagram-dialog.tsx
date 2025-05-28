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
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import { SaveIcon, Loader2 } from "lucide-react"
import { storageService, type SavedDiagram } from "@/lib/storage-service"
import { useTheoryOfChangeStore } from "@/lib/store"
import { v4 as uuidv4 } from "uuid"

interface SaveDiagramDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentDiagramId?: string | null
}

export function SaveDiagramDialog({ open, onOpenChange, currentDiagramId = null }: SaveDiagramDialogProps) {
  const { toast } = useToast()
  const [diagramName, setDiagramName] = useState("")
  const [isSaving, setIsSaving] = useState(false)
  const { headerData, flowData, groups, columns, themeColors, logoUrl, showGroupingColumn } = useTheoryOfChangeStore()

  // Reset form when dialog opens
  const handleOpenChange = (open: boolean) => {
    if (open) {
      // If editing an existing diagram, load its name
      if (currentDiagramId) {
        const existingDiagram = storageService.getDiagramById(currentDiagramId)
        if (existingDiagram) {
          setDiagramName(existingDiagram.name)
        }
      } else {
        setDiagramName("")
      }
    }
    onOpenChange(open)
  }

  const handleSave = async () => {
    if (!diagramName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter a name for your diagram",
        variant: "destructive",
      })
      return
    }

    setIsSaving(true)

    try {
      // Create diagram object
      const diagram: SavedDiagram = {
        id: currentDiagramId || uuidv4(),
        name: diagramName.trim(),
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

      // Save to storage
      storageService.saveDiagram(diagram)

      toast({
        title: "Diagram saved",
        description: `"${diagramName}" has been saved successfully.`,
      })

      onOpenChange(false)
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

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <SaveIcon className="h-5 w-5" />
            Save Diagram
          </DialogTitle>
          <DialogDescription>Save your Theory of Change diagram to access it later.</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="diagram-name">Diagram Name</Label>
            <Input
              id="diagram-name"
              placeholder="My Theory of Change"
              value={diagramName}
              onChange={(e) => setDiagramName(e.target.value)}
              autoFocus
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving || !diagramName.trim()}>
            {isSaving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <SaveIcon className="mr-2 h-4 w-4" />
                Save Diagram
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
