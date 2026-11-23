'use client';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const questions = [
  {
    value: 'sources',
    question: '¿Qué fuentes de datos puedo conectar?',
    answer: 'PostgreSQL, MySQL, SQL Server, BigQuery y archivos de Excel o CSV.',
  },
  {
    value: 'refresh',
    question: '¿Cada cuánto se actualizan los informes?',
    answer: 'Cada hora por omisión. Puedes cambiarlo en los ajustes del dataset.',
  },
  {
    value: 'share',
    question: '¿Puedo compartir un informe fuera de mi equipo?',
    answer: 'Sí, con un enlace de solo lectura que tú puedes revocar.',
  },
];

export default function AccordionMultiple() {
  return (
    <Accordion multiple defaultValue={['sources', 'share']} className="max-w-lg">
      {questions.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
