"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Spinner } from "@/components/ui/spinner"
import { exportToPDF } from "@/lib/pdf-export"
import { useToast } from "@/hooks/use-toast"

interface PdfExportDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function PdfExportDialog({ open, onOpenChange }: PdfExportDialogProps) {
  const [filename, setFilename] = useState("theory-of-change.pdf")
  const [isExporting, setIsExporting] = useState(false)
  const { toast } = useToast()

  const handleExport = async () => {
    setIsExporting(true)
    try {
      const success = await exportToPDF("toc-diagram", filename)

      if (success) {
        toast({
          title: "Export successful",
          description: "Your Theory of Change diagram has been exported as a PDF.",
        })
        onOpenChange(false)
      } else {
        toast({
          title: "Export failed",
          description: "There was an error exporting your diagram. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Error in PDF export:", error)
      toast({
        title: "Export failed",
        description: "There was an error exporting your diagram. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsExporting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Export as PDF</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="filename">Filename</Label>
            <Input
              id="filename"
              value={filename}
              onChange={(e) => setFilename(e.target.value)}
              disabled={isExporting}
            />
          </div>

          <div className="text-sm text-muted-foreground">The entire diagram will be exported as a PDF document.</div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={isExporting}>
            Cancel
          </Button>
          <Button onClick={handleExport} disabled={isExporting}>
            {isExporting ? (
              <>
                <Spinner className="mr-2" size="sm" />
                Exporting...
              </>
            ) : (
              "Export"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
