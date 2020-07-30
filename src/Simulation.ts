import Renderer from './Renderer'
// import TrueRandom from './TrueRandom'
import Cell from './Cell'

export default class Simulation {
  renderer = new Renderer(this)
  private boundUpdate = this.update.bind(this)
  public cells: Cell[] = [new Cell()]

  constructor() {
    console.log('start simulation')
    // TrueRandom.int()

    window.requestAnimationFrame(this.boundUpdate)
  }

  update() {
    this.renderer.draw()
    window.requestAnimationFrame(this.boundUpdate)
  }
}
