import { expect, test } from 'vitest'

import { initials } from './initials'

test('takes the first letter of the first two words, in capitals', () => {
  expect(initials('Ana López')).toBe('AL')
  expect(initials('operaciones norte sur')).toBe('ON')
  expect(initials('  Ventas ')).toBe('V')
})
