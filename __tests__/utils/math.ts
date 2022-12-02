import { add } from '../../src/utils/math'

describe('add', () => {
  test('positive', () => {
    expect(add(1, 1)).toBe(2)
  })

  test('negative', () => {
    expect(add(-1, -1)).toBe(-2)
  })
})
