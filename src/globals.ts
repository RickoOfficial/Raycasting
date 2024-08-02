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
