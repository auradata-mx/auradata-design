'use client';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';

const DATASETS = ['Pedidos 2026', 'Clientes', 'Inventario por sucursal', 'Ventas por región', 'Nómina', 'Presupuesto anual'];

export default function ComboboxMultiple() {
  const anchor = useComboboxAnchor();

  return (
    <Field className="max-w-sm">
      <FieldLabel id="datasets-label" htmlFor="datasets">
        Datasets
      </FieldLabel>
      <Combobox multiple items={DATASETS} defaultValue={['Pedidos 2026', 'Clientes']}>
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value}>{value}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id="datasets"
                  aria-labelledby="datasets-label"
                  placeholder={values.length ? undefined : 'Busca un dataset'}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxEmpty>Sin resultados</ComboboxEmpty>
          <ComboboxList aria-labelledby="datasets-label">
            {(dataset: string) => (
              <ComboboxItem key={dataset} value={dataset}>
                {dataset}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>El informe cruza los datasets que elijas.</FieldDescription>
    </Field>
  );
}
