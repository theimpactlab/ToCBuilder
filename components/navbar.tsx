"use client"

import { useState } from "react"
import { ModeToggle } from "./mode-toggle"
import { Button } from "@/components/ui/button"
import {
  Download,
  Upload,
  Save,
  Share2,
  Settings,
  FileText,
  Palette,
  FileDown,
  HelpCircle,
  RefreshCw,
} from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ColorThemeDialog } from "./color-theme-dialog"
import { PdfExportDialog } from "./pdf-export-dialog"
import { OpenAIQuotaGuide } from "./openai-quota-guide"
import { useColorTheme } from "@/lib/color-theme-context"
import { useToast } from "@/hooks/use-toast"

export function Navbar() {
  const [isColorDialogOpen, setIsColorDialogOpen] = useState(false)
  const [isPdfExportDialogOpen, setIsPdfExportDialogOpen] = useState(false)
  const [isQuotaGuideOpen, setIsQuotaGuideOpen] = useState(false)
  const { resetColors } = useColorTheme()
  const { toast } = useToast()

  const handleResetColors = () => {
    resetColors()
    toast({
      title: "Colors Reset",
      description: "The color theme has been reset to default.",
    })
  }

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FileText className="h-6 w-6" />
          <h1 className="text-xl font-bold">Theory of Change Builder</h1>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Import
          </Button>

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
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>

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
    </header>
  )
}
