import type { Meta, StoryObj } from '@storybook/react-vite'

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'

const meta = {
  title: 'Components/Pagination',
  component: Pagination,
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

/** The pages of the report list: page 2 of 12. */
export const Default: Story = {
  render: (args) => (
    <div className="grid gap-3">
      <p className="text-center text-sm text-muted-foreground">Informes 21–40 de 236</p>
      <Pagination aria-label="Páginas de informes" {...args}>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#pagina-1" text="Anterior" aria-label="Página anterior" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#pagina-1" aria-label="Página 1">1</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#pagina-2" aria-label="Página 2" isActive>2</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#pagina-3" aria-label="Página 3">3</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#pagina-12" aria-label="Página 12">12</PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#pagina-3" text="Siguiente" aria-label="Página siguiente" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  ),
}
