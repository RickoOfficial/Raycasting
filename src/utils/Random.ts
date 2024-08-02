export class Random {
	static number(min: number = 1, max?: number): number {
		if (!max) {
			max = min
			min = 0
		}

		return Math.random() * (max - min + 1) + min
	}

	static string(length: number = 8, chars: string | string[] = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'): string {
		let result = ''

		if (chars instanceof Array) {
			for (let string of chars) {
				result += string[Math.round(this.number(0, string.length - 1))]
			}

			for (let i = result.length; i < length; i++) {
				const string = this.fromArray(chars)
				result += string[Math.round(this.number(0, string.length - 1))]
			}

			result = this.shuffle(result)
		}

		if (typeof chars === 'string') {
			const charsArray = chars.split('')

			for (let i = 0; i < length; i++) {
				result += this.fromArray(charsArray)
			}
		}

		return result.slice(0, length)
	}

	static fromArray<T>(array: T[]): T {
		return array[Math.round(this.number(0, array.length - 1))]
	}

	static shuffle<T>(array: T[]): T[]
	static shuffle(string: string): string
	static shuffle<T>(arrayOrString: T[] | string): T[] | string {
		if (arrayOrString instanceof Array) {
			return arrayOrString.map((value) => value).sort(() => this.number(-1, 1))
		}

		if (typeof arrayOrString === 'string') {
			return arrayOrString
				.split('')
				.sort(() => this.number(-1, 1))
				.join('')
		}

		return arrayOrString
	}
}
