'use client';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

export default function PaginationDemo() {
  return (
    <div className="grid gap-3">
      <p className="text-center text-sm text-muted-foreground">Informes 21–40 de 236</p>
      <Pagination aria-label="Páginas de informes">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious href="#pagina-1" />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#pagina-1" aria-label="Página 1">
              1
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#pagina-2" aria-label="Página 2" isActive>
              2
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#pagina-3" aria-label="Página 3">
              3
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationEllipsis />
          </PaginationItem>
          <PaginationItem>
            <PaginationLink href="#pagina-12" aria-label="Página 12">
              12
            </PaginationLink>
          </PaginationItem>
          <PaginationItem>
            <PaginationNext href="#pagina-3" />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
