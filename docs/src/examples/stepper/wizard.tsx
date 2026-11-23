'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Field, FieldDescription, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Stepper } from '@/components/ui/stepper';

const steps = [
  { title: 'Base de datos', description: 'PostgreSQL, MySQL o BigQuery' },
  { title: 'Credenciales', description: 'Servidor, usuario y contraseña' },
  { title: 'Probar conexión', description: 'Revisamos que AuraData BI llegue' },
];

export default function StepperWizard() {
  const [current, setCurrent] = useState(0);
  const last = current === steps.length - 1;

  return (
    <div className="flex w-full max-w-xl flex-col gap-6 rounded-xl border bg-card p-4 sm:p-6">
      <Stepper steps={steps} current={current} onStepClick={setCurrent} aria-label="Pasos de la conexión" />
      <section aria-labelledby="stepper-wizard-step" className="flex flex-col gap-4">
        <h2 id="stepper-wizard-step" className="text-base font-semibold">
          {steps[current].title}
        </h2>
        {current === 0 && (
          <Field>
            <FieldLabel htmlFor="stepper-wizard-engine">Motor</FieldLabel>
            <Input id="stepper-wizard-engine" defaultValue="PostgreSQL" />
          </Field>
        )}
        {current === 1 && (
          <Field>
            <FieldLabel htmlFor="stepper-wizard-host">Servidor</FieldLabel>
            <Input id="stepper-wizard-host" defaultValue="db.auradata.mx" />
            <FieldDescription>El nombre o la IP del servidor.</FieldDescription>
          </Field>
        )}
        {current === 2 && (
          <p className="text-sm text-muted-foreground">Todo listo. Prueba la conexión antes de guardarla.</p>
        )}
      </section>
      <div className="flex justify-between gap-2">
        <Button variant="outline" disabled={current === 0} onClick={() => setCurrent((step) => step - 1)}>
          Anterior
        </Button>
        <Button onClick={() => (last ? setCurrent(0) : setCurrent((step) => step + 1))}>
          {last ? 'Probar y guardar' : 'Siguiente'}
        </Button>
      </div>
    </div>
  );
}
