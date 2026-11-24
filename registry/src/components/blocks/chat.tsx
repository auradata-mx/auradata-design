// registry: auradata (the AuraData BI chat panel on shadcn's chat primitives: ask your data with files, answers that stream in, cite their datasets and reports, show findings and take 👍/👎, failed answers that retry, the SQL it ran)
import {
  ArrowUpIcon,
  CircleAlertIcon,
  DatabaseIcon,
  FileIcon,
  FileImageIcon,
  FileSpreadsheetIcon,
  FileTextIcon,
  LayoutDashboardIcon,
  PaperclipIcon,
  RotateCwIcon,
  SparklesIcon,
  SquareIcon,
  XIcon,
} from "lucide-react"
import { useId, useRef, useState } from "react"
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts"
import { cn } from "cn"

import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentDescription,
  AttachmentGroup,
  AttachmentMedia,
  AttachmentTitle,
} from "@/components/ui/attachment"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { CodeBlock, CodeBlockContent } from "@/components/ui/code-block"
import { InsightCard } from "@/components/ui/insight-card"
import { KpiCard } from "@/components/ui/kpi-card"
import { Logo } from "@/components/ui/logo"
import { MessageFeedback, type FeedbackDetails, type FeedbackValue } from "@/components/ui/message-feedback"
import { Message, MessageAvatar, MessageContent } from "@/components/ui/message"
import {
  MessageScroller,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"
import { useScrollBlurViewport, ViewportScrollBlur } from "@/components/ui/progressive-blur"
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
import { formatNumber } from "@/lib/format"

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

/** A finding with its metric and «Ver detalle»: the props of `InsightCard`. */
export type ChatInsightEmbed = { type: "insight" } & Pick<
  React.ComponentProps<typeof InsightCard>,
  "title" | "value" | "change" | "goodDirection" | "comparison" | "description" | "action"
>

export type ChatEmbed = ChatKpiEmbed | ChatChartEmbed | ChatInsightEmbed

/** A dataset or report an answer used: a chip that links to it. */
export type ChatSource = { id: string; kind: "dataset" | "report"; label: string; href: string }

/** A file that went with a question: what the conversation shows of it. */
export type ChatAttachment = { name: string; size?: number; type?: string }

export type ChatMessage = {
  id: string
  role: "user" | "assistant"
  text: string
  /** The files a user's question carried. */
  attachments?: ChatAttachment[]
  /** KPI cards or charts under an assistant's text. */
  embeds?: ChatEmbed[]
  /** The SQL an assistant's answer ran: folded under «Ver consulta SQL». */
  sql?: string
  /** An assistant answer that failed: «No pudimos responder», the text as the reason, and «Reintentar». */
  status?: "error"
  /** The answer is still arriving: the app appends to `text`; a cursor follows it and new questions wait. */
  streaming?: boolean
  /** The reader's saved rating of this answer. */
  feedback?: FeedbackValue
  /** The datasets and reports an assistant's answer used, under «Fuentes». */
  sources?: ChatSource[]
}

type ChatProps = Omit<React.ComponentProps<"section">, "title"> & {
  messages: ChatMessage[]
  /** Called with the trimmed text and, when files were attached, the files; the box clears itself. */
  onSend: (text: string, files?: File[]) => void
  /** Lets the question carry files: «Adjuntar archivo» with the accepted types and how many at most (5). */
  attach?: { accept?: string; maxFiles?: number }
  /** An answer is on its way: shows a thinking row and holds new questions. */
  loading?: boolean
  /** «Reintentar» on a failed answer: called with that message's id. */
  onRetry?: (messageId: string) => void
  /** «Detener respuesta» while an answer streams in, in place of «Enviar». */
  onStop?: () => void
  /** 👍/👎 under each finished answer: called with its id, the rating (null when taken back) and the reason. */
  onFeedback?: (messageId: string, value: FeedbackValue | null, details?: FeedbackDetails) => void
  /** Questions to start with, shown while there are no messages. */
  suggestions?: string[]
  title?: string
  description?: string
  placeholder?: string
}

/** «840 KB», «1.2 MB»: the size of a file, in es-MX. */
function fileSize(bytes: number) {
  if (bytes < 1024) return `${formatNumber(bytes)} B`
  if (bytes < 1024 ** 2) return `${formatNumber(Math.round(bytes / 1024))} KB`
  return `${formatNumber(bytes / 1024 ** 2, { maximumFractionDigits: 1 })} MB`
}

function fileIcon(file: ChatAttachment) {
  const name = file.name.toLowerCase()
  if (file.type?.startsWith("image/")) return FileImageIcon
  if (/\.(csv|xlsx?|ods)$/.test(name) || file.type === "text/csv") return FileSpreadsheetIcon
  if (/\.(pdf|docx?|txt|md)$/.test(name)) return FileTextIcon
  return FileIcon
}

/** The files of a question: in a sent message, or in the composer with a remove button each. */
function FileChips({
  files,
  label,
  onRemove,
  className,
}: {
  files: ChatAttachment[]
  label: string
  onRemove?: (index: number) => void
  className?: string
}) {
  return (
    <AttachmentGroup role="list" aria-label={label} className={className}>
      {files.map((file, index) => {
        const Icon = fileIcon(file)
        return (
          <Attachment key={`${file.name}-${index}`} role="listitem" size="sm" className="bg-card">
            <AttachmentMedia>
              <Icon aria-hidden />
            </AttachmentMedia>
            <AttachmentContent>
              <AttachmentTitle>{file.name}</AttachmentTitle>
              {file.size !== undefined && <AttachmentDescription>{fileSize(file.size)}</AttachmentDescription>}
            </AttachmentContent>
            {onRemove && (
              <AttachmentActions>
                <AttachmentAction aria-label={`Quitar ${file.name}`} onClick={() => onRemove(index)}>
                  <XIcon aria-hidden />
                </AttachmentAction>
              </AttachmentActions>
            )}
          </Attachment>
        )
      })}
    </AttachmentGroup>
  )
}

function Embed({ embed }: { embed: ChatEmbed }) {
  if (embed.type === "insight") {
    return (
      <InsightCard
        title={embed.title}
        value={embed.value}
        change={embed.change}
        goodDirection={embed.goodDirection}
        comparison={embed.comparison}
        description={embed.description}
        action={embed.action}
        className="max-w-md"
      />
    )
  }
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
    // The same padding as the KPI card above it in the conversation.
    <Card className="max-w-lg">
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

const SOURCE = {
  dataset: { icon: DatabaseIcon, kind: "Dataset" },
  report: { icon: LayoutDashboardIcon, kind: "Informe" },
}

/** «Fuentes»: the datasets and reports an answer used, each a chip that links to it. */
function Sources({ sources }: { sources: ChatSource[] }) {
  const labelId = useId()
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span id={labelId} className="text-xs text-muted-foreground">
        Fuentes
      </span>
      <ul aria-labelledby={labelId} className="flex flex-wrap gap-1.5">
        {sources.map((source) => {
          const { icon: Icon, kind } = SOURCE[source.kind]
          return (
            <li key={source.id} className="min-w-0">
              <a
                href={source.href}
                data-slot="chat-source"
                className="inline-flex h-7 max-w-64 items-center gap-1.5 rounded-full border bg-card px-2.5 text-xs font-medium outline-none transition-colors hover:bg-muted focus-visible:ring-3 focus-visible:ring-ring/50 motion-reduce:transition-none"
              >
                <Icon aria-hidden className="size-3.5 shrink-0 text-muted-foreground" />
                <span className="sr-only">{kind}: </span>
                <span className="truncate">{source.label}</span>
              </a>
            </li>
          )
        })}
      </ul>
    </div>
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

function ChatMessageRow({
  message,
  onRetry,
  onFeedback,
}: {
  message: ChatMessage
  onRetry?: ChatProps["onRetry"]
  onFeedback?: ChatProps["onFeedback"]
}) {
  if (message.role === "user") {
    return (
      <Message align="end" data-slot="chat-message" data-role="user">
        <MessageContent className="items-end">
          {message.attachments && message.attachments.length > 0 && (
            // Sent files wrap and end flush with the bubble.
            <FileChips
              files={message.attachments}
              label="Archivos de la pregunta"
              className="flex-wrap justify-end overflow-visible"
            />
          )}
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
    <Message
      data-slot="chat-message"
      data-role="assistant"
      // Screen readers wait for the whole answer instead of reading every piece as it arrives.
      aria-busy={message.streaming || undefined}
      className="gap-3"
    >
      <AssistantAvatar />
      <MessageContent className="gap-3 pt-1">
        <Bubble variant="ghost">
          <BubbleContent className="whitespace-pre-wrap">
            {message.text}
            {message.streaming && (
              <span
                data-slot="chat-cursor"
                aria-hidden="true"
                className="ml-0.5 inline-block h-[1.1em] w-0.5 translate-y-[0.2em] animate-pulse rounded-full bg-foreground motion-reduce:animate-none"
              />
            )}
          </BubbleContent>
        </Bubble>
        {message.sources && message.sources.length > 0 && <Sources sources={message.sources} />}
        {message.sql && <SqlTrace sql={message.sql} />}
        {message.embeds?.map((embed, index) => <Embed key={index} embed={embed} />)}
        {onFeedback && !message.streaming && (
          <MessageFeedback
            defaultValue={message.feedback ?? null}
            onFeedback={(value, details) => onFeedback(message.id, value, details)}
            className="-ml-2"
          />
        )}
      </MessageContent>
    </Message>
  )
}

function Thinking() {
  return (
    <div className="flex gap-3">
      <AssistantAvatar />
      <div role="status" className="flex items-center gap-1">
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
  onStop,
  onFeedback,
  attach,
  suggestions = [],
  title = "Pregúntale a tus datos",
  description = "Escribe una pregunta sobre tus informes y datasets. Te respondo con números y gráficas.",
  placeholder = "Pregunta algo sobre tus datos…",
  className,
  ...props
}: ChatProps) {
  const [text, setText] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const fileInput = useRef<HTMLInputElement>(null)
  const [suggestionsViewport, suggestionsViewportRef] = useScrollBlurViewport<HTMLDivElement>()
  const inputId = useId()
  const titleId = useId()
  const maxFiles = attach?.maxFiles ?? 5
  // An answer streaming in holds new questions, as `loading` does.
  const busy = loading || messages.some((message) => message.streaming)
  const canSend = (text.trim() !== "" || files.length > 0) && !busy

  function send(value: string) {
    const trimmed = value.trim()
    if ((!trimmed && files.length === 0) || busy) return
    // Existing callers get the text alone, as before; files come as a second argument.
    if (files.length > 0) onSend(trimmed, files)
    else onSend(trimmed)
    setText("")
    setFiles([])
  }

  return (
    <section
      data-slot="chat"
      aria-labelledby={titleId}
      className={cn("flex h-full min-h-0 flex-col bg-background", className)}
      {...props}
    >
      {messages.length === 0 && !loading ? (
        <div className="relative isolate flex min-h-0 flex-1 flex-col">
          <div ref={suggestionsViewportRef} className="min-h-0 flex-1 overflow-y-auto">
            <div className="mx-auto flex min-h-full max-w-xl flex-col items-center justify-center gap-6 px-6 py-10 text-center">
              <span className="flex size-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
                <SparklesIcon aria-hidden className="size-6" />
              </span>
              <div className="grid gap-2">
                <h2 id={titleId} className="font-heading text-2xl font-semibold tracking-tight">
                  {title}
                </h2>
                <p className="text-sm text-balance text-muted-foreground">{description}</p>
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
          <ViewportScrollBlur viewport={suggestionsViewport} />
        </div>
      ) : (
        // The scroller keeps the latest message in view and lets the reader scroll back.
        <MessageScrollerProvider>
          <MessageScroller className="min-h-0 flex-1">
            {/* Visible from the first frame, as before: the stock viewport hides the messages until its
                first scroll, and a reader (or a test) arriving then would find nothing. */}
            {/* A gutter on both edges: one on the right only pushed the messages left of the composer. */}
            <MessageScrollerViewport
              aria-label="Mensajes"
              className="[scrollbar-gutter:stable_both-edges]! data-pending-scroll:visible"
            >
              <h2 id={titleId} className="sr-only">
                {title}
              </h2>
              {/* A log: screen readers announce new messages as they arrive. */}
              <MessageScrollerContent aria-live="polite" className="mx-auto w-full max-w-3xl px-4 py-6 md:px-6">
                {/* p-px: items contain their paint, and the cards' ring is drawn just outside them. */}
                {messages.map((message) => (
                  <MessageScrollerItem key={message.id} messageId={message.id} className="p-px">
                    <ChatMessageRow message={message} onRetry={onRetry} onFeedback={onFeedback} />
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
        <div className="relative rounded-xl border border-[color:var(--control-border,var(--input))] bg-card shadow-(--elevation-raised) focus-within:ring-3 focus-within:ring-ring/50">
          {files.length > 0 && (
            <FileChips
              files={files.map((file) => ({ name: file.name, size: file.size, type: file.type }))}
              label="Archivos adjuntos"
              onRemove={(index) => setFiles((current) => current.filter((_, at) => at !== index))}
              className="px-3 pt-3"
            />
          )}
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
            className={cn(
              "max-h-40 min-h-12 resize-none border-0 bg-transparent py-3 pr-14 pl-4 shadow-none focus-visible:ring-0 dark:bg-transparent",
              attach && "pl-12"
            )}
          />
          {attach && (
            <>
              <input
                ref={fileInput}
                type="file"
                multiple={maxFiles > 1}
                accept={attach.accept}
                data-slot="chat-file-input"
                tabIndex={-1}
                aria-hidden
                className="sr-only"
                onChange={(event) => {
                  const picked = Array.from(event.target.files ?? [])
                  setFiles((current) => [...current, ...picked].slice(0, maxFiles))
                  // The same file can be picked again after it was removed.
                  event.target.value = ""
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                aria-label="Adjuntar archivo"
                disabled={busy || files.length >= maxFiles}
                className="absolute bottom-2 left-2 rounded-lg text-muted-foreground"
                onClick={() => fileInput.current?.click()}
              >
                <PaperclipIcon aria-hidden />
              </Button>
            </>
          )}
          {busy && onStop ? (
            <Button
              type="button"
              size="icon"
              aria-label="Detener respuesta"
              className="absolute right-2 bottom-2 rounded-lg"
              onClick={onStop}
            >
              <SquareIcon aria-hidden className="fill-current" />
            </Button>
          ) : (
            <Button
              type="submit"
              size="icon"
              aria-label="Enviar"
              disabled={!canSend}
              className="absolute right-2 bottom-2 rounded-lg"
            >
              <ArrowUpIcon aria-hidden />
            </Button>
          )}
        </div>
      </form>
    </section>
  )
}

export { Chat }
