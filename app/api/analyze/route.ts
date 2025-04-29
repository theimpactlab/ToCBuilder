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

    // Basic validation of API key format
    if (!apiKey.startsWith("sk-") || apiKey.length < 20) {
      console.error("OpenAI API key appears to be invalid")
      return NextResponse.json(
        { message: "OpenAI API key appears to be invalid. Please check your API key format." },
        { status: 500 },
      )
    }

    const { text, documentContent } = await req.json()

    if (!text && !documentContent) {
      return NextResponse.json({ message: "No content provided" }, { status: 400 })
    }

    const contentToAnalyze = text || documentContent

    try {
      // Create a simple test prompt first to validate the API key
      const testPrompt = "Hello, this is a test. Please respond with 'API key is valid'."

      try {
        // Test the API key with a simple request
        await generateText({
          model: openai("gpt-3.5-turbo"), // Use a cheaper model for testing
          prompt: testPrompt,
          maxTokens: 10,
          apiKey: apiKey,
        })
      } catch (testError) {
        console.error("API key validation failed:", testError)
        return NextResponse.json(
          {
            message: "OpenAI API key validation failed",
            error: testError instanceof Error ? testError.message : String(testError),
          },
          { status: 500 },
        )
      }

      // If we get here, the API key is valid, proceed with the actual analysis
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

      // Check for common OpenAI API errors
      const errorMessage = aiError instanceof Error ? aiError.message : String(aiError)

      if (errorMessage.includes("API key")) {
        return NextResponse.json(
          {
            message: "Invalid OpenAI API key",
            error: errorMessage,
          },
          { status: 500 },
        )
      } else if (errorMessage.includes("rate limit")) {
        return NextResponse.json(
          {
            message: "OpenAI API rate limit exceeded",
            error: errorMessage,
          },
          { status: 429 },
        )
      } else {
        return NextResponse.json(
          {
            message: "Error generating AI response",
            error: errorMessage,
          },
          { status: 500 },
        )
      }
    }
  } catch (error) {
    console.error("Error in API route:", error)
    return NextResponse.json(
      { message: "Error processing your request", error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    )
  }
}
