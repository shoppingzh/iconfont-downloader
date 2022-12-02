import { now } from '../../src/utils/date'

describe('now', () => {
  it('base', () => {
    expect(now()).toBeLessThanOrEqual(Date.now())
  })
})
