"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { ImageIcon, X } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"

interface LogoUploadProps {
  onLogoChange: (logoUrl: string | null) => void
  initialLogo?: string | null
}

export function LogoUpload({ onLogoChange, initialLogo = null }: LogoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [logoUrl, setLogoUrl] = useState<string | null>(initialLogo)
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
    // Check if file is an image
    if (!file.type.startsWith("image/")) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPEG, PNG, SVG, etc.)",
        variant: "destructive",
      })
      return
    }

    // Check file size (limit to 2MB)
    if (file.size > 2 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Maximum file size is 2MB",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    // Create a URL for the image file
    const url = URL.createObjectURL(file)
    setLogoUrl(url)
    onLogoChange(url)
    setIsUploading(false)

    // In a real app, you would upload the file to a server here
    // and use the returned URL instead of a local object URL
  }

  const removeLogo = () => {
    if (logoUrl) {
      URL.revokeObjectURL(logoUrl)
    }
    setLogoUrl(null)
    onLogoChange(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="w-full h-full">
      {!logoUrl ? (
        <div
          className={`border-2 border-dashed rounded-lg p-4 text-center h-full flex flex-col items-center justify-center ${
            isDragging ? "border-primary bg-primary/5" : "border-gray-300 dark:border-gray-600"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <input type="file" className="hidden" ref={fileInputRef} onChange={handleFileInput} accept="image/*" />
          <ImageIcon className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Upload your logo</p>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            Select Image
          </Button>
        </div>
      ) : (
        <div className="relative h-full flex items-center justify-center border rounded-lg p-2 bg-white dark:bg-gray-800">
          <div className="relative w-full h-full flex items-center justify-center">
            <Image
              src={logoUrl || "/placeholder.svg"}
              alt="Organization Logo"
              className="max-w-full max-h-full object-contain"
              width={150}
              height={150}
            />
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={removeLogo}
            className="absolute top-1 right-1 h-6 w-6 rounded-full bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600"
          >
            <X className="h-3 w-3" />
            <span className="sr-only">Remove logo</span>
          </Button>
        </div>
      )}
    </div>
  )
}
