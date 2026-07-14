import { Star, Globe, Sparkles } from "lucide-react"
import { Navbar } from "@/components/navbar"
import { ResumeGenerator } from "@/components/resume-generator"

export default function Page() {
  return (
    <div className="flex min-h-dvh flex-col">
      <Navbar />

      <main className="flex-1">
        {/* Hero */}
        <section className="mx-auto max-w-5xl px-4 pt-14 pb-8 text-center sm:px-6 sm:pt-20">
          <div className="mx-auto mb-5 inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Sparkles className="size-3.5 text-primary" />
            AI-powered · ATS-optimized
          </div>
          <h1 className="mx-auto max-w-3xl text-balance text-4xl font-semibold tracking-tight sm:text-5xl">
            Create ATS-Friendly Resume Bullets in Seconds
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-pretty text-base leading-relaxed text-muted-foreground sm:text-lg">
            Paste your work experience and let AI rewrite it into impactful resume
            bullets that recruiters actually want to read.
          </p>
        </section>

        {/* Generator */}
        <section className="mx-auto max-w-5xl px-4 pb-20 sm:px-6">
          <ResumeGenerator />
        </section>
      </main>

      <footer className="border-t border-border/60">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-6 text-sm text-muted-foreground sm:flex-row sm:px-6">
          <p>Built with Next.js + Gemini</p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Star className="size-4" />
              Star
            </a>
            <a
              href="https://vercel.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 transition-colors hover:text-foreground"
            >
              <Globe className="size-4" />
              Website
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
