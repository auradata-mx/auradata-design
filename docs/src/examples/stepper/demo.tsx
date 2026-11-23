'use client';
import { Stepper } from '@/components/ui/stepper';

const steps = [
  { title: 'Base de datos', description: 'PostgreSQL, MySQL o BigQuery' },
  { title: 'Credenciales', description: 'Servidor, usuario y contraseña' },
  { title: 'Probar conexión', description: 'Revisamos que AuraData BI llegue' },
];

export default function StepperDemo() {
  return <Stepper steps={steps} current={1} className="max-w-xl" />;
}
