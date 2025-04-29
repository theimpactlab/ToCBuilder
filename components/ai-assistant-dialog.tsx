"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, Wand2, AlertCircle, RefreshCw } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { APP_NAME } from "@/lib/env"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface AiAssistantDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onApplySuggestions: (suggestions: any) => void
}

export function AiAssistantDialog({ open, onOpenChange, onApplySuggestions }: AiAssistantDialogProps) {
  const [activeTab, setActiveTab] = useState("text")
  const [inputText, setInputText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [aiSuggestions, setAiSuggestions] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [diagnosticInfo, setDiagnosticInfo] = useState<any>(null)
  const [useMockApi, setUseMockApi] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  // Run diagnostics when dialog opens
  useEffect(() => {
    if (open) {
      runDiagnostics()
    }
  }, [open])

  const runDiagnostics = async () => {
    try {
      const response = await fetch("/api/diagnose")
      const data = await response.json()
      setDiagnosticInfo(data)

      if (data.status === "error") {
        setError(`Diagnostic error: ${data.message}`)
        setUseMockApi(true)
      } else {
        setUseMockApi(false)
      }
    } catch (error) {
      console.error("Error running diagnostics:", error)
      setDiagnosticInfo({ status: "error", message: "Failed to run diagnostics" })
      setUseMockApi(true)
    }
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Clear previous error state
    setError(null)

    // In a real implementation, this would process the file
    // For now, we'll just show a toast
    toast({
      title: "File uploaded",
      description: `${file.name} has been uploaded and is being processed.`,
    })

    // Simulate processing
    setIsLoading(true)
    setTimeout(() => {
      setIsLoading(false)
      setAiSuggestions(
        "Based on the uploaded document, I recommend the following changes to your Theory of Change:\n\n1. Update your Need statement to focus more on the root causes identified in the document\n\n2. Add a new group for 'Stakeholder Engagement' with specific activities\n\n3. Refine your long-term outcomes to better align with the impact metrics mentioned in section 3.2",
      )
    }, 2000)
  }

  // Update the handleTextAnalysis function to properly handle the API call
  const handleTextAnalysis = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      })
      return
    }

    // Clear previous error and suggestions
    setError(null)
    setAiSuggestions("")
    setIsLoading(true)

    try {
      // Use either the real API or the mock API based on diagnostics
      const endpoint = useMockApi ? "/api/mock-analyze" : "/api/analyze"

      // Use the API route instead of direct client-side API calls
      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text: inputText }),
      })

      const data = await response.json()

      if (!response.ok) {
        const errorMessage = data.message || data.error || "Failed to analyze text"
        console.error("API error:", data)

        // If real API fails, try the mock API as fallback
        if (!useMockApi) {
          setUseMockApi(true)
          toast({
            title: "Using fallback mode",
            description: "The AI service is unavailable. Using simulated responses instead.",
          })
          // Retry with mock API
          return handleTextAnalysis()
        }

        throw new Error(errorMessage)
      }

      setAiSuggestions(data.suggestions)

      if (useMockApi) {
        toast({
          title: "Using simulated AI",
          description: "These suggestions are simulated and not from the actual AI service.",
        })
      }
    } catch (error) {
      console.error("Error generating AI suggestions:", error)
      setError(error instanceof Error ? error.message : "Failed to generate AI suggestions")
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please check the error details.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleApplySuggestions = () => {
    // In a real implementation, this would parse the AI suggestions
    // and apply them to the diagram
    onApplySuggestions({
      suggestions: aiSuggestions,
    })
  }

  // Reset state when dialog opens/closes
  useEffect(() => {
    if (!open) {
      // Reset state when dialog closes
      setError(null)
      setAiSuggestions("")
      setInputText("")
      setIsLoading(false)
      setDiagnosticInfo(null)
    }
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Assistant for {APP_NAME}
            {useMockApi && <span className="text-xs font-normal ml-2">(Simulation Mode)</span>}
          </DialogTitle>
          <DialogDescription>Get AI-powered suggestions to improve your Theory of Change diagram.</DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription className="space-y-2">
              <p>{error}</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={runDiagnostics} className="h-8">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Run Diagnostics
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {useMockApi && !error && (
          <Alert className="mt-4">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Using Simulation Mode</AlertTitle>
            <AlertDescription>
              <p>The AI service is currently unavailable. Using simulated responses instead.</p>
              <div className="flex gap-2 mt-2">
                <Button size="sm" variant="outline" onClick={runDiagnostics} className="h-8">
                  <RefreshCw className="h-3 w-3 mr-1" />
                  Try Real AI
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="text" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="text">Text Input</TabsTrigger>
            <TabsTrigger value="document">Upload Document</TabsTrigger>
          </TabsList>

          <TabsContent value="text" className="space-y-4">
            <div className="space-y-2">
              <Textarea
                placeholder="Enter text about your organization, mission, programs, or desired outcomes..."
                className="min-h-[150px]"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
              />
              <Button onClick={handleTextAnalysis} disabled={isLoading || !inputText.trim()} className="w-full">
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    {useMockApi ? "Simulate Analysis" : "Analyze Text"}
                  </>
                )}
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="document" className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <input
                type="file"
                className="hidden"
                ref={fileInputRef}
                onChange={handleFileUpload}
                accept=".pdf,.doc,.docx,.txt"
              />
              <Upload className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-semibold">Upload a document</h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Drag and drop or click to upload PDF, Word, or text files
              </p>
              <Button
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                className="mt-4"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Processing...
                  </>
                ) : (
                  "Select File"
                )}
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {aiSuggestions && (
          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">{useMockApi ? "Simulated Suggestions:" : "AI Suggestions:"}</h3>
            <div className="bg-muted p-3 rounded-md text-sm whitespace-pre-line">{aiSuggestions}</div>
          </div>
        )}

        <DialogFooter className="flex justify-between mt-6">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleApplySuggestions} disabled={!aiSuggestions || isLoading}>
            Apply Suggestions
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
