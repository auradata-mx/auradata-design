import { describe, expect, test } from 'vitest'

import { timeOf, timeOptions, withTime } from './date-time'

describe('timeOptions', () => {
  test('every 30 minutes of the day by default', () => {
    const options = timeOptions()
    expect(options).toHaveLength(48)
    expect(options.slice(0, 3)).toEqual(['00:00', '00:30', '01:00'])
    expect(options.at(-1)).toBe('23:30')
  })
  test('a step and a working day', () => {
    expect(timeOptions({ step: 60, min: '08:00', max: '12:00' })).toEqual(['08:00', '09:00', '10:00', '11:00', '12:00'])
  })
  test('15-minute steps', () => {
    expect(timeOptions({ step: 15, min: '09:00', max: '09:45' })).toEqual(['09:00', '09:15', '09:30', '09:45'])
  })
})

describe('timeOf', () => {
  test('the hours and minutes of a date, 24-hour', () => {
    expect(timeOf(new Date(2026, 10, 21, 14, 5))).toBe('14:05')
    expect(timeOf(new Date(2026, 10, 21, 0, 0))).toBe('00:00')
  })
  test('nothing for no date', () => {
    expect(timeOf(undefined)).toBeUndefined()
  })
})

describe('withTime', () => {
  test('the same day at another time', () => {
    expect(withTime(new Date(2026, 10, 21, 8, 0, 30), '14:30')).toEqual(new Date(2026, 10, 21, 14, 30))
  })
})
