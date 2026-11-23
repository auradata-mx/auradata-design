'use client';
import { useState } from 'react';
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from '@/components/ui/combobox';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';

/** Marks the option that creates the typed tag; never shown, never stored. */
const CREATE = '\u0000create:';

export default function ComboboxTags() {
  const anchor = useComboboxAnchor();
  const [tags, setTags] = useState(['finanzas', 'ventas', 'mensual', 'dirección']);
  const [value, setValue] = useState(['finanzas']);
  const [query, setQuery] = useState('');
  const typed = query.trim().toLocaleLowerCase('es-MX');
  const isNew = typed !== '' && !tags.includes(typed);
  const items = isNew ? [...tags, CREATE + typed] : tags;

  return (
    <Field className="max-w-sm">
      <FieldLabel id="report-tags-label" htmlFor="report-tags">
        Etiquetas
      </FieldLabel>
      <Combobox
        multiple
        items={items}
        value={value}
        inputValue={query}
        onInputValueChange={setQuery}
        onValueChange={(next: string[]) => {
          const created = next.find((tag) => tag.startsWith(CREATE));
          if (created) {
            const tag = created.slice(CREATE.length);
            setTags((current) => [...current, tag]);
            next = next.map((entry) => (entry === created ? tag : entry));
          }
          setValue(next);
          setQuery('');
        }}
      >
        <ComboboxChips ref={anchor}>
          <ComboboxValue>
            {(values: string[]) => (
              <>
                {values.map((tag) => (
                  <ComboboxChip key={tag}>{tag}</ComboboxChip>
                ))}
                <ComboboxChipsInput
                  id="report-tags"
                  aria-labelledby="report-tags-label"
                  placeholder={values.length ? undefined : 'Agrega una etiqueta'}
                />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>
        <ComboboxContent anchor={anchor}>
          <ComboboxList aria-labelledby="report-tags-label">
            {(tag: string) => (
              <ComboboxItem key={tag} value={tag}>
                {tag.startsWith(CREATE) ? `Crear «${tag.slice(CREATE.length)}»` : tag}
              </ComboboxItem>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
      <FieldDescription>Escribe una etiqueta nueva y presiona Enter para crearla.</FieldDescription>
    </Field>
  );
}
