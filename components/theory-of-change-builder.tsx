"use client"

import { useState, useEffect } from "react"
import { EditableBox } from "./editable-box"
import { FlowArrow } from "./flow-arrow"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Wand2, Columns } from "lucide-react"
import { AiAssistantDialog } from "./ai-assistant-dialog"
import { useToast } from "@/hooks/use-toast"
import { LogoUpload } from "./logo-upload"
import { useTheoryOfChangeStore } from "@/lib/store"

export default function TheoryOfChangeBuilder() {
  const { toast } = useToast()
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false)
  const [rowHeights, setRowHeights] = useState<Record<number, number>>({})

  // Use the store for all state
  const {
    headerData,
    updateHeaderData,
    flowData,
    updateFlowData,
    groups,
    addGroup,
    removeGroup,
    updateGroupName,
    columns,
    updateColumnContent,
    logoUrl,
    setLogoUrl,
    showGroupingColumn,
    toggleGroupingColumn,
  } = useTheoryOfChangeStore()

  // Function to update row heights
  const updateRowHeight = (rowIndex: number, height: number) => {
    setRowHeights((prev) => {
      const newHeights = { ...prev }
      newHeights[rowIndex] = Math.max(height, prev[rowIndex] || 150)
      return newHeights
    })
  }

  const handleLogoChange = (newLogoUrl: string | null) => {
    setLogoUrl(newLogoUrl)
  }

  const handleAiAssist = () => {
    setIsAiDialogOpen(true)
  }

  const handleAiSuggestions = (suggestions: any) => {
    // In a real implementation, this would update the diagram based on AI suggestions
    toast({
      title: "AI Suggestions Applied",
      description: "The diagram has been updated with AI suggestions.",
    })
    setIsAiDialogOpen(false)
  }

  // Reset row heights when groups change
  useEffect(() => {
    const newRowHeights: Record<number, number> = {}
    groups.forEach((_, index) => {
      newRowHeights[index] = rowHeights[index] || 150
    })
    setRowHeights(newRowHeights)
  }, [groups.length])

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Theory of Change Diagram</h2>
        <div className="flex gap-2">
          <Button onClick={() => toggleGroupingColumn()} variant="outline" className="gap-2">
            <Columns className="h-4 w-4" />
            {showGroupingColumn ? "Hide Grouping" : "Show Grouping"}
          </Button>
          <Button onClick={handleAiAssist} className="gap-2">
            <Wand2 className="h-4 w-4" />
            AI Assist
          </Button>
        </div>
      </div>

      {/* Add id="toc-diagram" to the diagram container for PDF export */}
      <div id="toc-diagram" className="border rounded-lg p-6 bg-white dark:bg-gray-950">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="toc-header text-2xl font-bold p-4 rounded-md w-1/3">
            <EditableBox
              value={headerData.title}
              onChange={(value) => updateHeaderData({ title: value })}
              className="bg-transparent text-white"
            />
          </div>
          <div className="w-1/6 h-24">
            <LogoUpload onLogoChange={handleLogoChange} initialLogo={logoUrl} />
          </div>
        </div>

        {/* Need, Vision, Purpose */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="toc-need p-4 rounded-md flex flex-col h-[180px]">
            <EditableBox
              value={headerData.need}
              onChange={(value) => updateHeaderData({ need: value })}
              className="bg-transparent text-white font-semibold mb-2"
            />
            <div className="mt-1">
              <EditableBox
                value={headerData.needContent || ""}
                placeholder="Enter need details here..."
                onChange={(value) => updateHeaderData({ needContent: value })}
                className="bg-transparent text-white h-auto"
                multiline
              />
            </div>
          </div>
          <div className="toc-vision p-4 rounded-md flex flex-col h-[180px]">
            <EditableBox
              value={headerData.vision}
              onChange={(value) => updateHeaderData({ vision: value })}
              className="bg-transparent text-white font-semibold mb-2"
            />
            <div className="mt-1">
              <EditableBox
                value={headerData.visionContent || ""}
                placeholder="Enter vision details here..."
                onChange={(value) => updateHeaderData({ visionContent: value })}
                className="bg-transparent text-white h-auto"
                multiline
              />
            </div>
          </div>
          <div className="toc-purpose p-4 rounded-md flex flex-col h-[180px]">
            <EditableBox
              value={headerData.purpose}
              onChange={(value) => updateHeaderData({ purpose: value })}
              className="bg-transparent text-white font-semibold mb-2"
            />
            <div className="mt-1">
              <EditableBox
                value={headerData.purposeContent || ""}
                placeholder="Enter purpose details here..."
                onChange={(value) => updateHeaderData({ purposeContent: value })}
                className="bg-transparent text-white h-auto"
                multiline
              />
            </div>
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="flex items-center justify-between mb-6">
          {/* Add empty space for grouping column when visible */}
          {showGroupingColumn && <div className="w-[14%] mr-2"></div>}

          <div className={`flex items-center justify-between ${showGroupingColumn ? "w-[86%]" : "w-full"}`}>
            <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
              <EditableBox
                value={flowData.inputs}
                onChange={(value) => updateFlowData({ inputs: value })}
                className="bg-transparent text-center"
              />
            </div>
            <FlowArrow />
            <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
              <EditableBox
                value={flowData.activities}
                onChange={(value) => updateFlowData({ activities: value })}
                className="bg-transparent text-center"
              />
            </div>
            <FlowArrow />
            <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
              <EditableBox
                value={flowData.outputs}
                onChange={(value) => updateFlowData({ outputs: value })}
                className="bg-transparent text-center"
              />
            </div>
            <FlowArrow />
            <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
              <EditableBox
                value={flowData.interimOutcomes}
                onChange={(value) => updateFlowData({ interimOutcomes: value })}
                className="bg-transparent text-center"
              />
            </div>
            <FlowArrow />
            <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
              <EditableBox
                value={flowData.longerTermOutcomes}
                onChange={(value) => updateFlowData({ longerTermOutcomes: value })}
                className="bg-transparent text-center"
              />
            </div>
            <FlowArrow />
            <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
              <EditableBox
                value={flowData.impact}
                onChange={(value) => updateFlowData({ impact: value })}
                className="bg-transparent text-center"
              />
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="flex">
          {/* Grouping Column - Only show if enabled */}
          {showGroupingColumn && (
            <div className="w-[14%] mr-2 space-y-2">
              {groups.map((group, index) => (
                <div
                  key={group.id}
                  className="relative toc-grouping p-4 rounded-md flex items-center justify-center"
                  style={{ height: `${rowHeights[index] || 150}px` }}
                >
                  <EditableBox
                    value={group.name}
                    onChange={(value) => updateGroupName(group.id, value)}
                    className="bg-transparent text-center"
                  />
                  {groups.length > 1 && (
                    <button
                      className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
                      onClick={() => removeGroup(group.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={addGroup}>
                <PlusCircle className="h-4 w-4" />
                Add Row
              </Button>
            </div>
          )}

          <div className="flex flex-1">
            {/* Inputs/Resources Column */}
            <div className={`${showGroupingColumn ? "w-[16.66%]" : "w-[16.66%]"} mr-2 space-y-2`}>
              {groups.map((group, index) => (
                <div
                  key={`input-${group.id}`}
                  className="toc-column-1 p-4 rounded-md"
                  style={{ height: `${rowHeights[index] || 150}px` }}
                >
                  <EditableBox
                    value={columns.inputs[index] || ""}
                    onChange={(value) => updateColumnContent("inputs", index, value)}
                    placeholder="Enter resources..."
                    className="bg-transparent h-full"
                    multiline
                    onHeightChange={(height) => updateRowHeight(index, height + 32)} // 32px for padding
                  />
                </div>
              ))}
              {!showGroupingColumn && (
                <Button variant="outline" className="w-full flex items-center justify-center gap-2" onClick={addGroup}>
                  <PlusCircle className="h-4 w-4" />
                  Add Row
                </Button>
              )}
            </div>

            {/* Activities Column */}
            <div className={`${showGroupingColumn ? "w-[16.66%]" : "w-[16.66%]"} mr-2 space-y-2`}>
              {groups.map((group, index) => (
                <div
                  key={`activity-${group.id}`}
                  className="toc-column-2 p-4 rounded-md"
                  style={{ height: `${rowHeights[index] || 150}px` }}
                >
                  <EditableBox
                    value={columns.activities[index] || ""}
                    onChange={(value) => updateColumnContent("activities", index, value)}
                    placeholder="Enter activities..."
                    className="bg-transparent h-full"
                    multiline
                    onHeightChange={(height) => updateRowHeight(index, height + 32)}
                  />
                </div>
              ))}
              {!showGroupingColumn && groups.length > 1 && (
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center gap-2 border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() => removeGroup(groups[groups.length - 1].id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Row
                </Button>
              )}
            </div>

            {/* Outputs Column */}
            <div className={`${showGroupingColumn ? "w-[16.66%]" : "w-[16.66%]"} mr-2 space-y-2`}>
              {groups.map((group, index) => (
                <div
                  key={`output-${group.id}`}
                  className="toc-column-3 p-4 rounded-md"
                  style={{ height: `${rowHeights[index] || 150}px` }}
                >
                  <EditableBox
                    value={columns.outputs[index] || ""}
                    onChange={(value) => updateColumnContent("outputs", index, value)}
                    placeholder="Enter outputs..."
                    className="bg-transparent h-full"
                    multiline
                    onHeightChange={(height) => updateRowHeight(index, height + 32)}
                  />
                </div>
              ))}
            </div>

            {/* Interim Outcomes Column */}
            <div className={`${showGroupingColumn ? "w-[16.66%]" : "w-[16.66%]"} mr-2 space-y-2`}>
              {groups.map((group, index) => (
                <div
                  key={`interim-${group.id}`}
                  className="toc-column-4 p-4 rounded-md"
                  style={{ height: `${rowHeights[index] || 150}px` }}
                >
                  <EditableBox
                    value={columns.interimOutcomes[index] || ""}
                    onChange={(value) => updateColumnContent("interimOutcomes", index, value)}
                    placeholder="Enter interim outcomes..."
                    className="bg-transparent h-full"
                    multiline
                    onHeightChange={(height) => updateRowHeight(index, height + 32)}
                  />
                </div>
              ))}
            </div>

            {/* Longer Term Outcomes Column */}
            <div className={`${showGroupingColumn ? "w-[16.66%]" : "w-[16.66%]"} mr-2 space-y-2`}>
              {groups.map((group, index) => (
                <div
                  key={`longterm-${group.id}`}
                  className="toc-column-5 p-4 rounded-md"
                  style={{ height: `${rowHeights[index] || 150}px` }}
                >
                  <EditableBox
                    value={columns.longerTermOutcomes[index] || ""}
                    onChange={(value) => updateColumnContent("longerTermOutcomes", index, value)}
                    placeholder="Enter long-term outcomes..."
                    className="bg-transparent h-full"
                    multiline
                    onHeightChange={(height) => updateRowHeight(index, height + 32)}
                  />
                </div>
              ))}
            </div>

            {/* Impact Column */}
            <div className={`${showGroupingColumn ? "w-[16.66%]" : "w-[16.66%]"} space-y-2`}>
              {groups.map((group, index) => (
                <div
                  key={`impact-${group.id}`}
                  className="toc-column-6 p-4 rounded-md"
                  style={{ height: `${rowHeights[index] || 150}px` }}
                >
                  <EditableBox
                    value={columns.impact[index] || ""}
                    onChange={(value) => updateColumnContent("impact", index, value)}
                    placeholder="Enter impact..."
                    className="bg-transparent h-full"
                    multiline
                    onHeightChange={(height) => updateRowHeight(index, height + 32)}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AiAssistantDialog
        open={isAiDialogOpen}
        onOpenChange={setIsAiDialogOpen}
        onApplySuggestions={handleAiSuggestions}
      />
    </div>
  )
}
