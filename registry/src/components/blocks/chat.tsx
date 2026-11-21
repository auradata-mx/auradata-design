// registry: auradata (the AuraData BI chat panel: ask your data, with failed answers that retry)
import { ArrowUpIcon, CircleAlertIcon, RotateCwIcon, SparklesIcon } from "lucide-react"
import { useEffect, useId, useRef, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { cn } from "cn"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { KpiCard } from "@/components/ui/kpi-card"
import { Logo } from "@/components/ui/logo"
import { Textarea } from "@/components/ui/textarea"
import { chartConfig } from "@/lib/chart-palette"

/** A KPI card inside an answer: the props of `KpiCard`. */
export type ChatKpiEmbed = { type: "kpi" } & Pick<
  React.ComponentProps<typeof KpiCard>,
  "label" | "value" | "change" | "comparison" | "goodDirection" | "trend"
>

/** A small bar chart inside an answer, colored by the brand palette in series order. */
export type ChatChartEmbed = {
  type: "chart"
  title: string
  data: Record<string, string | number>[]
  /** The category on the x axis, such as "mes". */
  xKey: string
  /** Series key → label, such as { norte: "Norte" }. */
  series: Record<string, string>
}

export type ChatEmbed = ChatKpiEmbed | ChatChartEmbed

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
  /** KPI cards or charts under an assistant's text. */
  embeds?: ChatEmbed[]
  /** An assistant answer that failed: «No pudimos responder», the text as the reason, and «Reintentar». */
  status?: "error"
}

type ChatProps = Omit<React.ComponentProps<"section">, "title"> & {
  messages: ChatMessage[]
  /** Called with the trimmed text; the box clears itself. */
  onSend: (text: string) => void
  /** An answer is on its way: shows a thinking row and holds new questions. */
  loading?: boolean
  /** «Reintentar» on a failed answer: called with that message's id. */
  onRetry?: (messageId: string) => void
  /** Questions to start with, shown while there are no messages. */
  suggestions?: string[]
  title?: string
  description?: string
  placeholder?: string
}

function Embed({ embed }: { embed: ChatEmbed }) {
  if (embed.type === "kpi") {
    return (
      <KpiCard
        label={embed.label}
        value={embed.value}
        change={embed.change}
        comparison={embed.comparison}
        goodDirection={embed.goodDirection}
        trend={embed.trend}
        className="max-w-sm"
      />
    )
  }
  const config = chartConfig(embed.series)
  return (
    <Card className="max-w-lg" size="sm">
      <CardHeader>
        <CardTitle>{embed.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="aspect-auto h-44 w-full">
          <BarChart data={embed.data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey={embed.xKey} tickLine={false} axisLine={false} />
            <ChartTooltip content={<ChartTooltipContent />} />
            {/* Keep the series order: Recharts sorts the legend by name otherwise. */}
            <ChartLegend content={<ChartLegendContent />} itemSorter={null} />
            {Object.keys(embed.series).map((key) => (
              <Bar key={key} dataKey={key} fill={`var(--color-${key})`} radius={4} />
            ))}
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

function AssistantAvatar() {
  return (
    <span className="flex size-8 shrink-0 items-center justify-center rounded-full border border-border bg-card">
      <Logo layout="mark" className="h-4" />
    </span>
  )
}

function Message({ message, onRetry }: { message: ChatMessage; onRetry?: (messageId: string) => void }) {
  if (message.role === "user") {
    return (
      <li data-slot="chat-message" data-role="user" className="flex justify-end">
        <p className="max-w-[80%] rounded-2xl rounded-br-md bg-primary px-4 py-2.5 text-sm whitespace-pre-wrap text-primary-foreground">
          {message.text}
        </p>
      </li>
    )
  }
  if (message.status === "error") {
    return (
      <li data-slot="chat-message" data-role="assistant" data-status="error" className="flex gap-3">
        <AssistantAvatar />
        <div className="grid min-w-0 flex-1 justify-items-start gap-2 pt-1">
          <p className="flex items-center gap-2 text-sm font-medium">
            <CircleAlertIcon aria-hidden className="size-4 shrink-0 text-destructive" />
            No pudimos responder
          </p>
          {message.text && <p className="text-sm text-muted-foreground">{message.text}</p>}
          {onRetry && (
            <Button variant="outline" size="sm" onClick={() => onRetry(message.id)}>
              <RotateCwIcon data-icon="inline-start" aria-hidden />
              Reintentar
            </Button>
          )}
        </div>
      </li>
    )
  }
  return (
    <li data-slot="chat-message" data-role="assistant" className="flex gap-3">
      <AssistantAvatar />
      <div className="grid min-w-0 flex-1 gap-3 pt-1">
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.text}</p>
        {message.embeds?.map((embed, index) => <Embed key={index} embed={embed} />)}
      </div>
    </li>
  )
}

function Thinking() {
  return (
    <li className="flex gap-3">
      <AssistantAvatar />
      <div role="status" className="flex items-center gap-1 pt-1">
        <span className="sr-only">Pensando…</span>
        {[0, 150, 300].map((delay) => (
          <span
            key={delay}
            aria-hidden
            style={{ animationDelay: `${delay}ms` }}
            className="size-1.5 animate-bounce rounded-full bg-muted-foreground motion-reduce:animate-none"
          />
        ))}
      </div>
    </li>
  )
}

/**
 * A conversation with AuraData BI: the messages, answers with KPI cards or charts, and a box to ask.
 * Pure UI: the app owns the messages and the model; this only renders them and reports what was asked.
 */
function Chat({
  messages,
  onSend,
  loading = false,
  onRetry,
  suggestions = [],
  title = "Pregúntale a tus datos",
  description = "Escribe una pregunta sobre tus informes y datasets. Te respondo con números y gráficas.",
  placeholder = "Pregunta algo sobre tus datos…",
  className,
  ...props
}: ChatProps) {
  const [text, setText] = useState("")
  const inputId = useId()
  const titleId = useId()
  const listRef = useRef<HTMLDivElement>(null)
  const canSend = text.trim() !== "" && !loading

  // Keep the latest message in view.
  useEffect(() => {
    const list = listRef.current
    if (list) list.scrollTop = list.scrollHeight
  }, [messages.length, loading])

  function send(value: string) {
    const trimmed = value.trim()
    if (!trimmed || loading) return
    onSend(trimmed)
    setText("")
  }

  return (
    <section
      data-slot="chat"
      aria-labelledby={titleId}
      className={cn("flex h-full min-h-0 flex-col bg-background", className)}
      {...props}
    >
      <div ref={listRef} className="min-h-0 flex-1 overflow-y-auto">
        {messages.length === 0 && !loading ? (
          <div className="mx-auto flex h-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-10 text-center">
            <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <SparklesIcon aria-hidden className="size-6" />
            </span>
            <div className="grid gap-2">
              <h2 id={titleId} className="font-heading text-2xl font-semibold tracking-tight">
                {title}
              </h2>
              <p className="text-sm text-pretty text-muted-foreground">{description}</p>
            </div>
            {suggestions.length > 0 && (
              <ul aria-label="Sugerencias" className="flex flex-wrap justify-center gap-2">
                {suggestions.map((suggestion) => (
                  <li key={suggestion}>
                    <Button variant="outline" className="h-auto rounded-full px-3 py-1.5" onClick={() => send(suggestion)}>
                      {suggestion}
                    </Button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ) : (
          <div className="mx-auto max-w-3xl px-4 py-6 md:px-6">
            <h2 id={titleId} className="sr-only">
              {title}
            </h2>
            {/* A log: screen readers announce new messages as they arrive. */}
            <div role="log" aria-live="polite">
              <ol className="flex flex-col gap-6">
                {messages.map((message) => (
                  <Message key={message.id} message={message} onRetry={onRetry} />
                ))}
                {loading && <Thinking />}
              </ol>
            </div>
          </div>
        )}
      </div>
      <form
        className="mx-auto w-full max-w-3xl px-4 pb-4 md:px-6"
        onSubmit={(event) => {
          event.preventDefault()
          send(text)
        }}
      >
        <div className="relative rounded-xl border border-input bg-card shadow-(--aura-shadow-card) focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50">
          <label htmlFor={inputId} className="sr-only">
            Mensaje
          </label>
          <Textarea
            id={inputId}
            value={text}
            placeholder={placeholder}
            rows={1}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              // Enter sends; Shift+Enter is a new line; never while an IME is composing.
              if (event.key === "Enter" && !event.shiftKey && !event.nativeEvent.isComposing) {
                event.preventDefault()
                send(text)
              }
            }}
            className="max-h-40 min-h-12 resize-none border-0 bg-transparent py-3 pr-14 pl-4 shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Enviar"
            disabled={!canSend}
            className="absolute right-2 bottom-2 rounded-lg"
          >
            <ArrowUpIcon aria-hidden />
          </Button>
        </div>
      </form>
    </section>
  )
}

export { Chat }
