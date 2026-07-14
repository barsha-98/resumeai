export type ExperienceLevel =
  | "Fresher"
  | "Internship"
  | "Junior"
  | "Mid-Level"
  | "Senior"

export type Tone = "Professional" | "Technical" | "Concise" | "Impactful"

export const EXPERIENCE_LEVELS: ExperienceLevel[] = [
  "Fresher",
  "Internship",
  "Junior",
  "Mid-Level",
  "Senior",
]

export const TONES: Tone[] = ["Professional", "Technical", "Concise", "Impactful"]

export interface GenerateRequest {
  jobTitle: string
  experience: string
  level: ExperienceLevel
  tone: Tone
  count: number
}

export interface GenerateResponse {
  bullets: string[]
}

export interface ATSResult {
  score: number
  actionVerbs: number
  keywords: number
  length: number
  clarity: number
}
