// registry: auradata (the frequently asked questions of auradata.mx)
import { useId } from "react"
import { cn } from "cn"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { SectionHeader } from "@/components/ui/section-header"

export type FaqItem = { question: React.ReactNode; answer: React.ReactNode }

type FaqProps = Omit<React.ComponentProps<"section">, "title"> & {
  eyebrow?: React.ReactNode
  title: React.ReactNode
  highlight?: React.ReactNode
  description?: React.ReactNode
  items: FaqItem[]
  /** Open the first question on load. */
  openFirst?: boolean
}

/** Questions and answers as cards: the open one floats; several can be open at once. */
function Faq({ eyebrow, title, highlight, description, items, openFirst = true, className, ...props }: FaqProps) {
  const headingId = useId()
  return (
    <section
      data-slot="faq"
      aria-labelledby={headingId}
      className={cn("px-6 py-16 md:px-10 md:py-24", className)}
      {...props}
    >
      <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1fr_1.4fr]">
        <SectionHeader
          titleId={headingId}
          eyebrow={eyebrow}
          title={title}
          highlight={highlight}
          description={description}
        />
        <Accordion multiple defaultValue={openFirst && items.length ? [0] : []} className="gap-3">
          {items.map((item, index) => (
            <AccordionItem
              key={index}
              value={index}
              className="rounded-(--aura-radius-card) border border-border bg-card text-card-foreground shadow-(--elevation-raised) transition-shadow duration-500 ease-(--aura-ease-fluid) data-open:shadow-(--elevation-raised-hover)"
            >
              {/* The padding lives in the trigger, so its focus ring frames the whole row inside the card; the
                  chevron sits on the first line of a question that wraps. */}
              <AccordionTrigger className="gap-4 rounded-(--aura-radius-card) px-6 py-5 text-base font-semibold hover:no-underline focus-visible:border-transparent focus-visible:-outline-offset-2! **:data-[slot=accordion-trigger-icon]:mt-1">
                <span className="text-pretty">{item.question}</span>
              </AccordionTrigger>
              <AccordionContent className="max-w-172 px-6 pb-6 text-base leading-relaxed text-pretty text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  )
}

export { Faq }
