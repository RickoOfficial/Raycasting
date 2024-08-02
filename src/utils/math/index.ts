import { WORLD_COLS, WORLD_POS, WORLD_ROWS, WORLD_SIZE } from '../../gameObjects/World'
import { Vector2 } from '../Vector2'
import { Ray } from './Ray'

export const EPSILON = 1e-6

/**
 * Преобразует координаты мира в координаты экрана.
 * @param {Vector2} pos - Координаты мира.
 * @returns {Vector2} Копия координат экрана.
 */
export const vectorToWorld = (pos: Vector2) => {
	return pos
		.copy()
		.sub(...WORLD_POS.array())
		.div(...WORLD_SIZE.copy().div(WORLD_COLS, WORLD_ROWS).array())
}

export const snap = (x: number, dx: number) => {
	if (dx > 0) return Math.ceil(x + Math.sign(dx) * EPSILON)
	if (dx < 0) return Math.floor(x + Math.sign(dx) * EPSILON)
	return x
}

/**
 * @deprecated Use {@link Ray}
 */
export const throwRay = (startPos: Vector2, angle: number) => {
	const dots: Vector2[] = []

	const initialPos = new Vector2(...startPos.array())
	const initialAngle = Vector2.fromAngle(angle).mult(EPSILON)

	const p1 = initialPos.copy()
	const p2 = initialAngle.copy().add(initialPos)

	return (): Vector2 => {
		const p3: Vector2 = new Vector2(...p2.array())

		const d = p2.copy().sub(p1)

		if (d.x !== 0) {
			const k = d.y / d.x
			const c = p1.y - k * p1.x

			const x3 = snap(p2.x, d.x)
			const y3 = x3 * k + c

			p3.set(x3, y3)

			if (k !== 0) {
				const y3 = snap(p2.y, d.y)
				const x3 = (y3 - c) / k

				if (p2.dist(x3, y3) < p2.dist(p3)) p3.set(x3, y3)
			}
		} else {
			const y3 = snap(p2.y, d.y)
			const x3 = p2.x

			p3.set(x3, y3)
		}

		dots.push(p3)

		p1.set(p3)
		p2.set(p3).add(initialAngle)

		return p3.add(initialAngle.copy().mult(-2))
	}
}

export const map = (number: number, inMin: number, inMax: number, outMin: number, outMax: number, clamp: boolean = false): number => {
	const normalized = (number - inMin) / (inMax - inMin)
	const scaled = normalized * (outMax - outMin) + outMin

	if (clamp) {
		return Math.min(Math.max(scaled, outMin), outMax)
	}

	return scaled
}
