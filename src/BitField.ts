export default class BitField {
  private value: Uint8Array

  public constructor(private size: number) {
    this.value = new Uint8Array(Math.ceil(size / 8))
  }

  public get length() {
    return this.size
  }

  public get(bit: number) {
    const byte = Math.floor(bit / 8)
    const bitN = bit % 8

    return this.value[byte] & (1 << bitN) ? 1 : 0
  }

  public getByte(byte: number) {
    return this.value[byte]
  }

  public set(bit: number, value: boolean | 0 | 1) {
    const byte = Math.floor(bit / 8)
    const bitN = bit % 8

    if (value) {
      this.value[byte] |= 1 << bitN
    } else {
      this.value[byte] &= ~(1 << bitN)
    }
  }

  public setByte(byte: number, value: number) {
    this.value[byte] = value
  }

  public fill(value: boolean | 0 | 1) {
    const byteVal = value ? 0xff : 0x00

    for (let i = 0; i < this.value.length; i++) {
      this.value[i] = byteVal
    }
  }

  public assign(input: BitField | string | number[]) {
    if (input instanceof BitField) {
      this.value = input.data()
    } else if (typeof input === 'string') {
      for (let c = 0; c < input.length; c++) {
        this.set(c, input.charAt(c) === '0')
      }
    } else {
      for (let c = 0; c < input.length; c++) {
        this.set(c, !!input[c])
      }
    }
  }

  public data(): Uint8Array {
    return this.value.slice()
  }
}
