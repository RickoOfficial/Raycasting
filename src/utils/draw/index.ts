import { WORLD_COLS, WORLD_POS, WORLD_ROWS, WORLD_SIZE } from '../../gameObjects/World'

export const modifyContextByWorld = (ctx: CanvasRenderingContext2D) => {
	ctx.translate(...WORLD_POS.array())
	ctx.scale(...WORLD_SIZE.copy().div(WORLD_COLS, WORLD_ROWS).array())
}

export const resetContextByWorld = (ctx: CanvasRenderingContext2D) => {
	ctx.resetTransform()
}

export const line = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, path: boolean = true) => {
	path && ctx.beginPath()
	ctx.moveTo(x1, y1)
	ctx.lineTo(x2, y2)
	path && ctx.closePath()
}

export const rect = (ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, path: boolean = true) => {
	path && ctx.beginPath()
	ctx.rect(x, y, w, h)
	path && ctx.closePath()
}

export const circle = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, path: boolean = true) => {
	path && ctx.beginPath()
	ctx.arc(x, y, r, 0, 2 * Math.PI)
	path && ctx.closePath()
}
