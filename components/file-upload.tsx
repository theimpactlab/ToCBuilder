"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Upload, Loader2, FileText, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface FileUploadProps {
  onFileUpload: (file: File) => void
  accept?: string
  maxSize?: number
}

export function FileUpload({
  onFileUpload,
  accept = ".pdf,.doc,.docx,.txt",
  maxSize = 5 * 1024 * 1024, // 5MB
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { toast } = useToast()

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match(accept.replace(/\./g, "").split(",").join("|"))) {
      toast({
        title: "Invalid file type",
        description: `Please upload a file with one of these formats: ${accept}`,
        variant: "destructive",
      })
      return
    }

    if (file.size > maxSize) {
      toast({
        title: "File too large",
        description: `Maximum file size is ${maxSize / (1024 * 1024)}MB`,
        variant: "destructive",
      })
      return
    }

    setFile(file)
    setIsUploading(true)

    // Simulate upload process
    setTimeout(() => {
      onFileUpload(file)
      setIsUploading(false)
    }, 1000)
  }

  const removeFile = () => {
    setFile(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div>
      {!file ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileInput} accept={accept} />
          <Upload className="mx-auto h-10 w-10 text-gray-400" />
          <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Drag and drop or click to upload</p>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} className="mt-2">
            Select File
          </Button>
        </div>
      ) : (
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center space-x-3">
            <FileText className="h-8 w-8 text-blue-500" />
            <div className="space-y-1">
              <p className="text-sm font-medium">{file.name}</p>
              <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            {isUploading ? (
              <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
            ) : (
              <Button variant="ghost" size="icon" onClick={removeFile} className="h-8 w-8">
                <X className="h-4 w-4" />
                <span className="sr-only">Remove file</span>
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
