import {
  createProgramInfo,
  ProgramInfo,
  primitives,
  drawBufferInfo,
  setUniforms,
  setBuffersAndAttributes,
  m4,
} from 'twgl.js'

import Simulation from './Simulation'

export default class Renderer {
  canvas: HTMLCanvasElement = document.createElement('canvas')
  context!: WebGLRenderingContext
  shader!: ProgramInfo
  projection = m4.identity()
  pan = {
    x: 0,
    y: 0,
  }
  zoom = 1

  constructor(private simulation: Simulation) {
    this.initCanvas()
    this.initGfx()
    this.initInput()
  }

  private initCanvas() {
    const context = this.canvas.getContext('webgl')

    if (!context) {
      throw `Couldn't initialize renderer`
    }

    this.context = context

    Object.assign(this.canvas.style, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
    })

    this.canvas.width = window.innerWidth
    this.canvas.height = window.innerHeight

    document.body.appendChild(this.canvas)
  }

  private initGfx() {
    const program = this.loadShader('circle')

    if (!program) {
      throw `Couldn't load shader`
    }

    this.shader = program
  }

  private initInput() {
    document.addEventListener('pointerdown', () => {
      const move = (ev: MouseEvent) => {
        const { aspect, zoom } = this
        const { width, height } = this.canvas

        this.pan.x -= ev.movementX * (1 / width) * 20 * aspect * zoom
        this.pan.y -= ev.movementY * (1 / height) * 20 * zoom
      }

      const up = () => {
        document.removeEventListener('pointermove', move)
        document.removeEventListener('pointerup', up)
      }

      document.addEventListener('pointermove', move)
      document.addEventListener('pointerup', up)
    })

    document.addEventListener('wheel', (ev) => {
      if (ev.deltaY > 0) {
        this.zoom *= 1.2
      } else {
        this.zoom *= 0.8
      }
    })
  }

  private loadShader(name: string) {
    try {
      const vs = require(`./shaders/${name}.vs.glsl`).default
      const fs = require(`./shaders/${name}.fs.glsl`).default

      return createProgramInfo(this.context, [vs, fs])
    } catch (e) {
      console.error(e)
    }
  }

  public get aspect() {
    return this.canvas.width / this.canvas.height
  }

  public draw() {
    const gl = this.context

    gl.clearColor(0, 0, 0, 1)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.disable(gl.DEPTH_TEST)
    gl.enable(gl.BLEND)
    gl.blendFuncSeparate(
      gl.SRC_ALPHA,
      gl.ONE_MINUS_SRC_ALPHA,
      gl.ONE,
      gl.ONE_MINUS_SRC_ALPHA,
    )

    gl.canvas.width = window.innerWidth
    gl.canvas.height = window.innerHeight
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

    const { pan, zoom, aspect } = this
    m4.ortho(
      -10 * zoom * aspect + pan.x,
      10 * zoom * aspect + pan.x,
      10 * zoom + pan.y,
      -10 * zoom + pan.y,
      0,
      1,
      this.projection,
    )

    const bufferInfo = primitives.createXYQuadBufferInfo(gl)

    gl.useProgram(this.shader.program)
    setBuffersAndAttributes(gl, this.shader, bufferInfo)

    for (let cell of this.simulation.cells) {
      setUniforms(this.shader, {
        u_color: [1, 0, 0, 1],
        u_view: this.projection,
        u_pos: cell.position,
        u_size: cell.size,
      })
      drawBufferInfo(gl, bufferInfo)
    }
  }
}
