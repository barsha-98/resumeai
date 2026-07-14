import { google } from "@ai-sdk/google"
import { generateText } from "ai"
import { NextResponse } from "next/server"
import { buildPrompt } from "@/lib/prompt"
import { EXPERIENCE_LEVELS, TONES } from "@/types/resume"
import type { ExperienceLevel, Tone } from "@/types/resume"

export const maxDuration = 30

function parseBullets(text: string): string[] {
  return text
    .split("\n")
    .map((line) =>
      line
        .trim()
        // strip leading bullets / numbering markers
        .replace(/^[-*•\u2022]\s*/, "")
        .replace(/^\d+[.)]\s*/, "")
        .trim(),
    )
    .filter((line) => line.length > 0)
}

export async function POST(req: Request) {
  if (!process.env.GOOGLE_GENERATIVE_AI_API_KEY) {
    return NextResponse.json(
      { error: "Missing GOOGLE_GENERATIVE_AI_API_KEY. Add it to your project settings." },
      { status: 500 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 })
  }

  const { jobTitle, experience, level, tone, count } = (body ?? {}) as Record<
    string,
    unknown
  >

  if (typeof jobTitle !== "string" || jobTitle.trim().length === 0) {
    return NextResponse.json({ error: "Job title is required." }, { status: 400 })
  }
  if (typeof experience !== "string" || experience.trim().length < 30) {
    return NextResponse.json(
      { error: "Experience must be at least 30 characters." },
      { status: 400 },
    )
  }

  const safeLevel: ExperienceLevel = EXPERIENCE_LEVELS.includes(level as ExperienceLevel)
    ? (level as ExperienceLevel)
    : "Fresher"
  const safeTone: Tone = TONES.includes(tone as Tone) ? (tone as Tone) : "Professional"
  const safeCount = Math.min(8, Math.max(3, Number(count) || 5))

  try {
    const { text } = await generateText({
      model: google("gemini-2.5-flash"),
      prompt: buildPrompt({
        jobTitle: jobTitle.trim(),
        experience: experience.trim(),
        level: safeLevel,
        tone: safeTone,
        count: safeCount,
      }),
      temperature: 0.6,
    })

    const bullets = parseBullets(text).slice(0, safeCount)

    if (bullets.length === 0) {
      return NextResponse.json(
        { error: "The model returned no usable bullets. Please try again." },
        { status: 502 },
      )
    }

    return NextResponse.json({ bullets })
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error"
    const isRateLimit = /rate|quota|429/i.test(message)
    const isAuth = /api key|api_key|unauthenticated|invalid.*key|permission|401|403/i.test(
      message,
    )

    let error = "Failed to generate resume bullets. Please try again."
    let status = 500
    if (isRateLimit) {
      error = "Rate limit reached. Please wait a moment and try again."
      status = 429
    } else if (isAuth) {
      error =
        "Your Gemini API key was rejected. Make sure GOOGLE_GENERATIVE_AI_API_KEY is a valid key from Google AI Studio (it should start with 'AIza')."
      status = 401
    }

    return NextResponse.json({ error }, { status })
  }
}
