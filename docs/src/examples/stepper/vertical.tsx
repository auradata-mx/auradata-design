'use client';
import { Stepper } from '@/components/ui/stepper';

const steps = [
  { title: 'Base de datos', description: 'PostgreSQL, MySQL o BigQuery' },
  { title: 'Credenciales', description: 'Servidor, usuario y contraseña' },
  { title: 'Probar conexión', description: 'Revisamos que AuraData BI llegue' },
  { title: 'Compartir', description: 'Quién del equipo la puede usar' },
];

export default function StepperVertical() {
  return <Stepper steps={steps} current={2} errors={[1]} orientation="vertical" className="max-w-xs" />;
}
