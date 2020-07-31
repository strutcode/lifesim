import BitField from '../src/BitField'
import Brain from '../src/Brain'
import { expect } from 'chai'

describe('Brain', () => {
  describe('decomposeInput', () => {
    it('captures numbers correctly', () => {
      const bf = new BitField(64)

      new Brain({ num: 0 }, 1)['decomposeInput']({ num: 42 }, bf)
      expect(bf.getBytes()).to.eql([0, 0, 0, 0, 0, 0, 69, 64])

      new Brain({ num: 0 }, 1)['decomposeInput']({ num: 0.3 }, bf)
      expect(bf.getBytes()).to.eql([51, 51, 51, 51, 51, 51, 211, 63])
    })
  })
})
