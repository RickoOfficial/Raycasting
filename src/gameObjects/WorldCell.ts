import { rect } from '../utils/draw'
import { GameObject } from '../utils/GameObject'
import { vectorToWorld } from '../utils/math'
import { Vector2 } from '../utils/Vector2'

export enum WorldCellType {
	EMPTY = 0,
	WALL = 1,
}

export enum WorldCellColor {
	EMPTY = '#243a3c',
	WALL = '#24282c',
}

export class WorldCell extends GameObject {
	public type: WorldCellType
	public color: WorldCellColor

	private mousePos: Vector2 = new Vector2()

	constructor(pos: Vector2, size: Vector2, type: WorldCellType = WorldCellType.EMPTY) {
		super(pos, size)

		this.type = type
		this.color = WorldCellColor[WorldCellType[this.type] as keyof typeof WorldCellType]

		this.attachEvents()
	}

	attachEvents() {
		window.addEventListener('mousemove', (e) => {
			this.mousePos.set(e.clientX, e.clientY)
		})

		window.addEventListener('contextmenu', (e) => {
			e.preventDefault()

			const [x, y] = vectorToWorld(this.mousePos).array()

			if (Math.floor(x) === this.pos.x && Math.floor(y) === this.pos.y) {
				this.type = this.type === WorldCellType.EMPTY ? WorldCellType.WALL : WorldCellType.EMPTY
				this.color = WorldCellColor[WorldCellType[this.type] as keyof typeof WorldCellType]
			}

			console.log()
		})
	}

	draw(ctx: CanvasRenderingContext2D) {
		ctx.fillStyle = this.color
		ctx.strokeStyle = '#0003'
		ctx.lineWidth = 0.03
		rect(ctx, this.pos.x, this.pos.y, this.size.x, this.size.y)
		ctx.fill()
		ctx.stroke()
	}

	update(...args: any): void {
		[...args]
	}
}
