import BitField from './BitField'
import { clamp } from './Math'

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

  public update(inputValues: T, delta: number = 0) {
    // Reinforcement learning
    for (let n = 0; n < this.inState.size; n++) {
      for (let o = 0; o < this.outState.size; o++) {
        if (this.inState.get(n) && this.outState.get(o)) {
          this.neurons[n][o] = clamp(0, this.neurons[n][o] + delta, 1)
        } else {
          this.neurons[n][o] = clamp(0, this.neurons[n][o] - delta, 1)
        }
      }
    }

    // Reset for next iteration
    this.outState.fill(0)
    this.decomposeInput(inputValues, this.inState)

    // Fire neurons
    for (let n = 0; n < this.inState.size; n++) {
      for (let o = 0; o < this.outState.size; o++) {
        // Random misfire
        if (Math.random() <= 1e-3) {
          this.outState.set(o, 1)
        }

        if (Math.random() <= this.neurons[n][o]) {
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
    const numberBuffer = new ArrayBuffer(8)
    const floatView = new Float64Array(numberBuffer)
    const byteView = new Uint8Array(numberBuffer)

    let byte = 0
    for (let value of objectValues) {
      if (typeof value === 'string') {
        for (let i = 0; i < value.length; i++) {
          output.setByte(byte, value.charCodeAt(0))
          byte++
        }
      } else if (typeof value === 'number') {
        floatView[0] = value
        for (let b = 0; b < 8; b++) {
          output.setByte(byte, byteView[b])
          byte++
        }
      } else {
        for (let i = 0; i < value.length; i++) {
          floatView[0] = value[i]
          for (let b = 0; b < 8; b++) {
            output.setByte(byte, byteView[b])
            byte++
          }
        }
      }
    }
  }
}
