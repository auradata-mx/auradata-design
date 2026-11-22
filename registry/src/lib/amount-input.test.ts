import { describe, expect, test } from 'vitest'

import { caretAfterFormat, finishAmountInput, formatAmountInput } from './amount-input'

describe('formatAmountInput', () => {
  test.each([
    ['1234567', '1,234,567', 1234567],
    ['1234.5', '1,234.5', 1234.5],
    ['1234.567', '1,234.56', 1234.56],
    ['12.', '12.', 12],
    ['.5', '0.5', 0.5],
    ['0012', '12', 12],
    ['0', '0', 0],
    ['$1,284,500.75', '1,284,500.75', 1284500.75],
    ['1.2.3', '1.23', 1.23],
    ['abc', '', null],
    ['', '', null],
  ])('%j → %j', (typed, text, value) => {
    expect(formatAmountInput(typed)).toEqual({ text, value })
  })

  test('no decimals when the field takes whole pesos', () => {
    expect(formatAmountInput('1234.56', { maxFractionDigits: 0 })).toEqual({ text: '1,234', value: 1234 })
  })
})

describe('finishAmountInput', () => {
  test.each([
    ['1,234.5', '1,234.50'],
    ['1,234.', '1,234'],
    ['1,234', '1,234'],
    ['', ''],
  ])('%j → %j on blur', (text, finished) => {
    expect(finishAmountInput(text)).toBe(finished)
  })
})

describe('caretAfterFormat', () => {
  test('stays after the same digit when a separator appears', () => {
    // "123|4" typed into "1234" → "1,234": the caret was after 3 digits, now after "1,23".
    expect(caretAfterFormat('1234', 3, '1,234')).toBe(4)
  })
  test('stays after the decimal point', () => {
    expect(caretAfterFormat('1234.', 5, '1,234.')).toBe(6)
  })
  test('at the start stays at the start', () => {
    expect(caretAfterFormat('1234', 0, '1,234')).toBe(0)
  })
  test('after a deleted separator, before the next digit', () => {
    // "1,|234" with the comma deleted → "1234" → "1,234": caret after the 1.
    expect(caretAfterFormat('1234', 1, '1,234')).toBe(1)
  })
})
