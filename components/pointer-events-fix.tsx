"use client"

import { useEffect } from "react"

export function PointerEventsFix() {
  useEffect(() => {
    // Ensure pointer events are enabled when component mounts
    document.body.style.pointerEvents = "auto"

    // Create a MutationObserver to watch for style changes on the body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "style" &&
          document.body.style.pointerEvents === "none"
        ) {
          // Re-enable pointer events if they get disabled
          document.body.style.pointerEvents = "auto"
        }
      })
    })

    // Start observing the body element for attribute changes
    observer.observe(document.body, { attributes: true, attributeFilter: ["style"] })

    // Also set an interval as a backup to ensure pointer events stay enabled
    const interval = setInterval(() => {
      if (document.body.style.pointerEvents === "none") {
        document.body.style.pointerEvents = "auto"
      }
    }, 1000)

    return () => {
      observer.disconnect()
      clearInterval(interval)
    }
  }, [])

  return null
}
