// registry: auradata (the steps of a wizard, horizontal or vertical: done, current, with errors and to come, in words for screen readers too («Credenciales (completado)»), and done steps that open again)
"use client"

import * as React from "react"
import { cn } from "cn"
import { CheckIcon, XIcon } from "lucide-react"

type StepStatus = "complete" | "current" | "error" | "upcoming"

type Step = {
  title: string
  /** One line under the title; hidden on a phone in the horizontal stepper. */
  description?: string
}

type StepperProps = Omit<React.ComponentProps<"nav">, "children"> & {
  steps: Step[]
  /** The index of the step being filled in. */
  current: number
  /** Steps with something to fix, by index: they show an error whatever their place. */
  errors?: number[]
  orientation?: "horizontal" | "vertical"
  /** Makes the steps before `current` (and those with errors) buttons that open them again. */
  onStepClick?: (index: number) => void
}

const STATUS_TEXT: Record<StepStatus, string> = {
  complete: "completado",
  current: "paso actual",
  error: "con errores",
  upcoming: "pendiente",
}

function statusOf(index: number, current: number, errors: number[]) {
  if (errors.includes(index)) return "error"
  if (index < current) return "complete"
  return index === current ? "current" : "upcoming"
}

/**
 * Where the person is in a wizard. Each step says its state in words for screen readers («completado», «con
 * errores»); the current one is `aria-current="step"`. Horizontal fits a page header; vertical, a side column.
 */
function Stepper({
  steps,
  current,
  errors = [],
  orientation = "horizontal",
  onStepClick,
  className,
  "aria-label": ariaLabel = "Pasos",
  ...props
}: StepperProps) {
  return (
    <nav
      data-slot="stepper"
      data-orientation={orientation}
      aria-label={ariaLabel}
      className={cn("group/stepper w-full", className)}
      {...props}
    >
      <ol
        className={cn(
          "flex",
          orientation === "horizontal" ? "items-start gap-2" : "flex-col"
        )}
      >
        {steps.map((step, index) => {
          const status = statusOf(index, current, errors)
          const clickable =
            onStepClick !== undefined &&
            index !== current &&
            (status === "complete" || status === "error")
          const Tag = clickable ? "button" : "div"
          return (
            <li
              key={step.title}
              data-slot="stepper-item"
              data-status={status}
              aria-current={status === "current" ? "step" : undefined}
              className={cn(
                "group/step relative flex min-w-0",
                orientation === "horizontal"
                  ? "flex-1 items-center gap-2 last:flex-none"
                  : "gap-3 pb-6 last:pb-0"
              )}
            >
              <Tag
                {...(clickable
                  ? {
                      type: "button" as const,
                      onClick: () => onStepClick(index),
                    }
                  : {})}
                className={cn(
                  "flex min-w-0 items-start gap-2 rounded-md text-left",
                  clickable &&
                    "cursor-pointer hover:[&_[data-slot=stepper-title]]:underline",
                  orientation === "horizontal" &&
                    "shrink-0 max-sm:group-not-data-[status=current]/step:shrink"
                )}
              >
                <span
                  data-slot="stepper-indicator"
                  aria-hidden
                  className={cn(
                    "relative z-10 flex size-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums transition-colors [&_svg]:size-4",
                    status === "complete" &&
                      "border-primary bg-primary text-primary-foreground",
                    status === "current" &&
                      "border-2 border-primary bg-background text-foreground",
                    status === "error" &&
                      "border-destructive bg-destructive text-destructive-foreground",
                    status === "upcoming" &&
                      "border-[color:var(--control-border,var(--input))] bg-background text-muted-foreground"
                  )}
                >
                  {status === "complete" ? (
                    <CheckIcon />
                  ) : status === "error" ? (
                    <XIcon />
                  ) : (
                    index + 1
                  )}
                </span>
                <span
                  className={cn(
                    "flex min-w-0 flex-col gap-0.5 pt-1",
                    // On a phone the horizontal stepper keeps only the current step's title.
                    orientation === "horizontal" &&
                      "max-sm:group-not-data-[status=current]/step:sr-only"
                  )}
                >
                  <span
                    data-slot="stepper-title"
                    className={cn(
                      "text-sm leading-tight font-medium text-pretty",
                      status === "upcoming" && "text-muted-foreground",
                      status === "error" && "text-destructive"
                    )}
                  >
                    {step.title}
                    <span className="sr-only"> ({STATUS_TEXT[status]})</span>
                  </span>
                  {step.description && (
                    <span
                      data-slot="stepper-description"
                      className={cn(
                        "text-xs leading-snug text-pretty text-muted-foreground",
                        orientation === "horizontal" && "max-sm:hidden"
                      )}
                    >
                      {step.description}
                    </span>
                  )}
                </span>
              </Tag>
              {index < steps.length - 1 && (
                <span
                  data-slot="stepper-connector"
                  aria-hidden
                  className={cn(
                    "bg-[color:var(--control-border,var(--input))] group-data-[status=complete]/step:bg-primary",
                    orientation === "horizontal"
                      ? "mt-3.5 h-px min-w-4 flex-1 self-start"
                      : "absolute top-8 bottom-1 left-3.5 w-px -translate-x-1/2"
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}

export { Stepper }
export type { Step, StepStatus, StepperProps }
