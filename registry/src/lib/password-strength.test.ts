import { describe, expect, test } from 'vitest'

import { passwordStrength } from './password-strength'

describe('passwordStrength', () => {
  test('empty: no level yet, every rule pending', () => {
    const result = passwordStrength('')
    expect(result.score).toBe(0)
    expect(result.label).toBe('')
    expect(result.rules.every((rule) => !rule.met)).toBe(true)
  })

  test.each([
    ['abc', 1, 'Débil'],
    ['abcdefgh', 1, 'Débil'],
    ['Abcdefgh', 2, 'Regular'],
    ['Abcdefg1', 3, 'Buena'],
    ['Abcdef1!', 4, 'Fuerte'],
    ['ventas2026', 2, 'Regular'],
  ])('%j → %d, %s', (password, score, label) => {
    expect(passwordStrength(password)).toMatchObject({ score, label })
  })

  test('short passwords stay weak, whatever they mix', () => {
    expect(passwordStrength('Ab1!')).toMatchObject({ score: 1, label: 'Débil' })
  })

  test('a common password is weak and says why', () => {
    expect(passwordStrength('Password1!')).toMatchObject({
      score: 1,
      label: 'Débil',
      hint: 'Es una contraseña muy común. Elige otra.',
    })
  })

  test('the rules, in Spanish, with which ones are met', () => {
    expect(passwordStrength('abcdefg1').rules).toEqual([
      { id: 'length', label: 'Al menos 8 caracteres', met: true },
      { id: 'case', label: 'Mayúsculas y minúsculas', met: false },
      { id: 'number', label: 'Un número', met: true },
      { id: 'symbol', label: 'Un símbolo, como ! o #', met: false },
    ])
  })

  test('accented letters count as letters, not symbols', () => {
    const rules = passwordStrength('Ñandú2026').rules
    expect(rules.find((rule) => rule.id === 'case')?.met).toBe(true)
    expect(rules.find((rule) => rule.id === 'symbol')?.met).toBe(false)
  })
})
