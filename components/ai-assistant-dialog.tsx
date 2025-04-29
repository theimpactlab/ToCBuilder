"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Upload, Wand2 } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

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
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

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

  const handleTextAnalysis = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input required",
        description: "Please enter some text to analyze.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Use the AI SDK with Grok to generate suggestions
      const { text } = await generateText({
        model: xai("grok-1"),
        prompt: `You are an expert in Theory of Change methodology for social impact organizations. 
        Analyze the following text and provide specific suggestions to improve a Theory of Change diagram.
        Focus on identifying: key needs, activities, outputs, outcomes, and impact.
        Format your response as 3-5 specific, actionable recommendations.
        
        Text to analyze: ${inputText}`,
        maxTokens: 500,
      })

      setAiSuggestions(text)
    } catch (error) {
      console.error("Error generating AI suggestions:", error)
      toast({
        title: "Error",
        description: "Failed to generate AI suggestions. Please try again.",
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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            AI Assistant
          </DialogTitle>
        </DialogHeader>

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
                    Analyze Text
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
            <h3 className="text-sm font-medium mb-2">AI Suggestions:</h3>
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
