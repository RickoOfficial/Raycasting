import { canvasSize, mousePosition } from '../globals'
import { modifyContextByWorld, resetContextByWorld } from '../utils/draw'
import { Events } from '../utils/Events'
import { vectorToWorld } from '../utils/math'
import { Random } from '../utils/Random'
import { Vector2 } from '../utils/Vector2'
import { WorldCell, WorldCellType } from './WorldCell'

export const WORLD_COLS = 20
export const WORLD_ROWS = 20
export const WORLD_SIZE = new Vector2(canvasSize().y, canvasSize().y).sub(32)
export const WORLD_POS = new Vector2(16, 16)

export class World {
	static instance: World

	private readonly COLS: number
	private readonly ROWS: number

	private readonly map: WorldCell[][] = []

	public pos: Vector2 = new Vector2(0, 0)
	public size: Vector2 = new Vector2(0, 0)

	constructor(cols: number, rows: number) {
		if (World.instance) World.instance

		this.COLS = cols
		this.ROWS = rows

		World.instance = this

		this.attachEvents()

		this.fillWorld()
	}

	private attachEvents() {
		Events.on('contextmenu', (e: MouseEvent) => {
			e.preventDefault()

			const cell = World.getCell(...vectorToWorld(mousePosition()).floor().array())
			if (cell) {
				cell.changeType(cell.type === WorldCellType.EMPTY ? WorldCellType.WALL : WorldCellType.EMPTY)
			}
		})
	}

	getCell(x: number, y: number) {
		try {
			return this.map[y][x]
		} catch (error) {
			return null
		}
	}

	static getCell(x: number, y: number) {
		return World.instance.getCell(x, y)
	}

	fillWorld() {
		for (let y = 0; y < this.ROWS; y++) {
			this.map[y] = []
			for (let x = 0; x < this.COLS; x++) {
				let type = WorldCellType.EMPTY

				if (y === 0 || y === this.ROWS - 1 || x === 0 || x === this.COLS - 1) {
					type = WorldCellType.WALL
				} else if (x == 1 && y == 1) {
				} else {
					type = Random.fromArray([
						WorldCellType.EMPTY,
						WorldCellType.EMPTY,
						WorldCellType.EMPTY,
						WorldCellType.EMPTY,
						WorldCellType.EMPTY,
						WorldCellType.EMPTY,
						WorldCellType.EMPTY,
						WorldCellType.EMPTY,
						WorldCellType.WALL,
						WorldCellType.WALL,
					])
				}

				this.map[y][x] = new WorldCell(new Vector2(x, y), new Vector2(1, 1), type)
			}
		}
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = '#181818'
		ctx.rect(this.pos.x, this.pos.y, this.size.x, this.size.y)
		ctx.fill()

		modifyContextByWorld(ctx)

		for (let y = 0; y < this.ROWS; y++) {
			for (let x = 0; x < this.COLS; x++) {
				this.map[y][x].draw(ctx)
			}
		}

		resetContextByWorld(ctx)
	}

	update() {}
}
