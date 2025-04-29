"use client"

import { create } from "zustand"
import { persist } from "zustand/middleware"

export type GroupType = {
  id: number
  name: string
}

export type ColumnContentType = {
  inputs: string[]
  activities: string[]
  outputs: string[]
  interimOutcomes: string[]
  longerTermOutcomes: string[]
  impact: string[]
}

export type HeaderDataType = {
  title: string
  need: string
  vision: string
  purpose: string
}

export type FlowDataType = {
  inputs: string
  activities: string
  outputs: string
  interimOutcomes: string
  longerTermOutcomes: string
  impact: string
}

type ThemeColors = {
  header: string
  need: string
  flow: string
  grouping: string
  columns: string[]
}

interface TheoryOfChangeStore {
  headerData: HeaderDataType
  flowData: FlowDataType
  groups: GroupType[]
  columns: ColumnContentType
  themeColors: ThemeColors
  logoUrl: string | null
  showGroupingColumn: boolean

  updateHeaderData: (data: Partial<HeaderDataType>) => void
  updateFlowData: (data: Partial<FlowDataType>) => void
  addGroup: () => void
  removeGroup: (id: number) => void
  updateGroupName: (id: number, name: string) => void
  updateColumnContent: (column: keyof ColumnContentType, index: number, content: string) => void
  updateThemeColor: (key: keyof ThemeColors | "column", value: string, index?: number) => void
  setLogoUrl: (url: string | null) => void
  toggleGroupingColumn: () => void
  resetToDefault: () => void
}

const defaultHeaderData: HeaderDataType = {
  title: "Theory of Change Template",
  need: "Need:",
  vision: "Vision:",
  purpose: "Purpose:",
}

const defaultFlowData: FlowDataType = {
  inputs: "Resources",
  activities: "Activities",
  outputs: "Outputs",
  interimOutcomes: "Interim Outcomes",
  longerTermOutcomes: "Longer term Outcomes",
  impact: "Impact",
}

const defaultGroups: GroupType[] = [{ id: 1, name: "Grouping" }]

const defaultColumns: ColumnContentType = {
  inputs: Array(1).fill(""),
  activities: Array(1).fill(""),
  outputs: Array(1).fill(""),
  interimOutcomes: Array(1).fill(""),
  longerTermOutcomes: Array(1).fill(""),
  impact: Array(1).fill(""),
}

const defaultThemeColors: ThemeColors = {
  header: "#475569",
  need: "#475569",
  flow: "#f1f5f9",
  grouping: "#f5f5dc",
  columns: ["#e2e8f0", "#e2e8f0", "#e2e8f0", "#e2e8f0", "#e2e8f0", "#e2e8f0"],
}

export const useTheoryOfChangeStore = create<TheoryOfChangeStore>()(
  persist(
    (set) => ({
      headerData: defaultHeaderData,
      flowData: defaultFlowData,
      groups: defaultGroups,
      columns: defaultColumns,
      themeColors: defaultThemeColors,
      logoUrl: null,
      showGroupingColumn: false,

      updateHeaderData: (data) =>
        set((state) => ({
          headerData: { ...state.headerData, ...data },
        })),

      updateFlowData: (data) =>
        set((state) => ({
          flowData: { ...state.flowData, ...data },
        })),

      addGroup: () =>
        set((state) => {
          const newId = state.groups.length > 0 ? Math.max(...state.groups.map((g) => g.id)) + 1 : 1

          return {
            groups: [...state.groups, { id: newId, name: "Grouping" }],
            columns: {
              inputs: [...state.columns.inputs, ""],
              activities: [...state.columns.activities, ""],
              outputs: [...state.columns.outputs, ""],
              interimOutcomes: [...state.columns.interimOutcomes, ""],
              longerTermOutcomes: [...state.columns.longerTermOutcomes, ""],
              impact: [...state.columns.impact, ""],
            },
          }
        }),

      removeGroup: (id) =>
        set((state) => {
          const index = state.groups.findIndex((g) => g.id === id)
          if (index === -1) return state

          const newGroups = [...state.groups]
          newGroups.splice(index, 1)

          return {
            groups: newGroups,
            columns: {
              inputs: state.columns.inputs.filter((_, i) => i !== index),
              activities: state.columns.activities.filter((_, i) => i !== index),
              outputs: state.columns.outputs.filter((_, i) => i !== index),
              interimOutcomes: state.columns.interimOutcomes.filter((_, i) => i !== index),
              longerTermOutcomes: state.columns.longerTermOutcomes.filter((_, i) => i !== index),
              impact: state.columns.impact.filter((_, i) => i !== index),
            },
          }
        }),

      updateGroupName: (id, name) =>
        set((state) => ({
          groups: state.groups.map((g) => (g.id === id ? { ...g, name } : g)),
        })),

      updateColumnContent: (column, index, content) =>
        set((state) => ({
          columns: {
            ...state.columns,
            [column]: state.columns[column].map((item, i) => (i === index ? content : item)),
          },
        })),

      updateThemeColor: (key, value, index) =>
        set((state) => {
          if (key === "column" && typeof index === "number") {
            const newColumns = [...state.themeColors.columns]
            newColumns[index] = value
            return {
              themeColors: {
                ...state.themeColors,
                columns: newColumns,
              },
            }
          }

          return {
            themeColors: {
              ...state.themeColors,
              [key]: value,
            },
          }
        }),

      setLogoUrl: (url) =>
        set({
          logoUrl: url,
        }),

      toggleGroupingColumn: () =>
        set((state) => ({
          showGroupingColumn: !state.showGroupingColumn,
        })),

      resetToDefault: () =>
        set({
          headerData: defaultHeaderData,
          flowData: defaultFlowData,
          groups: defaultGroups,
          columns: defaultColumns,
          themeColors: defaultThemeColors,
          logoUrl: null,
          showGroupingColumn: false,
        }),
    }),
    {
      name: "theory-of-change-storage",
    },
  ),
)
