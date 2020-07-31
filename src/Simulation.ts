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
  private rate = 10

  public constructor() {
    console.log('start simulation')
    // TrueRandom.int()

    for (let i = 0; i < 10; i++) this.cells.push(new Cell())

    window.requestAnimationFrame(this.boundUpdate)
  }

  public tick(delta: number) {
    const tickTime = 1000 / this.rate

    this.accTime += delta
    if (this.accTime > 2000) {
      const lostFrames = Math.floor((this.accTime - 2000) / tickTime)
      console.warn(`Skipping ${lostFrames} frames due to inactivity`)
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
