import Genome from './Genome'
import Brain from './Brain'
import BitField from './BitField'

export default class Cell {
  public size = 1
  private speed = 0.1
  private pos = [Math.random() * 20 - 10, Math.random() * 20 - 10]
  private brain = new Brain(
    {
      nearestFood: Array(5),
      nearestCell: Array(5),
      size: 0,
    },
    4,
  )
  private gene = new Genome(this.brain.size)

  public constructor(gene?: BitField) {
    if (gene) {
      this.gene.load(gene)
    }
  }

  public get position() {
    return this.pos
  }

  public update() {
    const { speed } = this

    this.brain.update({
      nearestFood: [0, 0, 0, 0, 0],
      nearestCell: [0, 0, 0, 0, 0],
      size: this.size,
    })

    this.pos[0] += this.brain.output(0) * speed + this.brain.output(1) * speed
    this.pos[1] += this.brain.output(2) * speed + this.brain.output(3) * speed
  }
}
