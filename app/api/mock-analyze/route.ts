import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text, documentContent } = await req.json()

    if (!text && !documentContent) {
      return NextResponse.json({ message: "No content provided" }, { status: 400 })
    }

    const contentToAnalyze = text || documentContent

    // Simulate processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500))

    // Generate mock suggestions based on input length
    const mockSuggestions = `Based on your input (${contentToAnalyze.length} characters), here are some suggestions:

1. Consider clarifying your Need statement to focus more on root causes rather than symptoms.

2. Add specific measurable indicators for your outcomes to make them more trackable.

3. Consider adding a "Stakeholder Engagement" component to your activities section.

4. Your long-term outcomes could be more clearly linked to your stated impact.

5. Consider adding external factors or assumptions that might affect your theory of change.`

    return NextResponse.json({ suggestions: mockSuggestions })
  } catch (error) {
    console.error("Error in mock API route:", error)
    return NextResponse.json(
      { message: "Error processing your request", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
