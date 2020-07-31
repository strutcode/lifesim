import BitField from './BitField'

type BrainInput = Record<string, number | string | number[]>

export default class Brain<T extends BrainInput> {
  private neurons: number[][] = []
  private inState: BitField
  private outState: BitField

  public constructor(inputs: T, outputs: number) {
    Object.values(inputs).forEach((value) => {
      if (typeof value === 'string') {
        this.neurons.length += value.length * 8
      } else if (typeof value === 'number') {
        this.neurons.length += 64
      } else {
        this.neurons.length += value.length * 64
      }
    })

    for (let i = 0; i < this.neurons.length; i++) {
      this.neurons[i] = Array(outputs).fill(0)
    }

    this.inState = new BitField(this.neurons.length)
    this.outState = new BitField(outputs)
  }

  public update(inputValues: T) {
    this.outState.fill(0)
    this.decomposeInput(inputValues, this.inState)

    for (let n = 0; n < this.inState.length; n++) {
      for (let o = 0; o < this.inState.length; o++) {
        if (Math.random() >= this.neurons[n][o]) {
          this.outState.set(o, 1)
        }
      }
    }
  }

  public output(num: number) {
    return this.outState.get(num)
  }

  public get size(): number {
    return this.neurons.length
  }

  private decomposeInput(values: T, output: BitField) {
    const objectValues = Object.values(values)
    let byte = 0

    for (let value of objectValues) {
      if (typeof value === 'string') {
        for (let i = 0; i < value.length; i++) {
          output.setByte(byte, value.charCodeAt(0))
          byte++
        }
      } else if (typeof value === 'number') {
        for (let b = 0; b < 4; b++) {
          output.setByte(byte, value >>> (b * 8))
          byte++
        }
      } else {
        for (let i = 0; i < 4; i++) {
          for (let b = 0; b < 4; b++) {
            output.setByte(byte, value[i] >>> (b * 8))
            byte++
          }
        }
      }
    }
  }
}
