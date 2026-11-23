'use client';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldError, FieldLabel } from '@/components/ui/field';

const DATASETS = ['Pedidos 2026', 'Clientes', 'Inventario por sucursal', 'Ventas por región'];

export default function ComboboxInvalid() {
  return (
    <Field className="max-w-xs" data-invalid>
      <FieldLabel htmlFor="dataset-invalid">Dataset</FieldLabel>
      <Combobox items={DATASETS}>
        <ComboboxInput id="dataset-invalid" placeholder="Busca un dataset" aria-invalid />
        <ComboboxContent>
          <ComboboxEmpty>Sin resultados</ComboboxEmpty>
          <ComboboxList>
            {(dataset: string) => (
              <ComboboxItem key={dataset} value={dataset}>
                {dataset}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldError>Elige el dataset del informe.</FieldError>
    </Field>
  );
}
