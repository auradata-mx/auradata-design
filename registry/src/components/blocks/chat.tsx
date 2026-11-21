// registry: auradata (the AuraData BI chat panel on shadcn's chat primitives: ask your data, failed answers that retry, the SQL it ran)
import { ArrowUpIcon, CircleAlertIcon, DatabaseIcon, RotateCwIcon, SparklesIcon } from "lucide-react"
import { useId, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { cn } from "cn"

import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { KpiCard } from "@/components/ui/kpi-card"
import { Logo } from "@/components/ui/logo"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { Textarea } from "@/components/ui/textarea"
import {
  Trace,
  TraceCollapsible,
  TraceCollapsibleContent,
  TraceCollapsibleTrigger,
  TraceIcon,
  TraceLine,
  TraceTitle,
} from "@/components/ui/trace"
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
  /** The SQL an assistant's answer ran: folded under «Ver consulta SQL». */
  sql?: string
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
    <MessageAvatar className="size-8 self-start border border-border bg-card">
      <Logo layout="mark" className="h-4" />
    </MessageAvatar>
  )
}

/** The SQL behind an answer, folded: «Ver consulta SQL» opens it. */
function SqlTrace({ sql }: { sql: string }) {
  return (
    <Trace>
      <TraceCollapsible>
        <TraceCollapsibleTrigger>
          <TraceLine>
            <TraceIcon>
              <DatabaseIcon />
            </TraceIcon>
            <TraceTitle>Ver consulta SQL</TraceTitle>
          </TraceLine>
        </TraceCollapsibleTrigger>
        <TraceCollapsibleContent>
          <CodeBlock size="sm">
            <CodeBlockContent>{sql}</CodeBlockContent>
          </CodeBlock>
        </TraceCollapsibleContent>
      </TraceCollapsible>
    </Trace>
  )
}

function ChatMessageRow({ message, onRetry }: { message: ChatMessage; onRetry?: (messageId: string) => void }) {
  if (message.role === "user") {
    return (
      <Message align="end" data-slot="chat-message" data-role="user">
        <MessageContent>
          <Bubble align="end">
            <BubbleContent className="rounded-2xl rounded-br-md px-4 py-2.5 whitespace-pre-wrap">{message.text}</BubbleContent>
          </Bubble>
        </MessageContent>
      </Message>
    )
  }
  if (message.status === "error") {
    return (
      <Message data-slot="chat-message" data-role="assistant" data-status="error" className="gap-3">
        <AssistantAvatar />
        <MessageContent className="items-start gap-2 pt-1">
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
        </MessageContent>
      </Message>
    )
  }
  return (
    <Message data-slot="chat-message" data-role="assistant" className="gap-3">
      <AssistantAvatar />
      <MessageContent className="gap-3 pt-1">
        <Bubble variant="ghost">
          <BubbleContent className="whitespace-pre-wrap">{message.text}</BubbleContent>
        </Bubble>
        {message.sql && <SqlTrace sql={message.sql} />}
        {message.embeds?.map((embed, index) => <Embed key={index} embed={embed} />)}
      </MessageContent>
    </Message>
  )
}

function Thinking() {
  return (
    <div className="flex gap-3">
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
    </div>
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
  const canSend = text.trim() !== "" && !loading

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
      {messages.length === 0 && !loading ? (
        <div className="min-h-0 flex-1 overflow-y-auto">
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
        </div>
      ) : (
        // The scroller keeps the latest message in view and lets the reader scroll back.
        <MessageScrollerProvider>
          <MessageScroller className="min-h-0 flex-1">
            {/* Visible from the first frame, as before: the stock viewport hides the messages until its
                first scroll, and a reader (or a test) arriving then would find nothing. */}
            <MessageScrollerViewport aria-label="Mensajes" className="data-pending-scroll:visible">
              <h2 id={titleId} className="sr-only">
                {title}
              </h2>
              {/* A log: screen readers announce new messages as they arrive. */}
              <MessageScrollerContent aria-live="polite" className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
                {/* p-px: items contain their paint, and the cards' ring is drawn just outside them. */}
                {messages.map((message) => (
                  <MessageScrollerItem key={message.id} messageId={message.id} className="p-px">
                    <ChatMessageRow message={message} onRetry={onRetry} />
                  </MessageScrollerItem>
                ))}
                {loading && (
                  <MessageScrollerItem>
                    <Thinking />
                  </MessageScrollerItem>
                )}
              </MessageScrollerContent>
            </MessageScrollerViewport>
          </MessageScroller>
        </MessageScrollerProvider>
      )}
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
