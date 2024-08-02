import { Vector2 } from './Vector2'

export abstract class GameObject {
	private static readonly arrayOfGameObjects: GameObject[] = []

	protected pos: Vector2
	protected size: Vector2

	constructor(pos: Vector2, size: Vector2) {
		this.pos = pos
		this.size = size

		GameObject.arrayOfGameObjects.push(this)
	}

	abstract draw(ctx: CanvasRenderingContext2D): void

	abstract update(...args: any): void

	getPos() {
		return this.pos.copy()
	}

	getSize() {
		return this.size.copy()
	}
}
