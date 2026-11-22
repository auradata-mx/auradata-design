// registry: auradata (the first steps of a new AuraData account, with their progress and the next action)
"use client"

import * as React from "react"
import { CheckIcon, XIcon } from "lucide-react"
import { cn } from "cn"

import { Button, buttonVariants } from "@/components/ui/button"
import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress, ProgressLabel, ProgressValue } from "@/components/ui/progress"

type OnboardingStep = {
  id: string
  title: string
  /** One line: what the step does. Shown while the step is pending. */
  description?: string
  done?: boolean
  /** The button that does the step: a link with `href`, a button with `onClick`. */
  action?: { label: string; href?: string; onClick?: () => void }
}

type OnboardingChecklistProps = Omit<React.ComponentProps<"div">, "title"> & {
  steps: OnboardingStep[]
  title?: React.ReactNode
  description?: React.ReactNode
  /** Hides the guide: «Ocultar guía» in the header and «Listo» once every step is done. */
  onDismiss?: () => void
}

function StepAction({ action, primary }: { action: NonNullable<OnboardingStep["action"]>; primary: boolean }) {
  const variant = primary ? "default" : "outline"
  if (action.href) {
    return (
      <a
        href={action.href}
        data-variant={variant}
        // cn merges the variant classes, as Button does: raw, `border-transparent` would hide the outline border.
        className={cn(buttonVariants({ variant, size: "sm" }))}
        onClick={action.onClick}
      >
        {action.label}
      </a>
    )
  }
  return (
    <Button variant={variant} size="sm" onClick={action.onClick}>
      {action.label}
    </Button>
  )
}

/**
 * A card with the steps to get started («Conecta tu primera base de datos»), their progress
 * («1 de 4 pasos») and one button per pending step; the next one leads with the primary button.
 */
function OnboardingChecklist({
  steps,
  title = "Empieza con AuraData BI",
  description = "Unos pasos para tener tus datos en un informe.",
  onDismiss,
  className,
  ...props
}: OnboardingChecklistProps) {
  const titleId = React.useId()
  const done = steps.filter((step) => step.done).length
  const complete = done === steps.length
  const next = steps.find((step) => !step.done)
  const progressText = `${done} de ${steps.length} pasos`

  return (
    <Card
      data-slot="onboarding-checklist"
      role="region"
      aria-labelledby={titleId}
      className={cn("gap-5", className)}
      {...props}
    >
      <CardHeader>
        <CardTitle id={titleId} className="text-base font-semibold">
          {title}
        </CardTitle>
        <CardDescription>{description}</CardDescription>
        {onDismiss && (
          <CardAction>
            <Button variant="ghost" size="icon-sm" aria-label="Ocultar guía" className="-mt-1 -mr-1.5" onClick={onDismiss}>
              <XIcon aria-hidden />
            </Button>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className="grid gap-5">
        <Progress value={done} max={steps.length} getAriaValueText={() => progressText} className="gap-2">
          <ProgressLabel className="sr-only">Progreso</ProgressLabel>
          <ProgressValue className="ml-0 text-xs">{() => progressText}</ProgressValue>
        </Progress>
        {complete ? (
          <div role="status" className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm">Todo listo. Ya puedes explorar tus datos.</p>
            {onDismiss && (
              <Button size="sm" onClick={onDismiss}>
                Listo
              </Button>
            )}
          </div>
        ) : (
          <ol className="grid gap-1">
            {steps.map((step) => {
              const labelId = `${titleId}-${step.id}`
              return (
                <li
                  key={step.id}
                  aria-labelledby={labelId}
                  data-done={step.done || undefined}
                  className="grid grid-cols-[1.25rem_minmax(0,1fr)] gap-x-3 gap-y-2 py-2"
                >
                  <span
                    aria-hidden
                    className={cn(
                      "flex size-5 items-center justify-center rounded-full border",
                      step.done
                        ? "border-transparent bg-success text-success-foreground"
                        : "border-[color:var(--control-border,var(--input))]"
                    )}
                  >
                    {step.done && <CheckIcon className="size-3" strokeWidth={3} />}
                  </span>
                  <div className="grid gap-0.5">
                    <p id={labelId} className={cn("text-sm font-medium", step.done && "text-muted-foreground")}>
                      {step.title}
                      {step.done && <span className="sr-only"> (hecho)</span>}
                    </p>
                    {!step.done && step.description && (
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    )}
                  </div>
                  {!step.done && step.action && (
                    <div className="col-start-2">
                      <StepAction action={step.action} primary={step === next} />
                    </div>
                  )}
                </li>
              )
            })}
          </ol>
        )}
      </CardContent>
    </Card>
  )
}

export { OnboardingChecklist, type OnboardingStep }
