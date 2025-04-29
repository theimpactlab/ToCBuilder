"use client"

import type React from "react"

import { useState, useRef, useEffect, useCallback, memo } from "react"
import { cn } from "@/lib/utils"

interface EditableBoxProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  className?: string
  multiline?: boolean
  onHeightChange?: (height: number) => void
}

// Use memo to prevent unnecessary re-renders
export const EditableBox = memo(function EditableBox({
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

  // Update text when value prop changes
  useEffect(() => {
    setText(value)
  }, [value])

  // Focus input when editing starts
  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  // Update height for multiline inputs
  const updateHeight = useCallback(() => {
    if (multiline && textareaRef.current && onHeightChange) {
      // Use requestAnimationFrame for smoother height adjustments
      requestAnimationFrame(() => {
        if (textareaRef.current) {
          // Reset height to auto to get the correct scrollHeight
          textareaRef.current.style.height = "auto"
          const scrollHeight = textareaRef.current.scrollHeight
          textareaRef.current.style.height = `${scrollHeight}px`
          onHeightChange(scrollHeight)
        }
      })
    }
  }, [multiline, onHeightChange])

  // Update height when text changes
  useEffect(() => {
    updateHeight()
  }, [text, updateHeight])

  const handleClick = useCallback(() => {
    setIsEditing(true)
  }, [])

  const handleBlur = useCallback(() => {
    setIsEditing(false)
    onChange(text)
  }, [onChange, text])

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setText(e.target.value)
  }, [])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && !multiline) {
        setIsEditing(false)
        onChange(text)
      }
      if (e.key === "Escape") {
        setText(value)
        setIsEditing(false)
      }
    },
    [multiline, onChange, text, value],
  )

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
})
