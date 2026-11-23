'use client';
import { Fragment } from 'react';
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb';

const trail = ['Espacio Operaciones Norte', 'Informes trimestrales', 'Inventario por almacén y proveedor'];

export default function BreadcrumbLongTrail() {
  return (
    <Breadcrumb className="max-w-sm">
      <BreadcrumbList>
        {trail.map((item) => (
          <Fragment key={item}>
            <BreadcrumbItem>
              <BreadcrumbLink href="#">{item}</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
          </Fragment>
        ))}
        <BreadcrumbItem>
          <BreadcrumbPage>Rotación de inventario de enero a noviembre de 2026</BreadcrumbPage>
        </BreadcrumbItem>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
