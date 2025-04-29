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
}

export function EditableBox({
  value,
  onChange,
  placeholder = "Click to edit...",
  className,
  multiline = false,
}: EditableBoxProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [text, setText] = useState(value)
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)

  useEffect(() => {
    setText(value)
  }, [value])

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isEditing])

  const handleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = () => {
    setIsEditing(false)
    onChange(text)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setText(e.target.value)
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

  return (
    <div className="w-full">
      {isEditing ? (
        multiline ? (
          <textarea
            ref={inputRef as React.RefObject<HTMLTextAreaElement>}
            value={text}
            onChange={handleChange}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className={cn(
              "w-full p-1 rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500",
              className,
            )}
            rows={3}
            placeholder={placeholder}
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
          />
        )
      ) : (
        <div
          onClick={handleClick}
          className={cn("w-full min-h-[24px] cursor-text", !text && "text-gray-400", className)}
        >
          {text || placeholder}
        </div>
      )}
    </div>
  )
}
