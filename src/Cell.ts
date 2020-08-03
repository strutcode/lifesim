import Genome from './Genome'
import Brain from './Brain'
import BitField from './BitField'

export default class Cell {
  public size = 1
  private speed = 0.1
  private pos = [Math.random() * 20 - 10, Math.random() * 20 - 10]
  private input = {
    // food: Array(5),
    // cells: Array(5),
    nearestCell: 0,
    // size: 0,
  }
  private brain = new Brain(this.input, 4)
  private gene = new Genome(this.brain.size)

  lastCellDist = Infinity

  public constructor(gene?: BitField) {
    if (gene) {
      this.gene.load(gene)
    }

    ;(window as any).brain = this.brain
  }

  public get position() {
    return this.pos
  }

  public get x() {
    return this.pos[0]
  }

  public get y() {
    return this.pos[1]
  }

  public update(nearestCell: number) {
    const { speed } = this

    this.input.nearestCell = nearestCell

    this.brain.update(
      this.input,
      nearestCell < this.lastCellDist ? 1e-3 : -1e-2,
    )

    this.pos[0] += this.brain.output(0) * speed - this.brain.output(1) * speed
    this.pos[1] += this.brain.output(2) * speed - this.brain.output(3) * speed

    this.lastCellDist = nearestCell
  }
}
