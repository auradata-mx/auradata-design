import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"

/** A quick look at the registry components with the AuraData theme. Storybook is the full catalog. */
export function App() {
  return (
    <main className="mx-auto flex min-h-svh max-w-xl flex-col gap-6 p-8">
      <header className="flex items-center gap-2">
        <h1 className="text-2xl font-semibold">AuraData design</h1>
        <Badge variant="secondary">registry</Badge>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Components</CardTitle>
          <CardDescription>Base UI and Tailwind 4, themed by @auradata/tokens.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          <Input placeholder="Search reports…" />
          <div className="flex gap-2">
            <Button>Primary</Button>
            <Button variant="outline">Outline</Button>
          </div>
        </CardContent>
      </Card>
      <p className="font-mono text-xs text-muted-foreground">Press d to toggle dark mode.</p>
    </main>
  )
}

export default App
