import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

export async function POST(req: NextRequest) {
  try {
    // Get the OpenAI API key directly from process.env
    const apiKey = process.env.OPENAI_API_KEY

    // Check if OpenAI API key is available
    if (!apiKey) {
      console.error("OpenAI API key is missing")
      return NextResponse.json(
        { message: "OpenAI API key is missing. Please add it to your environment variables." },
        { status: 500 },
      )
    }

    const formData = await req.formData()
    const file = formData.get("file") as File | null

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // In a production app, you would process the file here
    // For this demo, we'll simulate extracting text from the file
    const fileText = `This is simulated text extracted from ${file.name}.
    
Our organization aims to improve education access in underserved communities.
    
Need: Limited access to quality education in rural areas
Vision: Equal educational opportunities for all children regardless of location
Purpose: To bridge the educational gap between urban and rural communities
    
Key activities include:
- Developing digital learning resources
- Training local teachers
- Providing technology infrastructure
- Creating community learning centers
    
Expected outcomes include improved literacy rates, higher graduation rates, and increased employment opportunities.`

    try {
      // Use OpenAI to analyze the extracted text
      const { text: analysis } = await generateText({
        model: openai("gpt-4o"),
        prompt: `You are an expert in Theory of Change methodology for social impact organizations. 
        Analyze the following text extracted from a document and provide specific suggestions to improve a Theory of Change diagram.
        Focus on identifying: key needs, activities, outputs, outcomes, and impact.
        Format your response as 3-5 specific, actionable recommendations.
        
        Text from document: ${fileText}`,
        maxTokens: 500,
        apiKey: apiKey,
      })

      return NextResponse.json({
        success: true,
        suggestions: analysis,
      })
    } catch (aiError) {
      console.error("AI generation error:", aiError)
      return NextResponse.json(
        {
          error: "Failed to generate AI response",
          message: aiError instanceof Error ? aiError.message : String(aiError),
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Error processing file upload:", error)
    return NextResponse.json(
      {
        error: "Failed to process file",
        message: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    )
  }
}
