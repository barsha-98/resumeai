"use client"

import { AnimatePresence, motion } from "framer-motion"
import {
  Check,
  Copy,
  CopyCheck,
  Eraser,
  FileDown,
  FileText,
  Pencil,
  RefreshCw,
  FileSearch,
} from "lucide-react"
import { useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ATSScore } from "@/components/ats-score"
import { computeATSScore } from "@/lib/ats"

interface OutputCardProps {
  bullets: string[]
  isLoading: boolean
  onBulletsChange: (bullets: string[]) => void
  onRegenerate: () => void
  onClear: () => void
  jobTitle: string
}

function BulletRow({
  bullet,
  index,
  onChange,
}: {
  bullet: string
  index: number
  onChange: (value: string) => void
}) {
  const [editing, setEditing] = useState(false)
  const [copied, setCopied] = useState(false)

  const copy = async () => {
    await navigator.clipboard.writeText(bullet)
    setCopied(true)
    toast.success("Copied to clipboard")
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <motion.li
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25, delay: index * 0.04 }}
      className="group flex items-start gap-3 rounded-lg border border-border bg-secondary/30 p-3"
    >
      <span className="mt-1 size-1.5 shrink-0 rounded-full bg-primary" aria-hidden />
      {editing ? (
        <Textarea
          autoFocus
          value={bullet}
          onChange={(e) => onChange(e.target.value)}
          onBlur={() => setEditing(false)}
          className="min-h-16 flex-1 resize-none text-sm"
        />
      ) : (
        <p className="flex-1 text-sm leading-relaxed text-pretty">{bullet}</p>
      )}

      <div className="flex shrink-0 items-center gap-1 opacity-70 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Edit bullet"
          onClick={() => setEditing((v) => !v)}
        >
          {editing ? <Check className="size-4" /> : <Pencil className="size-4" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8"
          aria-label="Copy bullet"
          onClick={copy}
        >
          {copied ? <CopyCheck className="size-4 text-emerald-500" /> : <Copy className="size-4" />}
        </Button>
      </div>
    </motion.li>
  )
}

export function OutputCard({
  bullets,
  isLoading,
  onBulletsChange,
  onRegenerate,
  onClear,
  jobTitle,
}: OutputCardProps) {
  const [copiedAll, setCopiedAll] = useState(false)
  const hasBullets = bullets.length > 0

  const updateBullet = (index: number, value: string) => {
    const next = [...bullets]
    next[index] = value
    onBulletsChange(next)
  }

  const copyAll = async () => {
    await navigator.clipboard.writeText(bullets.map((b) => `• ${b}`).join("\n"))
    setCopiedAll(true)
    toast.success("All bullets copied")
    setTimeout(() => setCopiedAll(false), 1500)
  }

  const downloadTxt = () => {
    const blob = new Blob([bullets.map((b) => `• ${b}`).join("\n")], {
      type: "text/plain;charset=utf-8",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "resume-bullets.txt"
    a.click()
    URL.revokeObjectURL(url)
    toast.success("Downloaded TXT")
  }

  const downloadPdf = async () => {
    const { jsPDF } = await import("jspdf")
    const doc = new jsPDF({ unit: "pt", format: "letter" })
    const marginX = 56
    let y = 72

    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text(jobTitle ? `${jobTitle} — Resume Bullets` : "Resume Bullets", marginX, y)
    y += 28

    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    const width = doc.internal.pageSize.getWidth() - marginX * 2

    bullets.forEach((bullet) => {
      const lines = doc.splitTextToSize(`•  ${bullet}`, width) as string[]
      if (y + lines.length * 16 > doc.internal.pageSize.getHeight() - 56) {
        doc.addPage()
        y = 72
      }
      doc.text(lines, marginX, y)
      y += lines.length * 16 + 6
    })

    doc.save("resume-bullets.pdf")
    toast.success("Downloaded PDF")
  }

  return (
    <Card className="h-full">
      <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-base">Generated Bullets</CardTitle>
        {hasBullets && !isLoading && (
          <Button variant="secondary" size="sm" className="gap-2" onClick={copyAll}>
            {copiedAll ? (
              <CopyCheck className="size-4 text-emerald-500" />
            ) : (
              <Copy className="size-4" />
            )}
            Copy All
          </Button>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading ? (
          <div className="space-y-3" aria-live="polite" aria-busy="true">
            {Array.from({ length: 5 }).map((_, i) => (
              <div
                key={i}
                className="h-16 animate-pulse rounded-lg border border-border bg-muted/60"
              />
            ))}
          </div>
        ) : hasBullets ? (
          <>
            <ATSScore result={computeATSScore(bullets)} />

            <ul className="space-y-2">
              <AnimatePresence initial={false}>
                {bullets.map((bullet, i) => (
                  <BulletRow
                    key={i}
                    index={i}
                    bullet={bullet}
                    onChange={(value) => updateBullet(i, value)}
                  />
                ))}
              </AnimatePresence>
            </ul>

            <div className="flex flex-wrap gap-2 pt-1">
              <Button variant="default" size="sm" className="gap-2" onClick={onRegenerate}>
                <RefreshCw className="size-4" />
                Regenerate
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={downloadTxt}>
                <FileText className="size-4" />
                Download TXT
              </Button>
              <Button variant="outline" size="sm" className="gap-2" onClick={downloadPdf}>
                <FileDown className="size-4" />
                Download PDF
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="gap-2 text-muted-foreground"
                onClick={onClear}
              >
                <Eraser className="size-4" />
                Clear
              </Button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed border-border py-16 text-center">
            <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
              <FileSearch className="size-6" />
            </span>
            <p className="max-w-xs text-sm text-muted-foreground text-pretty">
              Your generated resume bullets will appear here.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
