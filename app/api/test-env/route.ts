import { NextResponse } from "next/server"

export async function GET() {
  // Check if we can access environment variables
  // Don't include the actual API key in the response for security
  const hasApiKey = !!process.env.OPENAI_API_KEY

  // List all environment variables (keys only, not values)
  const envKeys = Object.keys(process.env).filter(
    (key) =>
      !key.toLowerCase().includes("key") &&
      !key.toLowerCase().includes("secret") &&
      !key.toLowerCase().includes("password"),
  )

  return NextResponse.json({
    message: "Environment variables test",
    hasOpenAiKey: hasApiKey,
    environmentVariables: envKeys,
    nodeEnv: process.env.NODE_ENV,
  })
}
