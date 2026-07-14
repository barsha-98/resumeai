"use client"

import { motion } from "framer-motion"
import type { ATSResult } from "@/types/resume"

function scoreColor(score: number) {
  if (score >= 80) return "bg-emerald-500"
  if (score >= 60) return "bg-amber-500"
  return "bg-destructive"
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between gap-3 text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium tabular-nums">{value}%</span>
    </div>
  )
}

export function ATSScore({ result }: { result: ATSResult }) {
  return (
    <div className="rounded-xl border border-border bg-secondary/40 p-4">
      <div className="mb-3 flex items-end justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            Estimated ATS Score
          </p>
          <p className="text-3xl font-semibold tabular-nums">
            {result.score}
            <span className="text-base text-muted-foreground">/100</span>
          </p>
        </div>
      </div>

      <div className="mb-4 h-2.5 w-full overflow-hidden rounded-full bg-muted">
        <motion.div
          className={`h-full rounded-full ${scoreColor(result.score)}`}
          initial={{ width: 0 }}
          animate={{ width: `${result.score}%` }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        <Metric label="Action verbs" value={result.actionVerbs} />
        <Metric label="Keywords" value={result.keywords} />
        <Metric label="Length" value={result.length} />
        <Metric label="Clarity" value={result.clarity} />
      </div>
    </div>
  )
}
