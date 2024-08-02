import { Events } from './utils/Events'
import { Vector2 } from './utils/Vector2'

export const CANVAS = document.getElementById('canvas') as HTMLCanvasElement
CANVAS.width = window.innerWidth
CANVAS.height = window.innerHeight

window.addEventListener('resize', () => {
	CANVAS.width = window.innerWidth
	CANVAS.height = window.innerHeight
})

export const CONTEXT = CANVAS.getContext('2d') as CanvasRenderingContext2D

export const canvasSize = () => new Vector2(CANVAS.width, CANVAS.height)

export const mousePosition = (() => {
	const pos = new Vector2(0, 0)

	Events.on('mousemove', (e: MouseEvent) => {
		pos.set(e.clientX, e.clientY)
	})

	return () => pos.copy()
})()

/**
 * Глобальные события
 */
{
	window.addEventListener('keydown', (e) => {
		Events.emit('keydown', e)
	})

	window.addEventListener('keyup', (e) => {
		Events.emit('keyup', e)
	})

	window.addEventListener('mousemove', (e) => {
		Events.emit('mousemove', e)
	})

	window.addEventListener('contextmenu', (e) => {
		Events.emit('contextmenu', e)
	})
}
