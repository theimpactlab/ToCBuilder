import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"
import { NextResponse } from "next/server"

export async function POST(req: Request) {
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

    const { text, documentContent } = await req.json()

    if (!text && !documentContent) {
      return NextResponse.json({ message: "No content provided" }, { status: 400 })
    }

    const contentToAnalyze = text || documentContent

    // Define the prompt once to reuse
    const prompt = `You are an expert in Theory of Change methodology for social impact organizations. 
    Analyze the following text and provide specific suggestions to improve a Theory of Change diagram.
    Focus on identifying: key needs, activities, outputs, outcomes, and impact.
    Format your response as 3-5 specific, actionable recommendations.
    
    Text to analyze: ${contentToAnalyze}`

    // Try with different models in order of preference
    const models = ["gpt-4o", "gpt-4", "gpt-3.5-turbo"]
    let lastError = null

    for (const modelName of models) {
      try {
        console.log(`Attempting to use model: ${modelName}`)

        const { text: analysis } = await generateText({
          model: openai(modelName),
          prompt: prompt,
          maxTokens: 500,
          apiKey: apiKey,
        })

        console.log(`Successfully used model: ${modelName}`)
        return NextResponse.json({
          suggestions: analysis,
          modelUsed: modelName,
        })
      } catch (modelError) {
        console.error(`Error with model ${modelName}:`, modelError)
        lastError = modelError

        // If this is not an access/quota error, don't try other models
        const errorMessage = modelError instanceof Error ? modelError.message : String(modelError)
        if (!errorMessage.includes("quota") && !errorMessage.includes("access") && !errorMessage.includes("billing")) {
          throw modelError
        }

        // Otherwise continue to the next model
      }
    }

    // If we get here, all models failed
    throw lastError || new Error("All models failed")
  } catch (error) {
    console.error("AI generation error:", error)

    // Convert error to string for analysis
    const errorMessage = error instanceof Error ? error.message : String(error)

    // Check for quota exceeded error
    if (errorMessage.includes("exceeded your current quota") || errorMessage.includes("billing details")) {
      return NextResponse.json(
        {
          message: "OpenAI API quota exceeded or model access issue",
          error:
            "You may not have access to the requested model or have exceeded your quota. Please check your OpenAI account.",
          errorType: "MODEL_ACCESS_OR_QUOTA",
        },
        { status: 429 },
      )
    } else if (errorMessage.includes("rate limit")) {
      return NextResponse.json(
        {
          message: "OpenAI API rate limit exceeded",
          error: "You have hit the rate limit for the OpenAI API. Please try again later or use simulation mode.",
          errorType: "RATE_LIMIT",
        },
        { status: 429 },
      )
    } else {
      return NextResponse.json(
        {
          message: "Error generating AI response",
          error: errorMessage,
          errorType: "GENERAL_ERROR",
        },
        { status: 500 },
      )
    }
  }
}
