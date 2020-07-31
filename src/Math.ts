export function clamp(min: number, val: number, max: number) {
  return val < min ? min : val > max ? max : val
}

export function distance(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x1 - x2) ** 2 + (y1 - y2) ** 2)
}
