import BitField from './BitField'
import { clamp } from './Math'

type BrainInput = Record<string, number | string | number[]>

export default class Brain<T extends BrainInput> {
  private neurons: number[][][] = []
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

    let i,
      d = 0
    for (i = 0; i < this.neurons.length; i++) {
      d = Math.random()

      this.neurons[i] = Array(outputs)
        .fill(0)
        .map(() => [
          Math.random() * 0.25,
          Math.random() * 0.25,
          Math.random() * 0.25,
          Math.random() * 0.25,
        ])
    }

    this.inState = new BitField(this.neurons.length)
    this.outState = new BitField(outputs)
  }

  public update(inputValues: T, delta: number = 0) {
    let i, o, s

    // Reinforcement learning
    for (i = 0; i < this.inState.size; i++) {
      for (o = 0; o < this.outState.size; o++) {
        s = this.inState.get(i) + (this.outState.get(o) ? 2 : 3)

        this.neurons[i][o][0] -= delta
        this.neurons[i][o][1] -= delta
        this.neurons[i][o][2] -= delta
        this.neurons[i][o][3] -= delta
        this.neurons[i][o][s] += delta * 2
      }
    }

    // Reset for next iteration
    this.outState.fill(0)
    this.decomposeInput(inputValues, this.inState)

    // Fire neurons
    for (i = 0; i < this.inState.size; i++) {
      for (o = 0; o < this.outState.size; o++) {
        s = this.inState.get(i)

        if (
          Math.random() <= this.neurons[i][o][0] ||
          Math.random() <= this.neurons[i][o][1]
        ) {
          this.outState.set(o, 0)
        }
        if (
          Math.random() <= this.neurons[i][o][2] ||
          Math.random() <= this.neurons[i][o][3]
        ) {
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

  private numberBuffer = new ArrayBuffer(8)
  private floatView = new Float64Array(this.numberBuffer)
  private byteView = new Uint8Array(this.numberBuffer)
  private decomposeInput(values: T, output: BitField) {
    const objectValues = Object.values(values)

    let i,
      b,
      byte = 0
    for (let value of objectValues) {
      if (typeof value === 'string') {
        for (i = 0; i < value.length; i++) {
          output.setByte(byte, value.charCodeAt(0))
          byte++
        }
      } else if (typeof value === 'number') {
        this.floatView[0] = value
        for (b = 0; b < 8; b++) {
          output.setByte(byte, this.byteView[b])
          byte++
        }
      } else {
        for (i = 0; i < value.length; i++) {
          this.floatView[0] = value[i]
          for (b = 0; b < 8; b++) {
            output.setByte(byte, this.byteView[b])
            byte++
          }
        }
      }
    }
  }
}
