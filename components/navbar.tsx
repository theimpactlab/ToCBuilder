"use client"

import { useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import {
  Download,
  Save,
  Share2,
  Settings,
  FileText,
  Palette,
  FileDown,
  HelpCircle,
  RefreshCw,
  FolderOpen,
  Plus,
  HardDrive,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import { ColorThemeDialog } from "./color-theme-dialog"
import { PdfExportDialog } from "./pdf-export-dialog"
import { OpenAIQuotaGuide } from "./openai-quota-guide"
import { SaveDiagramDialog } from "./save-diagram-dialog"
import { LoadDiagramDialog } from "./load-diagram-dialog"
import { SaveToFileDialog } from "./save-to-file-dialog"
import { LoadFromFileDialog } from "./load-from-file-dialog"
import { useColorTheme } from "@/lib/color-theme-context"
import { useToast } from "@/hooks/use-toast"
import { useTheoryOfChangeStore } from "@/lib/store"

export function Navbar() {
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [isPdfExportDialogOpen, setIsPdfExportDialogOpen] = useState(false)
  const [isQuotaGuideOpen, setIsQuotaGuideOpen] = useState(false)
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false)
  const [isLoadDialogOpen, setIsLoadDialogOpen] = useState(false)
  const [isSaveToFileDialogOpen, setIsSaveToFileDialogOpen] = useState(false)
  const [isLoadFromFileDialogOpen, setIsLoadFromFileDialogOpen] = useState(false)
  const [currentDiagramId, setCurrentDiagramId] = useState<string | null>(null)
  const [currentDiagramName, setCurrentDiagramName] = useState<string | null>(null)
  const { resetColors } = useColorTheme()
  const resetToDefault = useTheoryOfChangeStore((state) => state.resetToDefault)
  const { toast } = useToast()

  const handleResetColors = () => {
    resetColors()
    toast({
      title: "Colors Reset",
      description: "The color theme has been reset to default.",
    })
  }

  const handleNewDiagram = () => {
    if (confirm("Are you sure you want to create a new diagram? Any unsaved changes will be lost.")) {
      resetToDefault()
      setCurrentDiagramId(null)
      setCurrentDiagramName(null)
      toast({
        title: "New Diagram Created",
        description: "Started with a fresh diagram.",
      })
    }
  }

  const handleDiagramLoaded = (diagramId: string) => {
    setCurrentDiagramId(diagramId)
  }

  const handleFileLoaded = (diagramName: string) => {
    setCurrentDiagramName(diagramName)
    setCurrentDiagramId(null) // Clear browser storage ID since this is from file
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <div>
            <h1 className="text-xl font-bold">Theory of Change Builder</h1>
            {currentDiagramName && <p className="text-xs text-muted-foreground">Current: {currentDiagramName}</p>}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handleNewDiagram}>
            <Plus className="h-4 w-4 mr-2" />
            New
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <FolderOpen className="h-4 w-4 mr-2" />
                Open
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsLoadFromFileDialogOpen(true)}>
                <HardDrive className="h-4 w-4 mr-2" />
                From Computer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsLoadDialogOpen(true)}>
                <FileText className="h-4 w-4 mr-2" />
                From Browser Storage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsSaveToFileDialogOpen(true)}>
                <HardDrive className="h-4 w-4 mr-2" />
                To Computer
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setIsSaveDialogOpen(true)}>
                <FileText className="h-4 w-4 mr-2" />
                To Browser Storage
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsPdfExportDialogOpen(true)}>
                <FileDown className="h-4 w-4 mr-2" />
                Export as PDF
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setIsColorDialogOpen(true)}>
                <Palette className="h-4 w-4 mr-2" />
                Color Theme
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleResetColors}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reset Colors
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setIsQuotaGuideOpen(true)}>
                <HelpCircle className="h-4 w-4 mr-2" />
                OpenAI API Help
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ModeToggle />
        </div>
      </div>

      <ColorThemeDialog open={isColorDialogOpen} onOpenChange={setIsColorDialogOpen} />
      <PdfExportDialog open={isPdfExportDialogOpen} onOpenChange={setIsPdfExportDialogOpen} />
      <OpenAIQuotaGuide open={isQuotaGuideOpen} onOpenChange={setIsQuotaGuideOpen} />

      {/* Browser Storage Dialogs */}
      <SaveDiagramDialog
        open={isSaveDialogOpen}
        onOpenChange={setIsSaveDialogOpen}
        currentDiagramId={currentDiagramId}
      />
      <LoadDiagramDialog
        open={isLoadDialogOpen}
        onOpenChange={setIsLoadDialogOpen}
        onDiagramLoaded={handleDiagramLoaded}
      />

      {/* File System Dialogs */}
      <SaveToFileDialog open={isSaveToFileDialogOpen} onOpenChange={setIsSaveToFileDialogOpen} />
      <LoadFromFileDialog
        open={isLoadFromFileDialogOpen}
        onOpenChange={setIsLoadFromFileDialogOpen}
        onDiagramLoaded={handleFileLoaded}
      />
    </header>
  )
}
