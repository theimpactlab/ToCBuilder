import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    // Get the OpenAI API key directly from process.env
    const apiKey = process.env.OPENAI_API_KEY

    // Log for debugging (remove in production)
    console.log("API Key available:", !!apiKey)

    // Check if OpenAI API key is available
    if (!apiKey) {
      console.error("OpenAI API key is missing")
      return NextResponse.json(
        { message: "OpenAI API key is missing. Please add it to your environment variables." },
        { status: 500 },
      )
    }

    const { text, documentContent } = await req.json()

    if (!text && !documentContent) {
      return NextResponse.json({ message: "No content provided" }, { status: 400 })
    }

    const contentToAnalyze = text || documentContent

    try {
      const { text: analysis } = await generateText({
        model: openai("gpt-4o"),
        prompt: `You are an expert in Theory of Change methodology for social impact organizations. 
        Analyze the following text and provide specific suggestions to improve a Theory of Change diagram.
        Focus on identifying: key needs, activities, outputs, outcomes, and impact.
        Format your response as 3-5 specific, actionable recommendations.
        
        Text to analyze: ${contentToAnalyze}`,
        maxTokens: 500,
        apiKey: apiKey,
      })

      return NextResponse.json({ suggestions: analysis })
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      return NextResponse.json(
        {
          message: "Error generating AI response",
          error: aiError instanceof Error ? aiError.message : String(aiError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { message: "Error processing your request", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
