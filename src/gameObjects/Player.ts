import { canvasSize, CONTEXT } from '../globals'
import { circle, line, modifyContextByWorld, rect, resetContextByWorld } from '../utils/draw'
import { Events } from '../utils/Events'
import { GameObject } from '../utils/GameObject'
import { map } from '../utils/math'
import { Ray } from '../utils/math/Ray'
import { Vector2 } from '../utils/Vector2'
import { World, WORLD_COLS, WORLD_ROWS, WORLD_SIZE } from './World'
import { WorldCell, WorldCellType } from './WorldCell'

export class Player extends GameObject {
	public static players: Player[] = []

	private viewAngle: Vector2 = new Vector2(1, 1)
	private raysDots: Vector2[] = []
	private raysDotsOnWall: Vector2[] = []

	private FOV = 60
	private FOVRayCount = 180
	private FOVRayStep = Math.abs((-this.FOV / 2 - this.FOV / 2) / this.FOVRayCount)
	private FOVRayWidth = canvasSize().x / this.FOVRayCount

	private mousePos: Vector2 = new Vector2(0, 0)
	private prevMousePos: Vector2 = new Vector2(0, 0)

	private keys: Record<string, boolean> = {}

	private rotateSpeed = 3
	private moveSpeed = 0.05
	private mouseSensitivity = 0.3

	mouseControlled = false

	toggleMouseControl() {
		this.mouseControlled = !this.mouseControlled
		return this.mouseControlled
	}

	constructor(pos: Vector2, size: Vector2) {
		super(pos, size)

		Player.players.push(this)

		this.attachEvents()
	}

	attachEvents() {
		Events.on('keydown', (e: KeyboardEvent) => {
			this.keys[e.key.toLowerCase()] = true
		})

		Events.on('keyup', (e: KeyboardEvent) => {
			this.keys[e.key.toLowerCase()] = false
		})

		Events.on('mousemove', (e: MouseEvent) => {
			if (this.prevMousePos.equals(new Vector2())) {
				this.prevMousePos.set(e.clientX, e.clientY)
			}

			this.mousePos.set(e.clientX, e.clientY)
		})
	}

	/**
	 * TODO: Убрать fisheye эффект
	 */
	draw(ctx: CanvasRenderingContext2D) {
		// let c = 0
		const MAX_WALL_HEIGHT = canvasSize().y - WORLD_SIZE.y - 32

		for (let i = 0; i <= this.FOVRayCount; i++) {
			const rayHit = this.raysDotsOnWall[i]
			// const rayAngle = (-this.FOV / 2) + (this.FOVRayStep * i);

			const dist = this.pos.dist(rayHit)
			// const correctedDistance = dist * Math.cos(rayAngle - this.viewAngle.angleDegrees())
			// const correctedDistance = dist * Math.cos(rayAngle * (Math.PI / 180) - this.viewAngle.x); // Correct fisheye effect

			const wallHeight = map(dist, 0, new Vector2(0, 0).dist(WORLD_COLS, WORLD_ROWS), -MAX_WALL_HEIGHT, 0) * -1
			const wallTop = (canvasSize().y - wallHeight) / 2

			ctx.fillStyle = `rgba(255, 0, 0, ${wallHeight / MAX_WALL_HEIGHT})`
			ctx.beginPath()
			rect(ctx, i * this.FOVRayWidth - 1, wallTop, this.FOVRayWidth + 1, wallHeight)
			ctx.fill()

			// console.log(`[${c++}] > ${dist} > ${wallHeight}`)
		}
		// console.log()

		// this.drawOnMinimap(ctx)
		// this.drawFOV(ctx)
	}

	drawOnMinimap(ctx: CanvasRenderingContext2D) {
		modifyContextByWorld(ctx)

		ctx.fillStyle = '#f0f'
		circle(ctx, ...this.pos.array(), this.size.x)
		ctx.fill()

		ctx.strokeStyle = '#fff'
		ctx.lineWidth = 0.01
		line(ctx, ...this.pos.array(), ...this.pos.copy().add(this.viewAngle).array())
		ctx.stroke()

		this.drawFOV(ctx)

		resetContextByWorld(ctx)
	}

	drawFOV(ctx: CanvasRenderingContext2D) {
		// ctx.fillStyle = '#f0f'
		// ctx.beginPath()
		// for (let i = 0; i < this.raysDots.length; i++) {
		// 	circle(ctx, ...this.raysDots[i].array(), this.size.x / 5, false)
		// }
		// ctx.closePath()
		// ctx.fill()

		if (this.raysDotsOnWall.length > 0) {
			ctx.fillStyle = '#0f0'
			ctx.beginPath()
			line(ctx, ...this.pos.array(), ...this.raysDotsOnWall[0].array(), false)
			for (let i = 1; i < this.raysDotsOnWall.length; i++) {
				line(ctx, ...this.raysDotsOnWall[i - 1].array(), ...this.raysDotsOnWall[i].array(), false)
			}
			line(ctx, ...this.raysDotsOnWall.at(-1)!.array(), ...this.pos.array(), false)
			ctx.closePath()
			ctx.stroke()
		}
	}

	update() {
		/**
		 * Повороты
		 */
		{
			if (this.keys['a'] || this.keys['ф']) this.viewAngle.rotateDegrees(-this.rotateSpeed)
			if (this.keys['d'] || this.keys['в']) this.viewAngle.rotateDegrees(this.rotateSpeed)

			if (this.mouseControlled) {
				this.viewAngle.rotateDegrees((this.mousePos.x - this.prevMousePos.x) * this.mouseSensitivity)

				this.prevMousePos.set(...this.mousePos.array())
			}
		}

		/**
		 * Передвижение
		 */
		{
			if (this.keys['w'] || this.keys['ц']) {
				const { x, y } = this.pos.copy().add(this.viewAngle.copy().mult(this.moveSpeed))

				if (World.getCell(Math.floor(x), Math.floor(this.pos.y))?.type !== WorldCellType.WALL) {
					this.pos.x = x
				}

				if (World.getCell(Math.floor(this.pos.x), Math.floor(y))?.type !== WorldCellType.WALL) {
					this.pos.y = y
				}
			}

			if (this.keys['s'] || this.keys['ы']) {
				const { x, y } = this.pos.copy().add(this.viewAngle.copy().rotateDegrees(180).mult(this.moveSpeed))

				if (World.getCell(Math.floor(x), Math.floor(this.pos.y))?.type !== WorldCellType.WALL) {
					this.pos.x = x
				}

				if (World.getCell(Math.floor(this.pos.x), Math.floor(y))?.type !== WorldCellType.WALL) {
					this.pos.y = y
				}
			}

			if (World.getCell(...this.pos.copy().floor().array())?.type == WorldCellType.WALL) {
				this.pullOutFromWall()
			}

			// if (this.keys['a'] || this.keys['ф']) this.pos.add(this.viewAngle.copy().rotateDegrees(-90).mult(this.moveSpeed))
			// if (this.keys['d'] || this.keys['в']) this.pos.add(this.viewAngle.copy().rotateDegrees(90).mult(this.moveSpeed))
		}

		this.raysDots = []
		this.raysDotsOnWall = []

		for (let i = -this.FOV / 2; i < this.FOV / 2; i += this.FOVRayStep) {
			const ray = new Ray(this.pos, this.viewAngle.copy().rotateDegrees(i))

			while (true) {
				if (this.raysDots.length + this.raysDotsOnWall.length >= Number.MAX_SAFE_INTEGER) throw new Error('Too many rays')

				const newDot = ray.next()

				const isOutOfBounds = newDot.isInBounds(new Vector2(0, 0), new Vector2(WORLD_COLS, WORLD_ROWS)) === false

				if (isOutOfBounds) break

				const cell = World.getCell(...newDot.copy().floor().array())
				const isWall = cell instanceof WorldCell ? cell.type === WorldCellType.WALL : false

				if (isWall) {
					if (this.raysDots.at(-1) instanceof Vector2) {
						this.raysDotsOnWall.push(this.raysDots.at(-1)!)
					}

					break
				}

				this.raysDots.push(newDot)
			}
		}
	}

	private pullOutFromWall() {
		const nearCells: Vector2[] = []
		const nearCellsDist: number[] = []

		for (let i = 0; i < 360; i += 360 / 36) {
			const ray = new Ray(this.pos, Vector2.fromAngleDegrees(i))

			for (let j = 0; j < 10; j++) {
				const dot = ray.next().add(Vector2.fromAngle(i).div(10))

				if (World.getCell(...dot.copy().floor().array())?.type === WorldCellType.EMPTY) {
					nearCells.push(dot)
					nearCellsDist.push(dot.dist(this.pos))
				}
			}
		}

		modifyContextByWorld(CONTEXT)
		CONTEXT.fillStyle = '#f00'
		CONTEXT.beginPath()
		for (let i = 0; i < nearCells.length; i++) {
			circle(CONTEXT, ...nearCells[i].array(), 0.03)
			CONTEXT.fill()
		}
		CONTEXT.closePath()
		resetContextByWorld(CONTEXT)

		const minDist = Math.min(...nearCellsDist)
		const minDistIndex = nearCellsDist.indexOf(minDist)
		const newPos = nearCells[minDistIndex]

		this.pos.set(newPos)
	}
}

// @ts-ignore
window['Player'] = Player
