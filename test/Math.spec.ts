import { expect } from 'chai'
import { distance } from '../src/Math'

describe('Math', () => {
  describe('distance', () => {
    it('calculates correctly', () => {
      expect(distance(0, 0, 1, 0)).to.equal(1)
      expect(distance(0, 0, 1, 1)).to.equal(Math.sqrt(2))
      expect(distance(-1, 0, 1, 0)).to.equal(2)
      expect(distance(0, -2, 0, 2)).to.equal(4)
    })
  })
})
