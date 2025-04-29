import { NextResponse } from "next/server"
import { openai } from "@ai-sdk/openai"

export async function GET() {
  try {
    const apiKey = process.env.OPENAI_API_KEY

    // Check if API key exists
    if (!apiKey) {
      return NextResponse.json({
        status: "error",
        message: "OpenAI API key is missing",
        diagnostics: {
          hasApiKey: false,
          apiKeyLength: 0,
          environment: process.env.NODE_ENV,
        },
      })
    }

    // Basic validation of API key format (without revealing the key)
    const isValidFormat = apiKey.startsWith("sk-") && apiKey.length > 20

    // Test if we can create an OpenAI client
    let clientCreated = false
    try {
      const model = openai("gpt-4o")
      clientCreated = true
    } catch (clientError) {
      return NextResponse.json({
        status: "error",
        message: "Failed to create OpenAI client",
        error: clientError instanceof Error ? clientError.message : String(clientError),
        diagnostics: {
          hasApiKey: true,
          apiKeyLength: apiKey.length,
          apiKeyFormat: isValidFormat ? "valid" : "invalid",
          environment: process.env.NODE_ENV,
        },
      })
    }

    return NextResponse.json({
      status: "success",
      message: "Diagnostics completed",
      diagnostics: {
        hasApiKey: true,
        apiKeyLength: apiKey.length,
        apiKeyFormat: isValidFormat ? "valid" : "invalid",
        clientCreated,
        environment: process.env.NODE_ENV,
      },
    })
  } catch (error) {
    return NextResponse.json({
      status: "error",
      message: "Diagnostic error",
      error: error instanceof Error ? error.message : String(error),
    })
  }
}
