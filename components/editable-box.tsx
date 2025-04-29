"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { cn } from "@/lib/utils"

interface EditableBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  multiline?: boolean
  onHeightChange?: (height: number) => void
}

export function EditableBox({
  value,
  onChange,
  placeholder = "Click to edit...",
  className,
  multiline = false,
  onHeightChange,
}: EditableBoxProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  useEffect(() => {
    if (multiline && textareaRef.current && onHeightChange) {
      // Reset height to auto to get the correct scrollHeight
      textareaRef.current.style.height = "auto"
      const scrollHeight = textareaRef.current.scrollHeight
      textareaRef.current.style.height = `${scrollHeight}px`
      onHeightChange(scrollHeight)
    }
  }, [text, multiline, onHeightChange])

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange(text)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setText(e.target.value)

    // Adjust height for textarea
    if (multiline && e.target instanceof HTMLTextAreaElement) {
      e.target.style.height = "auto"
      e.target.style.height = `${e.target.scrollHeight}px`
      onHeightChange?.(e.target.scrollHeight)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !multiline) {
      setIsEditing(false)
      onChange(text)
    }
    if (e.key === "Escape") {
      setText(value)
      setIsEditing(false)
    }
  }

  // Get the computed text color from the parent to use in the input/textarea
  const getTextColor = () => {
    if (containerRef.current) {
      const computedStyle = window.getComputedStyle(containerRef.current)
      return computedStyle.color
    }
    return "inherit"
  }

  return (
    <div className="w-full h-full" ref={containerRef}>
      {isEditing ? (
        multiline ? (
          <textarea
            ref={textareaRef}
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full h-full p-1 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500",
              className,
            )}
            rows={3}
            placeholder={placeholder}
            style={{
              overflow: "hidden",
              minHeight: "100%",
              backgroundColor: "transparent",
              color: "inherit",
            }}
          />
        ) : (
          <input
            ref={inputRef as React.RefObject<HTMLInputElement>}
            type="text"
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn("w-full p-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-500", className)}
            placeholder={placeholder}
            style={{
              backgroundColor: "transparent",
              color: "inherit",
            }}
          />
        )
      ) : (
        <div
          onClick={handleClick}
          className={cn("w-full h-full min-h-[24px] cursor-text overflow-auto", !text && "opacity-70", className)}
        >
          {text || placeholder}
        </div>
      )}
    </div>
  )
}
