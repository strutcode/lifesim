import Renderer from './Renderer'
// import TrueRandom from './TrueRandom'
import Cell from './Cell'
import { distance } from './Math'

export default class Simulation {
  public cells: Cell[] = []

  private renderer = new Renderer(this)
  private boundUpdate = this.update.bind(this)
  private lastTime = performance.now()
  private accTime = 0
  private rate = 60
  private efficiency = 0

  public constructor() {
    console.log('start simulation')
    // TrueRandom.int()

    for (let i = 0; i < 100; i++) this.cells.push(new Cell())

    window.requestAnimationFrame(this.boundUpdate)
  }

  public tick(delta: number) {
    const start = performance.now()
    const tickTime = 1000 / this.rate

    this.accTime += delta
    if (this.accTime > 2000) {
      const lostFrames = Math.floor((this.accTime - 2000) / tickTime)
      console.warn(`Skipping ${lostFrames} frames because simulation is behind`)
    }

    while (this.accTime >= tickTime) {
      for (let cell of this.cells) {
        let dist,
          nearestCell = Infinity

        for (let other of this.cells) {
          if (other === cell) continue

          dist = distance(cell.x, cell.y, other.x, other.y)
          if (dist < nearestCell) {
            nearestCell = dist
          }
        }
        cell.update(nearestCell)
      }

      this.accTime -= tickTime
    }

    const end = performance.now()
    const time = end - start

    this.efficiency = (tickTime - time) / tickTime
  }

  public get performance() {
    return this.efficiency * 100
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
