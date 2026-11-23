'use client';
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from '@/components/ui/combobox';
import { Field, FieldLabel } from '@/components/ui/field';

const DATASETS = ['Pedidos 2026', 'Clientes', 'Inventario por sucursal', 'Ventas por región', 'Nómina', 'Presupuesto anual'];

export default function ComboboxDemo() {
  return (
    <Field className="max-w-xs">
      <FieldLabel htmlFor="dataset">Dataset</FieldLabel>
      <Combobox items={DATASETS}>
        <ComboboxInput id="dataset" placeholder="Busca un dataset" />
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
    </Field>
  );
}
