import type { SavedDiagram } from "./storage-service"

// Check if File System Access API is supported - only run on client side
const isFileSystemAccessSupported = () => {
  if (typeof window === "undefined") return false
  return "showSaveFilePicker" in window && "showOpenFilePicker" in window && "showDirectoryPicker" in window
}

export interface FileSystemStorageOptions {
  suggestedName?: string
  startIn?: "desktop" | "documents" | "downloads" | "music" | "pictures" | "videos"
}

export const fileSystemStorage = {
  // Check if the API is supported
  isSupported: isFileSystemAccessSupported,

  // Save diagram to a file
  saveDiagramToFile: async (diagram: SavedDiagram, options: FileSystemStorageOptions = {}): Promise<boolean> => {
    try {
      if (!isFileSystemAccessSupported()) {
        // Fallback to download for unsupported browsers
        return fileSystemStorage.downloadDiagramFile(diagram, options.suggestedName)
      }

      const fileHandle = await window.showSaveFilePicker({
        suggestedName: options.suggestedName || `${diagram.name}.toc.json`,
        startIn: options.startIn || "documents",
        types: [
          {
            description: "Theory of Change files",
            accept: {
              "application/json": [".toc.json"],
            },
          },
        ],
      })

      const writable = await fileHandle.createWritable()
      await writable.write(JSON.stringify(diagram, null, 2))
      await writable.close()

      return true
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // User cancelled the save dialog
        return false
      }
      console.error("Error saving file:", error)
      throw new Error("Failed to save file")
    }
  },

  // Load diagram from a file
  loadDiagramFromFile: async (): Promise<SavedDiagram | null> => {
    try {
      if (!isFileSystemAccessSupported()) {
        // Fallback to file input for unsupported browsers
        return fileSystemStorage.loadDiagramFromInput()
      }

      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: "Theory of Change files",
            accept: {
              "application/json": [".toc.json", ".json"],
            },
          },
        ],
        multiple: false,
      })

      const file = await fileHandle.getFile()
      const content = await file.text()
      const diagram = JSON.parse(content) as SavedDiagram

      // Validate the diagram structure
      if (!fileSystemStorage.validateDiagram(diagram)) {
        throw new Error("Invalid diagram file format")
      }

      return diagram
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        // User cancelled the open dialog
        return null
      }
      console.error("Error loading file:", error)
      throw new Error("Failed to load file")
    }
  },

  // Save multiple diagrams to a directory
  saveDiagramsToDirectory: async (diagrams: SavedDiagram[]): Promise<boolean> => {
    try {
      if (!isFileSystemAccessSupported()) {
        throw new Error("Directory saving not supported in this browser")
      }

      const directoryHandle = await window.showDirectoryPicker({
        startIn: "documents",
      })

      for (const diagram of diagrams) {
        const fileName = `${diagram.name.replace(/[^a-z0-9]/gi, "_")}.toc.json`
        const fileHandle = await directoryHandle.getFileHandle(fileName, { create: true })
        const writable = await fileHandle.createWritable()
        await writable.write(JSON.stringify(diagram, null, 2))
        await writable.close()
      }

      return true
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return false
      }
      console.error("Error saving to directory:", error)
      throw new Error("Failed to save to directory")
    }
  },

  // Fallback: Download file for unsupported browsers
  downloadDiagramFile: (diagram: SavedDiagram, suggestedName?: string): boolean => {
    try {
      const dataStr = JSON.stringify(diagram, null, 2)
      const dataBlob = new Blob([dataStr], { type: "application/json" })
      const url = URL.createObjectURL(dataBlob)

      const link = document.createElement("a")
      link.href = url
      link.download = suggestedName || `${diagram.name}.toc.json`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      URL.revokeObjectURL(url)
      return true
    } catch (error) {
      console.error("Error downloading file:", error)
      return false
    }
  },

  // Fallback: Load file using input element for unsupported browsers
  loadDiagramFromInput: (): Promise<SavedDiagram | null> => {
    return new Promise((resolve, reject) => {
      const input = document.createElement("input")
      input.type = "file"
      input.accept = ".json,.toc.json"

      input.onchange = async (event) => {
        const file = (event.target as HTMLInputElement).files?.[0]
        if (!file) {
          resolve(null)
          return
        }

        try {
          const content = await file.text()
          const diagram = JSON.parse(content) as SavedDiagram

          if (!fileSystemStorage.validateDiagram(diagram)) {
            throw new Error("Invalid diagram file format")
          }

          resolve(diagram)
        } catch (error) {
          reject(new Error("Failed to load file"))
        }
      }

      input.oncancel = () => resolve(null)
      input.click()
    })
  },

  // Validate diagram structure
  validateDiagram: (diagram: any): diagram is SavedDiagram => {
    return (
      diagram &&
      typeof diagram.id === "string" &&
      typeof diagram.name === "string" &&
      typeof diagram.createdAt === "string" &&
      typeof diagram.updatedAt === "string" &&
      diagram.headerData &&
      diagram.flowData &&
      Array.isArray(diagram.groups) &&
      diagram.columns &&
      diagram.themeColors
    )
  },

  // Export diagram as different formats
  exportDiagram: async (
    diagram: SavedDiagram,
    format: "json" | "csv" | "txt",
    options: FileSystemStorageOptions = {},
  ): Promise<boolean> => {
    try {
      let content: string
      let extension: string
      let mimeType: string

      switch (format) {
        case "json":
          content = JSON.stringify(diagram, null, 2)
          extension = ".json"
          mimeType = "application/json"
          break
        case "csv":
          content = fileSystemStorage.convertToCSV(diagram)
          extension = ".csv"
          mimeType = "text/csv"
          break
        case "txt":
          content = fileSystemStorage.convertToText(diagram)
          extension = ".txt"
          mimeType = "text/plain"
          break
        default:
          throw new Error("Unsupported format")
      }

      if (isFileSystemAccessSupported()) {
        const fileHandle = await window.showSaveFilePicker({
          suggestedName: options.suggestedName || `${diagram.name}${extension}`,
          startIn: options.startIn || "documents",
          types: [
            {
              description: `${format.toUpperCase()} files`,
              accept: {
                [mimeType]: [extension],
              },
            },
          ],
        })

        const writable = await fileHandle.createWritable()
        await writable.write(content)
        await writable.close()
      } else {
        // Fallback download
        const dataBlob = new Blob([content], { type: mimeType })
        const url = URL.createObjectURL(dataBlob)

        const link = document.createElement("a")
        link.href = url
        link.download = options.suggestedName || `${diagram.name}${extension}`
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        URL.revokeObjectURL(url)
      }

      return true
    } catch (error) {
      if (error instanceof Error && error.name === "AbortError") {
        return false
      }
      console.error("Error exporting diagram:", error)
      throw new Error("Failed to export diagram")
    }
  },

  // Convert diagram to CSV format
  convertToCSV: (diagram: SavedDiagram): string => {
    const rows = [
      ["Section", "Content"],
      ["Title", diagram.headerData.title],
      ["Need", diagram.headerData.need],
      ["Need Content", diagram.headerData.needContent || ""],
      ["Vision", diagram.headerData.vision],
      ["Vision Content", diagram.headerData.visionContent || ""],
      ["Purpose", diagram.headerData.purpose],
      ["Purpose Content", diagram.headerData.purposeContent || ""],
      ["", ""], // Empty row
      ["Flow Elements", ""],
      ["Inputs", diagram.flowData.inputs],
      ["Activities", diagram.flowData.activities],
      ["Outputs", diagram.flowData.outputs],
      ["Interim Outcomes", diagram.flowData.interimOutcomes],
      ["Longer Term Outcomes", diagram.flowData.longerTermOutcomes],
      ["Impact", diagram.flowData.impact],
      ["", ""], // Empty row
    ]

    // Add groups and their content
    diagram.groups.forEach((group, index) => {
      rows.push([`Group ${index + 1}`, group.name])
      rows.push(["Resources", diagram.columns.inputs[index] || ""])
      rows.push(["Activities", diagram.columns.activities[index] || ""])
      rows.push(["Outputs", diagram.columns.outputs[index] || ""])
      rows.push(["Interim Outcomes", diagram.columns.interimOutcomes[index] || ""])
      rows.push(["Longer Term Outcomes", diagram.columns.longerTermOutcomes[index] || ""])
      rows.push(["Impact", diagram.columns.impact[index] || ""])
      rows.push(["", ""]) // Empty row
    })

    return rows.map((row) => row.map((cell) => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n")
  },

  // Convert diagram to plain text format
  convertToText: (diagram: SavedDiagram): string => {
    let text = `THEORY OF CHANGE: ${diagram.headerData.title}\n`
    text += `Created: ${new Date(diagram.createdAt).toLocaleDateString()}\n`
    text += `Updated: ${new Date(diagram.updatedAt).toLocaleDateString()}\n\n`

    text += `NEED: ${diagram.headerData.need}\n`
    if (diagram.headerData.needContent) {
      text += `${diagram.headerData.needContent}\n`
    }
    text += "\n"

    text += `VISION: ${diagram.headerData.vision}\n`
    if (diagram.headerData.visionContent) {
      text += `${diagram.headerData.visionContent}\n`
    }
    text += "\n"

    text += `PURPOSE: ${diagram.headerData.purpose}\n`
    if (diagram.headerData.purposeContent) {
      text += `${diagram.headerData.purposeContent}\n`
    }
    text += "\n"

    text += "FLOW:\n"
    text += `${diagram.flowData.inputs} → ${diagram.flowData.activities} → ${diagram.flowData.outputs} → ${diagram.flowData.interimOutcomes} → ${diagram.flowData.longerTermOutcomes} → ${diagram.flowData.impact}\n\n`

    text += "DETAILED CONTENT:\n"
    diagram.groups.forEach((group, index) => {
      text += `\nGroup ${index + 1}: ${group.name}\n`
      text += `Resources: ${diagram.columns.inputs[index] || "N/A"}\n`
      text += `Activities: ${diagram.columns.activities[index] || "N/A"}\n`
      text += `Outputs: ${diagram.columns.outputs[index] || "N/A"}\n`
      text += `Interim Outcomes: ${diagram.columns.interimOutcomes[index] || "N/A"}\n`
      text += `Longer Term Outcomes: ${diagram.columns.longerTermOutcomes[index] || "N/A"}\n`
      text += `Impact: ${diagram.columns.impact[index] || "N/A"}\n`
    })

    return text
  },
}

// Extend the Window interface for TypeScript
declare global {
  interface Window {
    showSaveFilePicker: (options?: any) => Promise<any>
    showOpenFilePicker: (options?: any) => Promise<any[]>
    showDirectoryPicker: (options?: any) => Promise<any>
  }
}
