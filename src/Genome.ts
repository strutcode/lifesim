import BitField from './BitField'

export default class Genome {
  private store: BitField

  public constructor(size: number) {
    this.store = new BitField(size)
  }

  public load(...args: Parameters<BitField['assign']>) {
    this.store.assign(...args)
  }
}
