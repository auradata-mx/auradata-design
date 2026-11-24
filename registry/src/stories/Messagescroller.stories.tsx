import * as React from "react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import {
  MessageScroller,
  MessageScrollerButton,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerProvider,
  MessageScrollerViewport,
} from "@/components/ui/message-scroller"

const meta = {
  title: "AuraData/Message scroller",
  component: MessageScroller,
} satisfies Meta<typeof MessageScroller>

export default meta
type Story = StoryObj<typeof meta>

function Messages({ initialCount }: { initialCount: number }) {
  const [count, setCount] = React.useState(initialCount)

  return (
    <div className="grid w-full max-w-md justify-items-start gap-3">
      <MessageScrollerProvider autoScroll>
        <MessageScroller className="h-44 rounded-lg border">
          <MessageScrollerViewport aria-label="Report updates">
            <MessageScrollerContent aria-live="polite" className="gap-2 p-4">
              {Array.from({ length: count }, (_, index) => (
                <MessageScrollerItem
                  key={index}
                  messageId={String(index)}
                  className="rounded-lg bg-muted p-3 text-sm"
                >
                  Report update {index + 1} is ready.
                </MessageScrollerItem>
              ))}
            </MessageScrollerContent>
          </MessageScrollerViewport>
          <MessageScrollerButton behavior="instant" />
        </MessageScroller>
      </MessageScrollerProvider>
      <Button variant="outline" onClick={() => setCount((current) => current + 1)}>
        Add update
      </Button>
    </div>
  )
}

export const Default: Story = {
  render: () => <Messages initialCount={7} />,
}

export const Append: Story = {
  render: () => <Messages initialCount={1} />,
}
