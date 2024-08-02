export class Vector2 {
	public x: number
	public y: number

	constructor(vector?: Vector2)
	constructor(x?: number, y?: number)
	constructor(vectorOrX?: Vector2 | number, y?: number) {
		if (vectorOrX instanceof Vector2) {
			this.x = vectorOrX.x
			this.y = vectorOrX.y
		} else {
			this.x = vectorOrX ?? 0
			this.y = y ?? 0
		}
	}

	rotate(angle: number): Vector2 {
		const x = this.x * Math.cos(angle) - this.y * Math.sin(angle)
		const y = this.x * Math.sin(angle) + this.y * Math.cos(angle)

		this.x = x
		this.y = y

		return this
	}

	rotateDegrees(angle: number): Vector2 {
		const radians = (angle * Math.PI) / 180

		const x = this.x * Math.cos(radians) - this.y * Math.sin(radians)
		const y = this.x * Math.sin(radians) + this.y * Math.cos(radians)

		this.x = x
		this.y = y

		return this
	}

	length(): number {
		return Math.sqrt(this.x * this.x + this.y * this.y)
	}

	normalize(): Vector2 {
		const length = this.length()

		if (length !== 0) {
			this.x /= length
			this.y /= length
		}

		return this
	}

	angle(): number {
		return Math.atan2(this.y, this.x)
	}

	angleDegrees(): number {
		return (this.angle() * (180 / Math.PI))
	}

	static fromAngle(angle: number): Vector2 {
		return new Vector2(Math.cos(angle), Math.sin(angle))
	}

	static fromAngleDegrees(angle: number): Vector2 {
		return this.fromAngle(angle * (Math.PI / 180))
	}

	dist(vector: Vector2): number
	dist(x: number, y: number): number
	dist(vectorOrX: Vector2 | number, y?: number): number {
		let result: number = 0

		if (vectorOrX instanceof Vector2) {
			result = vectorOrX.copy().sub(this.copy()).length()
		}

		if (typeof vectorOrX === 'number') {
			result = new Vector2(vectorOrX, y!).sub(this.copy()).length()
		}

		return result
	}

	add(vector: Vector2): Vector2
	add(num: number): Vector2
	add(x: number, y: number): Vector2
	add(vectorOrX: Vector2 | number, y?: number): Vector2 {
		if (vectorOrX instanceof Vector2) {
			this.x += vectorOrX.x
			this.y += vectorOrX.y
		}

		if (typeof vectorOrX === 'number') {
			this.x += vectorOrX
			this.y += y ?? vectorOrX
		}

		return this
	}

	sub(vector: Vector2): Vector2
	sub(num: number): Vector2
	sub(x: number, y: number): Vector2
	sub(vectorOrX: Vector2 | number, y?: number): Vector2 {
		if (vectorOrX instanceof Vector2) {
			this.x -= vectorOrX.x
			this.y -= vectorOrX.y
		}

		if (typeof vectorOrX === 'number') {
			this.x -= vectorOrX
			this.y -= y ?? vectorOrX
		}

		return this
	}

	div(vector: Vector2): Vector2
	div(num: number): Vector2
	div(x: number, y: number): Vector2
	div(vectorOrX: Vector2 | number, y?: number): Vector2 {
		if (vectorOrX instanceof Vector2) {
			this.x /= vectorOrX.x
			this.y /= vectorOrX.y
		}

		if (typeof vectorOrX === 'number') {
			this.x /= vectorOrX
			this.y /= y ?? vectorOrX
		}

		return this
	}

	mult(vector: Vector2): Vector2
	mult(num: number): Vector2
	mult(x: number, y: number): Vector2
	mult(vectorOrX: Vector2 | number, y?: number): Vector2 {
		if (vectorOrX instanceof Vector2) {
			this.x *= vectorOrX.x
			this.y *= vectorOrX.y
		}

		if (typeof vectorOrX === 'number') {
			this.x *= vectorOrX
			this.y *= y ?? vectorOrX
		}

		return this
	}

	set(vector: Vector2): Vector2
	set(num: number): Vector2
	set(x: number, y: number): Vector2
	set(vectorOrX: Vector2 | number, y?: number): Vector2 {
		if (vectorOrX instanceof Vector2) {
			this.x = vectorOrX.x
			this.y = vectorOrX.y
		}

		if (typeof vectorOrX === 'number') {
			this.x = vectorOrX
			this.y = y ?? vectorOrX
		}

		return this
	}

	floor() {
		this.x = Math.floor(this.x)
		this.y = Math.floor(this.y)

		return this
	}

	ceil() {
		this.x = Math.ceil(this.x)
		this.y = Math.ceil(this.y)

		return this
	}

	round() {
		this.x = Math.round(this.x)
		this.y = Math.round(this.y)

		return this
	}

	equals(vector: Vector2): boolean {
		return this.x === vector.x && this.y === vector.y
	}

	array(): [number, number] {
		return [this.x, this.y]
	}

	copy(): Vector2 {
		return new Vector2(this.x, this.y)
	}

	isInBounds(min: Vector2, max: Vector2): boolean {
		return this.x >= min.x && this.x <= max.x && this.y >= min.y && this.y <= max.y
	}

	valueOf(): [number, number] {
		return this.array()
	}

	toString(): string {
		return this.array().toString()
	}
}
