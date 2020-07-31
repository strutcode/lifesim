export default class TrueRandom {
  private static buffer = new Int32Array(3000)
  private static bufferPointer = 0
  private static responseTime = 1
  private static rate = 0

  public static async init() {
    this.refillBuffer()
    setInterval(() => {
      if (this.bufferPointer <= this.rate) {
        this.refillBuffer()
      }

      this.rate = 0
    }, 1000)
  }

  private static async refillBuffer() {
    const encode = (input: Record<string, any>) =>
      Object.entries(input)
        .map((entry) => `${entry[0]}=${entry[1]}`)
        .join('&')

    const getNumbers = async () => {
      const start = performance.now()

      const params = {
        num: 50,
        min: -1e9,
        max: 1e9,
        col: 1,
        base: 10,
        format: 'plain',
        rnd: 'new',
      }

      if (params.num < 1) return []

      const response = await fetch(
        `https://www.random.org/integers/?${encode(params)}`,
      )

      let result: number[]

      if (response.ok && response.body) {
        const reader = response.body.getReader()
        const decoder = new TextDecoder('utf-8')

        let chunk,
          string = ''
        do {
          chunk = await reader.read()

          if (chunk.value?.length) {
            string += decoder.decode(chunk.value)
          }
        } while (!chunk.done)

        result = string.trim().split('\n').map(Number)
      } else {
        result = []
      }

      const end = performance.now()
      const time = end - start

      this.responseTime += (time / 1000 - this.responseTime) * 0.75
      this.rate = 0

      return result
    }

    const newNumbers = await getNumbers()

    newNumbers.forEach((num) => {
      const signBit = num < 0 ? 1 : 0
      this.buffer[++this.bufferPointer] = (num << 1) + signBit
    })
  }

  public static float() {
    this.rate++

    // Fall back to psuedo random for buffer underflow
    if (this.bufferPointer === 0) return Math.random()

    return this.buffer[this.bufferPointer--] / 1e10
  }

  public static int() {
    this.rate++

    // Fall back to psuedo random for buffer underflow
    if (this.bufferPointer === 0) return Math.floor(Math.random() * 1e10)

    return this.buffer[this.bufferPointer--]
  }
}

TrueRandom.init()
