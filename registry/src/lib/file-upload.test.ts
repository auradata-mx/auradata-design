import { describe, expect, test } from 'vitest'

import { formatFileSize, isNumericColumn, parseCsv, validateFile } from './file-upload'

const NBSP = '\u00a0'

describe('formatFileSize', () => {
  test.each([
    [0, `0${NBSP}B`],
    [512, `512${NBSP}B`],
    [840_000, `840${NBSP}KB`],
    [1_234_567, `1.2${NBSP}MB`],
    [10_000_000, `10${NBSP}MB`],
    [2_500_000_000, `2.5${NBSP}GB`],
  ])('%d bytes → %j', (bytes, text) => {
    expect(formatFileSize(bytes)).toBe(text)
  })
})

describe('validateFile', () => {
  const csv = { accept: '.csv,text/csv', maxSize: 10_000_000 }

  test('a CSV under the limit passes', () => {
    expect(validateFile({ name: 'ventas.csv', type: 'text/csv', size: 1000 }, csv)).toBeNull()
  })
  test('the extension is enough when the browser gives no type', () => {
    expect(validateFile({ name: 'VENTAS.CSV', type: '', size: 1000 }, csv)).toBeNull()
  })
  test('a MIME wildcard matches', () => {
    expect(validateFile({ name: 'logo.png', type: 'image/png', size: 1 }, { accept: 'image/*' })).toBeNull()
  })
  test('another type says which types it takes', () => {
    expect(validateFile({ name: 'informe.pdf', type: 'application/pdf', size: 1000 }, csv)).toEqual({
      code: 'type',
      message: '«informe.pdf» no es un archivo .csv.',
      reason: 'No es un archivo .csv.',
    })
  })
  test('a file over the limit says its size and the limit', () => {
    expect(validateFile({ name: 'pedidos.csv', type: 'text/csv', size: 12_400_000 }, csv)).toEqual({
      code: 'size',
      message: `«pedidos.csv» pesa 12.4${NBSP}MB; el máximo es 10${NBSP}MB.`,
      reason: `Pesa 12.4${NBSP}MB; el máximo es 10${NBSP}MB.`,
    })
  })
  test('no accept and no limit take anything', () => {
    expect(validateFile({ name: 'x', type: '', size: 9e12 }, {})).toBeNull()
  })
})

describe('parseCsv', () => {
  test('rows and columns', () => {
    expect(parseCsv('a,b\n1,2\n3,4')).toEqual([
      ['a', 'b'],
      ['1', '2'],
      ['3', '4'],
    ])
  })
  test('quoted fields keep commas, line breaks and doubled quotes', () => {
    expect(parseCsv('nombre,nota\n"Pérez, Ana","dijo ""sí""\nluego"\n')).toEqual([
      ['nombre', 'nota'],
      ['Pérez, Ana', 'dijo "sí"\nluego'],
    ])
  })
  test('CRLF, a byte order mark and a final blank line', () => {
    expect(parseCsv('\ufeffa,b\r\n1,2\r\n')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
  })
  test('semicolons when the first line uses them', () => {
    expect(parseCsv('región;ventas\nNorte;1,284.5')).toEqual([
      ['región', 'ventas'],
      ['Norte', '1,284.5'],
    ])
  })
  test('tabs when the first line uses them', () => {
    expect(parseCsv('a\tb\n1\t2')).toEqual([
      ['a', 'b'],
      ['1', '2'],
    ])
  })
  test('stops after maxRows rows', () => {
    expect(parseCsv('h\n1\n2\n3\n4', { maxRows: 3 })).toEqual([['h'], ['1'], ['2']])
  })
})

describe('isNumericColumn', () => {
  test.each([
    [['1,284,500', '642,900', ''], true],
    [['$1,284.50', '−2.1 %', '12'], true],
    [['nov 2026', '312'], false],
    [['', ''], false],
  ])('%j → %s', (values, numeric) => {
    expect(isNumericColumn(values)).toBe(numeric)
  })
})
