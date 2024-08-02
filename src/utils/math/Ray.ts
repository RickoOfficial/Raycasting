import { EPSILON, snap } from '.'
import { Vector2 } from '../Vector2'

export class Ray {
	private initialPos: Vector2
	private initialDir: Vector2

	private pos: Vector2
	private dir: Vector2

	private dots: Vector2[] = []

	constructor(from: Vector2, angle: Vector2) {
		this.initialPos = from.copy()
		this.initialDir = angle.copy().normalize().mult(EPSILON)

		this.pos = this.initialPos.copy()
		this.dir = this.initialDir.copy().add(this.initialPos)
	}

	next(): Vector2 {
		const p3: Vector2 = new Vector2(...this.dir.array())

		const d = this.dir.copy().sub(this.pos)

		if (d.x !== 0) {
			const k = d.y / d.x
			const c = this.pos.y - k * this.pos.x

			const x3 = snap(this.dir.x, d.x)
			const y3 = x3 * k + c

			p3.set(x3, y3)

			if (k !== 0) {
				const y3 = snap(this.dir.y, d.y)
				const x3 = (y3 - c) / k

				if (this.dir.dist(x3, y3) < this.dir.dist(p3)) p3.set(x3, y3)
			}
		} else {
			const y3 = snap(this.dir.y, d.y)
			const x3 = this.dir.x

			p3.set(x3, y3)
		}

		this.dots.push(p3)

		this.pos.set(p3)
		this.dir.set(p3).add(this.initialDir)

		return p3.add(this.initialDir.copy().mult(-2))
	}

	prev(): Vector2 {
		return this.dots[this.dots.length - 2].copy()
	}
}
