import { type NextRequest, NextResponse } from "next/server"
import { generateText } from "ai"
import { xai } from "@ai-sdk/xai"

export async function POST(req: NextRequest) {
  try {
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

    // Use Grok to analyze the extracted text
    const { text: analysis } = await generateText({
      model: xai("grok-1"),
      prompt: `You are an expert in Theory of Change methodology for social impact organizations. 
      Analyze the following text extracted from a document and provide specific suggestions to improve a Theory of Change diagram.
      Focus on identifying: key needs, activities, outputs, outcomes, and impact.
      Format your response as 3-5 specific, actionable recommendations.
      
      Text from document: ${fileText}`,
      maxTokens: 500,
    })

    return NextResponse.json({
      success: true,
      suggestions: analysis,
    })
  } catch (error) {
    console.error("Error processing file upload:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}
