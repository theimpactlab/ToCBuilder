import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { text, documentContent } = await req.json()

    if (!text && !documentContent) {
      return new Response("No content provided", { status: 400 })
    }

    const contentToAnalyze = text || documentContent

    const { text: analysis } = await generateText({
      model: xai("grok-1"),
      prompt: `You are an expert in Theory of Change methodology for social impact organizations. 
      Analyze the following text and provide specific suggestions to improve a Theory of Change diagram.
      Focus on identifying: key needs, activities, outputs, outcomes, and impact.
      Format your response as 3-5 specific, actionable recommendations.
      
      Text to analyze: ${contentToAnalyze}`,
      maxTokens: 500,
    })

    return NextResponse.json({ suggestions: analysis })
  } catch (error) {
    console.error("Error analyzing content:", error)
    return new Response("Error processing your request", { status: 500 })
  }
}
