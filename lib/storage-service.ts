import type { HeaderDataType, FlowDataType, GroupType, ColumnContentType } from "./store"

export interface SavedDiagram {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  headerData: HeaderDataType
  flowData: FlowDataType
  groups: GroupType[]
  columns: ColumnContentType
  logoUrl: string | null
  showGroupingColumn: boolean
  themeColors: {
    header: string
    need: string
    flow: string
    grouping: string
    columns: string[]
  }
}

export interface DiagramMetadata {
  id: string
  name: string
  createdAt: string
  updatedAt: string
}

const STORAGE_KEY = "toc-saved-diagrams"

export const storageService = {
  // Save a diagram
  saveDiagram: (diagram: SavedDiagram): void => {
    try {
      // Get existing diagrams
      const existingDiagrams = storageService.getAllDiagrams()

      // Check if this is an update to an existing diagram
      const existingIndex = existingDiagrams.findIndex((d) => d.id === diagram.id)

      if (existingIndex >= 0) {
        // Update existing diagram
        existingDiagrams[existingIndex] = {
          ...diagram,
          updatedAt: new Date().toISOString(),
        }
      } else {
        // Add new diagram
        existingDiagrams.push({
          ...diagram,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
      }

      // Save back to storage
      localStorage.setItem(STORAGE_KEY, JSON.stringify(existingDiagrams))
    } catch (error) {
      console.error("Error saving diagram:", error)
      throw new Error("Failed to save diagram")
    }
  },

  // Get all diagrams
  getAllDiagrams: (): SavedDiagram[] => {
    try {
      const diagrams = localStorage.getItem(STORAGE_KEY)
      return diagrams ? JSON.parse(diagrams) : []
    } catch (error) {
      console.error("Error getting diagrams:", error)
      return []
    }
  },

  // Get diagram metadata (for listing without loading full content)
  getDiagramMetadata: (): DiagramMetadata[] => {
    try {
      const diagrams = storageService.getAllDiagrams()
      return diagrams.map(({ id, name, createdAt, updatedAt }) => ({
        id,
        name,
        createdAt,
        updatedAt,
      }))
    } catch (error) {
      console.error("Error getting diagram metadata:", error)
      return []
    }
  },

  // Get a specific diagram by ID
  getDiagramById: (id: string): SavedDiagram | null => {
    try {
      const diagrams = storageService.getAllDiagrams()
      return diagrams.find((d) => d.id === id) || null
    } catch (error) {
      console.error("Error getting diagram by ID:", error)
      return null
    }
  },

  // Delete a diagram
  deleteDiagram: (id: string): boolean => {
    try {
      const diagrams = storageService.getAllDiagrams()
      const filteredDiagrams = diagrams.filter((d) => d.id !== id)

      if (filteredDiagrams.length !== diagrams.length) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(filteredDiagrams))
        return true
      }
      return false
    } catch (error) {
      console.error("Error deleting diagram:", error)
      return false
    }
  },
}
