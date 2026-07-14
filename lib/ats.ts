import type { ATSResult } from "@/types/resume"

const ACTION_VERBS = [
  "achieved","built","created","designed","developed","delivered","drove",
  "engineered","enhanced","implemented","improved","increased","launched",
  "led","managed","optimized","reduced","spearheaded","streamlined","boosted",
  "automated","architected","coordinated","migrated","refactored","scaled",
  "shipped","accelerated","generated","initiated","resolved","transformed",
]

const NUMBER_RE = /\d|%|\$/

function startsWithActionVerb(bullet: string): boolean {
  const first = bullet.trim().toLowerCase().split(/\s+/)[0]?.replace(/[^a-z]/g, "")
  return ACTION_VERBS.includes(first ?? "")
}

/**
 * Lightweight heuristic ATS score out of 100.
 * Combines four weighted signals: action verbs, quantifiable keywords,
 * bullet length, and clarity.
 */
export function computeATSScore(bullets: string[]): ATSResult {
  if (bullets.length === 0) {
    return { score: 0, actionVerbs: 0, keywords: 0, length: 0, clarity: 0 }
  }

  const total = bullets.length

  const verbCount = bullets.filter(startsWithActionVerb).length
  const keywordCount = bullets.filter((b) => NUMBER_RE.test(b)).length
  const wellSized = bullets.filter((b) => {
    const words = b.trim().split(/\s+/).length
    return words >= 6 && words <= 25
  }).length
  const clear = bullets.filter((b) => !/\b(etc|things|stuff|various)\b/i.test(b)).length

  const actionVerbs = Math.round((verbCount / total) * 100)
  const keywords = Math.round((keywordCount / total) * 100)
  const length = Math.round((wellSized / total) * 100)
  const clarity = Math.round((clear / total) * 100)

  const score = Math.round(
    actionVerbs * 0.35 + keywords * 0.25 + length * 0.2 + clarity * 0.2,
  )

  return { score, actionVerbs, keywords, length, clarity }
}
