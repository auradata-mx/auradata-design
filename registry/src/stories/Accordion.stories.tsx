import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, within } from 'storybook/test'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'

const QUESTIONS = [
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
]

const meta = {
  title: 'Components/Accordion',
  component: Accordion,
  args: { className: 'max-w-lg' },
} satisfies Meta<typeof Accordion>

export default meta
type Story = StoryObj<typeof meta>

/** One answer open at a time. */
export const Default: Story = {
  args: { defaultValue: ['sources'] },
  render: (args) => (
    <Accordion {...args}>
      {QUESTIONS.map((item) => (
        <AccordionItem key={item.value} value={item.value}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
}

/** Several answers open together (`multiple`). */
export const Multiple: Story = {
  ...Default,
  args: { multiple: true, defaultValue: ['sources', 'share'] },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(canvas.getByRole('button', { name: QUESTIONS[0].question })).toHaveAttribute('aria-expanded', 'true')
    await expect(canvas.getByRole('button', { name: QUESTIONS[2].question })).toHaveAttribute('aria-expanded', 'true')
  },
}

/** An item that cannot open («¿Cada cuánto…?»): its trigger dims and shows the not-allowed cursor, and stays shut. */
export const DisabledItem: Story = {
  name: 'Disabled item',
  render: (args) => (
    <Accordion {...args}>
      {QUESTIONS.map((item, index) => (
        <AccordionItem key={item.value} value={item.value} disabled={index === 1}>
          <AccordionTrigger>{item.question}</AccordionTrigger>
          <AccordionContent>{item.answer}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  ),
  play: async ({ canvasElement }) => {
    const trigger = within(canvasElement).getByRole('button', { name: QUESTIONS[1].question })
    await userEvent.click(trigger)
    await expect(trigger).toHaveAttribute('aria-expanded', 'false')
    await expect(getComputedStyle(trigger).opacity).toBe('0.5')
    await expect(getComputedStyle(trigger).cursor).toBe('not-allowed')
    trigger.blur()
  },
}

/** A long question wraps under itself; the chevron stays at the top right. */
export const LongTrigger: Story = {
  name: 'Long trigger',
  args: { className: 'max-w-sm', defaultValue: ['long'] },
  render: (args) => (
    <Accordion {...args}>
      <AccordionItem value="long">
        <AccordionTrigger>
          ¿Por qué el total de ventas del informe no coincide con el del sistema contable al cierre de mes?
        </AccordionTrigger>
        <AccordionContent>
          El informe cuenta los pedidos por fecha de venta; contabilidad, por fecha de factura.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="other">
        <AccordionTrigger>¿Puedo cambiar la moneda?</AccordionTrigger>
        <AccordionContent>Sí, en los ajustes del espacio.</AccordionContent>
      </AccordionItem>
    </Accordion>
  ),
}
