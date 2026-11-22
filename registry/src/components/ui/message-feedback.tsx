// registry: auradata (👍/👎 on an AI answer, with an optional reason after 👎)
"use client"

import * as React from "react"
import { ThumbsDownIcon, ThumbsUpIcon } from "lucide-react"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type FeedbackValue = "up" | "down"
type FeedbackDetails = { reason?: string; comment?: string }

type MessageFeedbackProps = Omit<React.ComponentProps<"div">, "defaultValue"> & {
  /**
   * Called at once with `up`, `down` or `null` (taken back), and once more with the details if the
   * reader explains a 👎.
   */
  onFeedback: (value: FeedbackValue | null, details?: FeedbackDetails) => void
  /** What the reader already chose, such as a saved rating. */
  defaultValue?: FeedbackValue | null
  /** The reasons offered after 👎. */
  reasons?: string[]
  /** Opens the reason form on mount, for the catalog and the visual tests. */
  defaultAsking?: boolean
}

const REASONS = ["Datos incorrectos", "Incompleta", "No entendió la pregunta", "Otra"]

/**
 * «Útil» and «No útil» under an answer. A 👎 asks «¿Qué falló?» with a few reasons and a comment, both
 * optional: «Enviar» sends them, «Omitir» keeps the 👎 alone.
 */
function MessageFeedback({
  onFeedback,
  defaultValue = null,
  reasons = REASONS,
  defaultAsking = false,
  className,
  ...props
}: MessageFeedbackProps) {
  const [value, setValue] = React.useState<FeedbackValue | null>(defaultValue)
  const [asking, setAsking] = React.useState(defaultAsking)
  const [thanked, setThanked] = React.useState(false)
  const [reason, setReason] = React.useState<string | null>(null)
  const [comment, setComment] = React.useState("")
  const groupId = React.useId()

  function choose(next: FeedbackValue) {
    const chosen = value === next ? null : next
    setValue(chosen)
    onFeedback(chosen)
    setAsking(chosen === "down")
    setThanked(chosen === "up")
  }

  function finish(send: boolean) {
    if (send && (reason || comment.trim())) {
      onFeedback("down", { ...(reason && { reason }), ...(comment.trim() && { comment: comment.trim() }) })
    }
    setAsking(false)
    setThanked(send)
  }

  return (
    <div data-slot="message-feedback" className={cn("grid justify-items-start gap-3", className)} {...props}>
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="Útil"
          aria-pressed={value === "up"}
          className="text-muted-foreground aria-pressed:text-foreground"
          onClick={() => choose("up")}
        >
          <ThumbsUpIcon aria-hidden className={cn(value === "up" && "fill-current")} />
        </Button>
        <Button
          variant="ghost"
          size="icon-sm"
          aria-label="No útil"
          aria-pressed={value === "down"}
          className="text-muted-foreground aria-pressed:text-foreground"
          onClick={() => choose("down")}
        >
          <ThumbsDownIcon aria-hidden className={cn(value === "down" && "fill-current")} />
        </Button>
        <span role="status" className="pl-1 text-xs text-muted-foreground">
          {thanked ? "Gracias por tu opinión." : ""}
        </span>
      </div>
      {asking && (
        <div
          role="group"
          aria-labelledby={groupId}
          className="grid w-full max-w-md gap-3 rounded-xl border bg-card p-4 text-card-foreground"
        >
          <p id={groupId} className="text-sm font-medium">
            ¿Qué falló?
          </p>
          <div className="flex flex-wrap gap-2">
            {reasons.map((option) => (
              <Button
                key={option}
                variant="outline"
                size="sm"
                aria-pressed={reason === option}
                className="rounded-full aria-pressed:border-primary aria-pressed:bg-primary/10 aria-pressed:text-foreground"
                onClick={() => setReason(reason === option ? null : option)}
              >
                {option}
              </Button>
            ))}
          </div>
          <label className="grid gap-1.5 text-sm">
            <span className="text-muted-foreground">Cuéntanos más (opcional)</span>
            <Textarea rows={2} value={comment} onChange={(event) => setComment(event.target.value)} className="min-h-16" />
          </label>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => finish(true)}>
              Enviar
            </Button>
            <Button size="sm" variant="ghost" onClick={() => finish(false)}>
              Omitir
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}

export { MessageFeedback, type FeedbackDetails, type FeedbackValue, type MessageFeedbackProps }
