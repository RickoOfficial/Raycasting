export class Events {
	static events: Record<string, Function[]> = {}

	static on(eventName: string, callback: Function) {
		if (!this.events[eventName]) {
			this.events[eventName] = []
		}

		this.events[eventName].push(callback)
	}

	static off(eventName: string, callback: Function) {
		if (!this.events[eventName]) {
			return
		}

		const index = this.events[eventName].indexOf(callback)
		if (index > -1) {
			this.events[eventName].splice(index, 1)
		}
	}

	static emit(eventName: string, ...args: any[]) {
		if (!this.events[eventName]) {
			return
		}

		this.events[eventName].forEach((callback) => callback(...args))
	}
}

// @ts-ignore
window['Events'] = Events