'use client';
import { useState } from 'react';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const pageSize = 20;
const total = 96;
const pages = Math.ceil(total / pageSize);

export default function PaginationControlled() {
  const [page, setPage] = useState(1);
  const go = (next: number) => (event: React.MouseEvent) => {
    event.preventDefault();
    setPage(Math.min(Math.max(next, 1), pages));
  };
  const first = (page - 1) * pageSize + 1;
  const last = Math.min(page * pageSize, total);

  return (
    <div className="grid gap-3">
      <p className="text-center text-sm text-muted-foreground" aria-live="polite">
        Datasets {first}–{last} de {total}
      </p>
      <Pagination aria-label="Páginas de datasets">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              href={`#pagina-${page - 1}`}
              onClick={go(page - 1)}
              aria-disabled={page === 1}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            />
          </PaginationItem>
          {Array.from({ length: pages }, (_, index) => index + 1).map((number) => (
            <PaginationItem key={number}>
              <PaginationLink
                href={`#pagina-${number}`}
                aria-label={`Página ${number}`}
                isActive={number === page}
                onClick={go(number)}
              >
                {number}
              </PaginationLink>
            </PaginationItem>
          ))}
          <PaginationItem>
            <PaginationNext
              href={`#pagina-${page + 1}`}
              onClick={go(page + 1)}
              aria-disabled={page === pages}
              className="aria-disabled:pointer-events-none aria-disabled:opacity-50"
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
