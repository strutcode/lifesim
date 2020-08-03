import {
  createProgramInfo,
  ProgramInfo,
  primitives,
  drawBufferInfo,
  setUniforms,
  setBuffersAndAttributes,
  m4,
  BufferInfo,
} from 'twgl.js'

import Simulation from './Simulation'

export default class Renderer {
  private canvas: HTMLCanvasElement = document.createElement('canvas')
  private context!: WebGLRenderingContext
  private shader!: ProgramInfo
  private bufferInfo!: BufferInfo
  private projection = m4.identity()
  private pan = {
    x: 0,
    y: 0,
  }
  private zoom = 1
  private uniforms = {
    u_color: [1, 0, 0, 1],
    u_view: this.projection,
    u_pos: [0, 0],
    u_size: 0,
  }

  public constructor(private simulation: Simulation) {
    this.initCanvas()
    this.initUi()
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

    window.addEventListener('resize', () => {
      this.updateProjection()
    })
  }

  private initUi() {
    const stats = document.createElement('div')

    Object.assign(stats.style, {
      position: 'fixed',
      top: '1em',
      left: '1em',
      color: '#fff',
    })

    setInterval(() => {
      stats.innerText = `Simulation efficiency: ${this.simulation.performance.toFixed(
        2,
      )}%`
    }, 800)

    document.body.appendChild(stats)
  }

  private initGfx() {
    const program = this.loadShader('circle')

    if (!program) {
      throw `Couldn't load shader`
    }

    this.shader = program
    this.bufferInfo = primitives.createXYQuadBufferInfo(this.context)

    this.updateProjection()
  }

  private initInput() {
    document.addEventListener('pointerdown', () => {
      const move = (ev: MouseEvent) => {
        const { aspect, zoom } = this
        const { width, height } = this.canvas

        this.pan.x -= ev.movementX * (1 / width) * 20 * aspect * zoom
        this.pan.y -= ev.movementY * (1 / height) * 20 * zoom

        this.updateProjection()
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

      this.updateProjection()
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

  private updateProjection() {
    const { pan, zoom, aspect, canvas } = this

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    m4.ortho(
      -10 * zoom * aspect + pan.x,
      10 * zoom * aspect + pan.x,
      10 * zoom + pan.y,
      -10 * zoom + pan.y,
      0,
      1,
      this.projection,
    )
  }

  public get aspect() {
    return window.innerWidth / window.innerHeight
  }

  public draw() {
    const gl = this.context

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)

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

    gl.useProgram(this.shader.program)
    setBuffersAndAttributes(gl, this.shader, this.bufferInfo)

    for (let cell of this.simulation.cells) {
      this.uniforms.u_pos = cell.position
      this.uniforms.u_size = cell.size
      setUniforms(this.shader, this.uniforms)
      drawBufferInfo(gl, this.bufferInfo)
    }
  }
}
