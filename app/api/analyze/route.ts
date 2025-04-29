import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"
import { getServerEnv } from "@/lib/env"

export async function POST(req: Request) {
  try {
    const env = getServerEnv()

    // Check if OpenAI API key is available
    if (!env.OPENAI_API_KEY) {
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

    const { text: analysis } = await generateText({
      model: openai("gpt-4o"),
      prompt: `You are an expert in Theory of Change methodology for social impact organizations. 
      Analyze the following text and provide specific suggestions to improve a Theory of Change diagram.
      Focus on identifying: key needs, activities, outputs, outcomes, and impact.
      Format your response as 3-5 specific, actionable recommendations.
      
      Text to analyze: ${contentToAnalyze}`,
      maxTokens: 500,
      apiKey: env.OPENAI_API_KEY,
    })

    return NextResponse.json({ suggestions: analysis })
  } catch (error) {
    console.error("Error analyzing content:", error)
    return NextResponse.json(
      { message: "Error processing your request", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
