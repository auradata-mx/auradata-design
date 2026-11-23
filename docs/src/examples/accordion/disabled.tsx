'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

export default function AccordionDisabled() {
  return (
    <Accordion className="max-w-lg">
      <AccordionItem value="sources">
        <AccordionTrigger>¿Qué fuentes de datos puedo conectar?</AccordionTrigger>
        <AccordionContent>PostgreSQL, MySQL, SQL Server, BigQuery y archivos de Excel o CSV.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="refresh" disabled>
        <AccordionTrigger>¿Cada cuánto se actualizan los informes?</AccordionTrigger>
        <AccordionContent>Cada hora por omisión. Puedes cambiarlo en los ajustes del dataset.</AccordionContent>
      </AccordionItem>
      <AccordionItem value="share">
        <AccordionTrigger>¿Puedo compartir un informe fuera de mi equipo?</AccordionTrigger>
        <AccordionContent>Sí, con un enlace de solo lectura que tú puedes revocar.</AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
