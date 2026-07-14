"use client"

import { Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { EXPERIENCE_LEVELS, TONES } from "@/types/resume"
import type { ExperienceLevel, Tone } from "@/types/resume"

const MIN_EXPERIENCE = 30

export interface ResumeFormState {
  jobTitle: string
  experience: string
  level: ExperienceLevel
  tone: Tone
  count: number
}

interface ResumeFormProps {
  form: ResumeFormState
  setForm: (updater: (prev: ResumeFormState) => ResumeFormState) => void
  onSubmit: () => void
  isLoading: boolean
}

function countWords(text: string) {
  const trimmed = text.trim()
  return trimmed ? trimmed.split(/\s+/).length : 0
}

export function ResumeForm({ form, setForm, onSubmit, isLoading }: ResumeFormProps) {
  const jobTitleError = form.jobTitle.trim().length === 0
  const experienceError = form.experience.trim().length < MIN_EXPERIENCE
  const showJobTitleError = jobTitleError && form.jobTitle.length > 0
  const showExperienceError = experienceError && form.experience.length > 0

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (jobTitleError || experienceError) return
    onSubmit()
  }

  const words = countWords(form.experience)
  const chars = form.experience.trim().length
  const readTime = Math.max(1, Math.round(words / 200))

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Title */}
          <div className="space-y-2">
            <Label htmlFor="jobTitle">Job Title</Label>
            <Input
              id="jobTitle"
              placeholder="Frontend Developer Intern"
              value={form.jobTitle}
              aria-invalid={showJobTitleError}
              onChange={(e) =>
                setForm((p) => ({ ...p, jobTitle: e.target.value }))
              }
            />
            {showJobTitleError && (
              <p className="text-xs text-destructive">Job title is required.</p>
            )}
          </div>

          {/* Experience */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="experience">Experience</Label>
              <span className="text-xs text-muted-foreground tabular-nums">
                {words} words · {chars} chars · ~{readTime} min read
              </span>
            </div>
            <Textarea
              id="experience"
              rows={7}
              className="resize-none"
              placeholder={
                "Built a company website.\nWorked with React.\nFixed bugs.\nHelped senior developers.\nAttended meetings."
              }
              value={form.experience}
              aria-invalid={showExperienceError}
              onChange={(e) =>
                setForm((p) => ({ ...p, experience: e.target.value }))
              }
            />
            {showExperienceError && (
              <p className="text-xs text-destructive">
                Add at least {MIN_EXPERIENCE} characters ({MIN_EXPERIENCE - chars} to
                go).
              </p>
            )}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {/* Experience Level */}
            <div className="space-y-2">
              <Label>Experience Level</Label>
              <Select
                value={form.level}
                onValueChange={(v) =>
                  setForm((p) => ({ ...p, level: v as ExperienceLevel }))
                }
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {EXPERIENCE_LEVELS.map((level) => (
                    <SelectItem key={level} value={level}>
                      {level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Tone */}
            <div className="space-y-2">
              <Label>Tone</Label>
              <Select
                value={form.tone}
                onValueChange={(v) => setForm((p) => ({ ...p, tone: v as Tone }))}
              >
                <SelectTrigger className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {TONES.map((tone) => (
                    <SelectItem key={tone} value={tone}>
                      {tone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Number of bullets */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label>Number of Bullets</Label>
              <span className="text-sm font-medium tabular-nums">{form.count}</span>
            </div>
            <Slider
              min={3}
              max={8}
              step={1}
              value={form.count}
              onValueChange={(v) =>
                setForm((p) => ({
                  ...p,
                  count: Array.isArray(v) ? v[0] : v,
                }))
              }
            />
          </div>

          <Button
            type="submit"
            size="lg"
            disabled={isLoading}
            className="w-full gap-2 text-base"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-5 animate-spin" />
                Generating ATS Resume...
              </>
            ) : (
              <>
                <Sparkles className="size-5" />
                Generate Resume Bullets
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
