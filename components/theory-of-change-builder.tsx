"use client"

import { useState } from "react"
import { EditableBox } from "./editable-box"
import { FlowArrow } from "./flow-arrow"
import { Button } from "@/components/ui/button"
import { PlusCircle, Trash2, Wand2, Columns } from "lucide-react"
import { AiAssistantDialog } from "./ai-assistant-dialog"
import { useToast } from "@/hooks/use-toast"
import { LogoUpload } from "./logo-upload"

export default function TheoryOfChangeBuilder() {
  const { toast } = useToast()
  const [isAiDialogOpen, setIsAiDialogOpen] = useState(false)
  const [showGroupingColumn, setShowGroupingColumn] = useState(false)
  const [groups, setGroups] = useState([{ id: 1, name: "Grouping" }])
  const [logoUrl, setLogoUrl] = useState<string | null>(null)

  const [headerData, setHeaderData] = useState({
    title: "Theory of Change Template",
    need: "Need:",
    vision: "Vision:",
    purpose: "Purpose:",
  })

  const [flowData, setFlowData] = useState({
    inputs: "Resources",
    activities: "Activities",
    outputs: "Outputs",
    interimOutcomes: "Interim Outcomes",
    longerTermOutcomes: "Longer term Outcomes",
    impact: "Impact",
  })

  const [columns, setColumns] = useState({
    inputs: Array(1).fill(""),
    activities: Array(1).fill(""),
    outputs: Array(1).fill(""),
    interimOutcomes: Array(1).fill(""),
    longerTermOutcomes: Array(1).fill(""),
    impact: Array(1).fill(""),
  })

  const handleLogoChange = (newLogoUrl: string | null) => {
    setLogoUrl(newLogoUrl)
  }

  const addGroup = () => {
    const newId = groups.length > 0 ? Math.max(...groups.map((g) => g.id)) + 1 : 1
    setGroups([...groups, { id: newId, name: "Grouping" }])

    // Update columns to match new group count
    setColumns({
      inputs: [...columns.inputs, ""],
      activities: [...columns.activities, ""],
      outputs: [...columns.outputs, ""],
      interimOutcomes: [...columns.interimOutcomes, ""],
      longerTermOutcomes: [...columns.longerTermOutcomes, ""],
      impact: [...columns.impact, ""],
    })
  }

  const removeGroup = (id: number) => {
    const index = groups.findIndex((g) => g.id === id)
    if (index === -1) return

    const newGroups = [...groups]
    newGroups.splice(index, 1)
    setGroups(newGroups)

    // Update columns to match new group count
    setColumns({
      inputs: columns.inputs.filter((_, i) => i !== index),
      activities: columns.activities.filter((_, i) => i !== index),
      outputs: columns.outputs.filter((_, i) => i !== index),
      interimOutcomes: columns.interimOutcomes.filter((_, i) => i !== index),
      longerTermOutcomes: columns.longerTermOutcomes.filter((_, i) => i !== index),
      impact: columns.impact.filter((_, i) => i !== index),
    })
  }

  const updateGroupName = (id: number, name: string) => {
    setGroups(groups.map((g) => (g.id === id ? { ...g, name } : g)))
  }

  const updateColumnContent = (column: keyof typeof columns, index: number, content: string) => {
    setColumns({
      ...columns,
      [column]: columns[column].map((item, i) => (i === index ? content : item)),
    })
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

  const toggleGroupingColumn = () => {
    setShowGroupingColumn(!showGroupingColumn)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Theory of Change Diagram</h2>
        <div className="flex gap-2">
          <Button onClick={toggleGroupingColumn} variant="outline" className="gap-2">
            <Columns className="h-4 w-4" />
            {showGroupingColumn ? "Hide Grouping" : "Show Grouping"}
          </Button>
          <Button onClick={handleAiAssist} className="gap-2">
            <Wand2 className="h-4 w-4" />
            AI Assist
          </Button>
        </div>
      </div>

      <div className="border rounded-lg p-6 bg-white dark:bg-gray-950">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div className="toc-header text-2xl font-bold p-4 rounded-md w-1/3">
            <EditableBox
              value={headerData.title}
              onChange={(value) => setHeaderData({ ...headerData, title: value })}
              className="bg-transparent text-white"
            />
          </div>
          <div className="w-1/6 h-24">
            <LogoUpload onLogoChange={handleLogoChange} initialLogo={logoUrl} />
          </div>
        </div>

        {/* Need, Vision, Purpose */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="toc-need p-4 rounded-md">
            <EditableBox
              value={headerData.need}
              onChange={(value) => setHeaderData({ ...headerData, need: value })}
              className="bg-transparent text-white font-semibold mb-2"
            />
            <EditableBox
              value=""
              placeholder="Enter need details here..."
              onChange={() => {}}
              className="bg-transparent text-white min-h-[80px]"
              multiline
            />
          </div>
          <div className="toc-vision p-4 rounded-md">
            <EditableBox
              value={headerData.vision}
              onChange={(value) => setHeaderData({ ...headerData, vision: value })}
              className="bg-transparent text-white font-semibold mb-2"
            />
            <EditableBox
              value=""
              placeholder="Enter vision details here..."
              onChange={() => {}}
              className="bg-transparent text-white min-h-[80px]"
              multiline
            />
          </div>
          <div className="toc-purpose p-4 rounded-md">
            <EditableBox
              value={headerData.purpose}
              onChange={(value) => setHeaderData({ ...headerData, purpose: value })}
              className="bg-transparent text-white font-semibold mb-2"
            />
            <EditableBox
              value=""
              placeholder="Enter purpose details here..."
              onChange={() => {}}
              className="bg-transparent text-white min-h-[80px]"
              multiline
            />
          </div>
        </div>

        {/* Flow Diagram */}
        <div className="flex items-center justify-between mb-6">
          <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
            <EditableBox
              value={flowData.inputs}
              onChange={(value) => setFlowData({ ...flowData, inputs: value })}
              className="bg-transparent text-center"
            />
          </div>
          <FlowArrow />
          <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
            <EditableBox
              value={flowData.activities}
              onChange={(value) => setFlowData({ ...flowData, activities: value })}
              className="bg-transparent text-center"
            />
          </div>
          <FlowArrow />
          <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
            <EditableBox
              value={flowData.outputs}
              onChange={(value) => setFlowData({ ...flowData, outputs: value })}
              className="bg-transparent text-center"
            />
          </div>
          <FlowArrow />
          <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
            <EditableBox
              value={flowData.interimOutcomes}
              onChange={(value) => setFlowData({ ...flowData, interimOutcomes: value })}
              className="bg-transparent text-center"
            />
          </div>
          <FlowArrow />
          <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
            <EditableBox
              value={flowData.longerTermOutcomes}
              onChange={(value) => setFlowData({ ...flowData, longerTermOutcomes: value })}
              className="bg-transparent text-center"
            />
          </div>
          <FlowArrow />
          <div className="toc-flow px-4 py-2 rounded-md text-center w-[14%]">
            <EditableBox
              value={flowData.impact}
              onChange={(value) => setFlowData({ ...flowData, impact: value })}
              className="bg-transparent text-center"
            />
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
                  className="relative toc-grouping p-4 rounded-md h-[150px] flex items-center justify-center"
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

          {/* Inputs/Resources Column */}
          <div className={`${showGroupingColumn ? "w-[14%]" : "w-[16.66%]"} mr-2 space-y-2`}>
            {groups.map((group, index) => (
              <div key={`input-${group.id}`} className="toc-column-1 p-4 rounded-md h-[150px]">
                <EditableBox
                  value={columns.inputs[index] || ""}
                  onChange={(value) => updateColumnContent("inputs", index, value)}
                  placeholder="Enter resources..."
                  className="bg-transparent min-h-[130px]"
                  multiline
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
          <div className={`${showGroupingColumn ? "w-[14%]" : "w-[16.66%]"} mr-2 space-y-2`}>
            {groups.map((group, index) => (
              <div key={`activity-${group.id}`} className="toc-column-2 p-4 rounded-md h-[150px]">
                <EditableBox
                  value={columns.activities[index] || ""}
                  onChange={(value) => updateColumnContent("activities", index, value)}
                  placeholder="Enter activities..."
                  className="bg-transparent min-h-[130px]"
                  multiline
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
          <div className={`${showGroupingColumn ? "w-[14%]" : "w-[16.66%]"} mr-2 space-y-2`}>
            {groups.map((group, index) => (
              <div key={`output-${group.id}`} className="toc-column-3 p-4 rounded-md h-[150px]">
                <EditableBox
                  value={columns.outputs[index] || ""}
                  onChange={(value) => updateColumnContent("outputs", index, value)}
                  placeholder="Enter outputs..."
                  className="bg-transparent min-h-[130px]"
                  multiline
                />
              </div>
            ))}
          </div>

          {/* Interim Outcomes Column */}
          <div className={`${showGroupingColumn ? "w-[14%]" : "w-[16.66%]"} mr-2 space-y-2`}>
            {groups.map((group, index) => (
              <div key={`interim-${group.id}`} className="toc-column-4 p-4 rounded-md h-[150px]">
                <EditableBox
                  value={columns.interimOutcomes[index] || ""}
                  onChange={(value) => updateColumnContent("interimOutcomes", index, value)}
                  placeholder="Enter interim outcomes..."
                  className="bg-transparent min-h-[130px]"
                  multiline
                />
              </div>
            ))}
          </div>

          {/* Longer Term Outcomes Column */}
          <div className={`${showGroupingColumn ? "w-[14%]" : "w-[16.66%]"} mr-2 space-y-2`}>
            {groups.map((group, index) => (
              <div key={`longterm-${group.id}`} className="toc-column-5 p-4 rounded-md h-[150px]">
                <EditableBox
                  value={columns.longerTermOutcomes[index] || ""}
                  onChange={(value) => updateColumnContent("longerTermOutcomes", index, value)}
                  placeholder="Enter long-term outcomes..."
                  className="bg-transparent min-h-[130px]"
                  multiline
                />
              </div>
            ))}
          </div>

          {/* Impact Column */}
          <div className={`${showGroupingColumn ? "w-[14%]" : "w-[16.66%]"} space-y-2`}>
            {groups.map((group, index) => (
              <div key={`impact-${group.id}`} className="toc-column-6 p-4 rounded-md h-[150px]">
                <EditableBox
                  value={columns.impact[index] || ""}
                  onChange={(value) => updateColumnContent("impact", index, value)}
                  placeholder="Enter impact..."
                  className="bg-transparent min-h-[130px]"
                  multiline
                />
              </div>
            ))}
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
