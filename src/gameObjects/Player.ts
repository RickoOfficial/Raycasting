import { circle, line, modifyContextByWorld, resetContextByWorld } from '../utils/draw'
import { GameObject } from '../utils/GameObject'
import { throwRay } from '../utils/math'
import { Ray } from '../utils/math/Ray'
import { Vector2 } from '../utils/Vector2'
import { World, WORLD_COLS, WORLD_ROWS } from './World'
import { WorldCell, WorldCellType } from './WorldCell'

export class Player extends GameObject {
	public static players: Player[] = []

	private viewAngle: Vector2 = new Vector2(1, 1)
	private raysDots: Vector2[] = []
	private raysDotsOnWall: Vector2[] = []

	private FOV = 90
	private FOVRayCount = 180
	private FOVRayStep = Math.abs((-this.FOV / 2 - this.FOV / 2) / this.FOVRayCount)

	private mousePos: Vector2 = new Vector2(0, 0)
	private prevMousePos: Vector2 = new Vector2(0, 0)

	private keys: { [key: string]: boolean } = {}

	private rotateSpeed = 3
	private moveSpeed = 0.05
	private mouseSensitivity = 0.3

	constructor(pos: Vector2, size: Vector2) {
		super(pos, size)

		Player.players.push(this)

		this.attachEvents()
	}

	attachEvents() {
		window.addEventListener('keydown', (e) => {
			this.keys[e.key.toLowerCase()] = true
		})

		window.addEventListener('keyup', (e) => {
			this.keys[e.key.toLowerCase()] = false
		})

		window.addEventListener('mousemove', (e) => {
			if (this.prevMousePos.equals(new Vector2())) {
				this.prevMousePos.set(e.clientX, e.clientY)
			}

			this.mousePos.set(e.clientX, e.clientY)
		})
	}

	draw(ctx: CanvasRenderingContext2D) {
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
		ctx.fillStyle = '#f0f'
		for (let i = 0; i < this.raysDots.length; i++) {
			circle(ctx, ...this.raysDots[i].array(), this.size.x / 5)
			ctx.fill()
		}

		ctx.fillStyle = '#0f0'
		for (let i = 0; i < this.raysDotsOnWall.length; i++) {
			circle(ctx, ...this.raysDotsOnWall[i].array(), this.size.x / 5)
			ctx.fill()
		}
	}

	update() {
		/**
		 * Повороты
		 */
		if (this.keys['a'] || this.keys['ф']) this.viewAngle.rotateDegrees(-this.rotateSpeed)
		if (this.keys['d'] || this.keys['в']) this.viewAngle.rotateDegrees(this.rotateSpeed)

		this.viewAngle.rotateDegrees((this.mousePos.x - this.prevMousePos.x) * this.mouseSensitivity)

		this.prevMousePos.set(...this.mousePos.array())
		/**
		 * /Повороты
		 */

		/**
		 * Передвижение
		 */
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
		/**
		 * /Передвижение
		 */

		this.raysDots = []
		this.raysDotsOnWall = []

		for (let i = -this.FOV / 2; i <= this.FOV / 2; i += this.FOVRayStep) {
			const ray = new Ray(this.pos, this.viewAngle.copy().rotateDegrees(i))

			while (this.raysDots.length < (WORLD_COLS * WORLD_ROWS * this.FOVRayCount) / this.FOV) {
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

		// console.log(this.raysDots.at(-1));

		// for (let i = -this.FOV / 2; i <= this.FOV / 2; i += this.FOVRayStep) {
		// 	const ray = throwRay(this.pos, this.viewAngle.copy().rotateDegrees(i).angle())

		// 	while (this.raysDots.length < WORLD_COLS * WORLD_ROWS * this.FOVRayCount) {
		// 		const newDot = ray()

		// 		const isOutOfBounds = newDot.isInBounds(new Vector2(0, 0), new Vector2(WORLD_COLS, WORLD_ROWS)) === false

		// 		const cell = World.getCell(...newDot.copy().floor().array())
		// 		const isWall = cell instanceof WorldCell ? cell.type === WorldCellType.WALL : false

		// 		if (isOutOfBounds) break

		// 		if (isWall) {
		// 			if (this.raysDots.at(-1) instanceof Vector2) {
		// 				this.raysDotsOnWall.push(this.raysDots.at(-1)!)
		// 			}

		// 			break
		// 		}

		// 		this.raysDots.push(newDot)
		// 	}
		// }
	}

	pullOutFromWall() {
		const nearCells: Vector2[] = []
		const nearCellsDist: number[] = []

		for (let i = -180; i < 180; i += 360 / 36) {
			const ray = throwRay(this.pos, this.viewAngle.angle() + i)

			for (let j = 0; j < 10; j++) {
				const dot = ray().add(Vector2.fromAngle(i).div(10))

				if (World.getCell(...dot.copy().floor().array())?.type === WorldCellType.EMPTY) {
					nearCells.push(dot)
					nearCellsDist.push(dot.dist(this.pos))
				}
			}
		}

		const minDist = Math.min(...nearCellsDist)
		const minDistIndex = nearCellsDist.indexOf(minDist)
		const newPos = nearCells[minDistIndex]

		this.pos.set(newPos)
	}
}
