import { describe, expect, test } from 'vitest'

import { caretAfterDigits, formatPhoneMx, isValidPhoneMx, phoneDigits, toE164Mx } from './phone'

describe('phoneDigits', () => {
  test.each([
    ['55 1234 5678', '5512345678'],
    ['(55) 1234-5678', '5512345678'],
    ['+52 55 1234 5678', '5512345678'],
    ['52 55 1234 5678', '5512345678'],
    ['+52 1 55 1234 5678', '5512345678'],
    ['5212345678', '5212345678'],
    ['55 1234 5678 99', '5512345678'],
    ['abc', ''],
  ])('%j → %j', (typed, digits) => {
    expect(phoneDigits(typed)).toBe(digits)
  })
})

describe('formatPhoneMx', () => {
  test.each([
    ['5512345678', '55 1234 5678'],
    ['3312345678', '33 1234 5678'],
    ['8112345678', '81 1234 5678'],
    ['9991234567', '999 123 4567'],
    ['5', '5'],
    ['551', '55 1'],
    ['551234', '55 1234'],
    ['5512345', '55 1234 5'],
    ['9991', '999 1'],
    ['9991234', '999 123 4'],
    ['', ''],
  ])('%j → %j', (digits, text) => {
    expect(formatPhoneMx(digits)).toBe(text)
  })
})

describe('isValidPhoneMx', () => {
  test.each([
    ['5512345678', true],
    ['9991234567', true],
    ['551234567', false],
    ['0512345678', false],
    ['1512345678', false],
    ['', false],
  ])('%j → %s', (digits, valid) => {
    expect(isValidPhoneMx(digits)).toBe(valid)
  })
})

test('toE164Mx adds the country code to a complete number only', () => {
  expect(toE164Mx('5512345678')).toBe('+525512345678')
  expect(toE164Mx('55123')).toBeNull()
})

describe('caretAfterDigits', () => {
  test('stays after the same digit when spaces move', () => {
    // "551|" typed → "55 1": the caret was after 3 digits, now after "55 1".
    expect(caretAfterDigits('551', 3, '55 1')).toBe(4)
  })
  test('at the start stays at the start', () => {
    expect(caretAfterDigits('551', 0, '55 1')).toBe(0)
  })
})
