import { expect } from 'chai'
import BitField from '../src/BitField'

describe('BitField', () => {
  it('hold bits correctly', () => {
    const bf = new BitField(8)

    expect(bf.getByte(0)).to.equal(0)

    bf.set(0, 1)
    expect(bf.getByte(0)).to.equal(0b00000001)

    bf.set(0, 0)
    expect(bf.getByte(0)).to.equal(0b00000000)
  })
})
