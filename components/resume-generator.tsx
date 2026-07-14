"use client"

import { useState } from "react"
import { toast } from "sonner"
import { OutputCard } from "@/components/output-card"
import { ResumeForm, type ResumeFormState } from "@/components/resume-form"

const INITIAL_FORM: ResumeFormState = {
  jobTitle: "",
  experience: "",
  level: "Internship",
  tone: "Professional",
  count: 5,
}

export function ResumeGenerator() {
  const [form, setForm] = useState<ResumeFormState>(INITIAL_FORM)
  const [bullets, setBullets] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const generate = async () => {
    if (form.jobTitle.trim().length === 0) {
      toast.error("Job title is required.")
      return
    }
    if (form.experience.trim().length < 30) {
      toast.error("Experience must be at least 30 characters.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const data = await res.json()

      if (!res.ok) {
        toast.error(data.error ?? "Something went wrong.")
        return
      }

      setBullets(data.bullets ?? [])
      toast.success("Resume bullets generated")
    } catch {
      toast.error("Network error. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const clear = () => {
    setBullets([])
    toast.success("Cleared")
  }

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <ResumeForm
        form={form}
        setForm={setForm}
        onSubmit={generate}
        isLoading={isLoading}
      />
      <OutputCard
        bullets={bullets}
        isLoading={isLoading}
        onBulletsChange={setBullets}
        onRegenerate={generate}
        onClear={clear}
        jobTitle={form.jobTitle}
      />
    </div>
  )
}
