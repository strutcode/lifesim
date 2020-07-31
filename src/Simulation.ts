import Renderer from './Renderer'
// import TrueRandom from './TrueRandom'
import Cell from './Cell'

export default class Simulation {
  public cells: Cell[] = []

  private renderer = new Renderer(this)
  private boundUpdate = this.update.bind(this)
  private lastTime = performance.now()
  private accTime = 0
  private rate = 10

  public constructor() {
    console.log('start simulation')
    // TrueRandom.int()

    for (let i = 0; i < 10; i++) this.cells.push(new Cell())

    window.requestAnimationFrame(this.boundUpdate)
    setInterval(this.tick)
  }

  public tick(delta: number) {
    this.accTime += delta
    const tickTime = 1000 / this.rate

    while (this.accTime >= tickTime) {
      for (let cell of this.cells) {
        cell.update()
      }

      this.accTime -= tickTime
    }
  }

  public update() {
    const time = performance.now()
    const delta = time - this.lastTime

    this.tick(delta)
    this.renderer.draw()

    this.lastTime = time
    window.requestAnimationFrame(this.boundUpdate)
  }
}
