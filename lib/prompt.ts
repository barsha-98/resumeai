import type { GenerateRequest } from "@/types/resume"

export function buildPrompt({
  jobTitle,
  experience,
  level,
  tone,
  count,
}: GenerateRequest): string {
  return `You are an expert ATS resume writer.

Rewrite the following work experience into strong ATS-friendly resume bullet points.

Requirements:
- Start every bullet with a powerful action verb.
- Make every bullet measurable if possible.
- Keep each bullet under 25 words.
- Use professional language.
- Optimize for Applicant Tracking Systems.
- Avoid buzzwords.
- Return exactly ${count} bullet points.
- Return ONLY the bullet points, one per line, with no numbering, no markdown symbols, and no extra commentary.

Job Title:
${jobTitle}

Experience:
${experience}

Experience Level:
${level}

Tone:
${tone}

Number of bullets:
${count}`
}
