/**
 * Environment variables utility
 *
 * This file provides type-safe access to environment variables
 * with fallbacks for optional values.
 */

// App configuration
export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME || "Theory of Change Builder"
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"

// Feature flags
export const ENABLE_COLLABORATION = process.env.NEXT_PUBLIC_ENABLE_COLLABORATION === "true"
export const ENABLE_TEMPLATES = process.env.NEXT_PUBLIC_ENABLE_TEMPLATES === "true"
export const ENABLE_AUTO_SAVE = process.env.NEXT_PUBLIC_ENABLE_AUTO_SAVE !== "false" // Default to true

// API Keys (server-side only)
export const getServerEnv = () => ({
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || "",

  // Storage configuration (if implemented)
  STORAGE_PROVIDER: process.env.STORAGE_PROVIDER || "local",
  STORAGE_BUCKET: process.env.STORAGE_BUCKET || "",
  STORAGE_REGION: process.env.STORAGE_REGION || "",
})

// Validate required environment variables
export function validateEnv() {
  const requiredServerVars = ["OPENAI_API_KEY"]
  const missingVars = requiredServerVars.filter((name) => !process.env[name])

  if (missingVars.length > 0) {
    throw new Error(`Missing required environment variables: ${missingVars.join(", ")}`)
  }

  return true
}
