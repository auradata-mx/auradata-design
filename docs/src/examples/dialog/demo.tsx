'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

export default function DialogDemo() {
  return (
    <Dialog>
      <DialogTrigger render={<Button variant="outline" />}>Renombrar informe</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Renombrar informe</DialogTitle>
          <DialogDescription>El nombre nuevo se ve en la lista y en los enlaces compartidos.</DialogDescription>
        </DialogHeader>
        <Field>
          <FieldLabel htmlFor="dialog-report-name">Nombre</FieldLabel>
          <Input id="dialog-report-name" defaultValue="Ventas 2026" />
        </Field>
        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>Cancelar</DialogClose>
          <DialogClose render={<Button />}>Guardar cambios</DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
