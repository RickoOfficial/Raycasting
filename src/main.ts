import { canvasSize, CONTEXT } from './globals'
import { Player } from './gameObjects/Player'
import { World, WORLD_COLS, WORLD_POS, WORLD_ROWS, WORLD_SIZE } from './gameObjects/World'
import { Vector2 } from './utils/Vector2'
import './style.scss'

const world = new World(WORLD_COLS, WORLD_ROWS)
world.pos = WORLD_POS
world.size = WORLD_SIZE

new Player(new Vector2(1.5, 1.5), new Vector2(0.2))

let lastTimestamp = 0
let fps = 0
const draw = (timestamp?: number) => {
	if (timestamp) {
		const delta = timestamp - lastTimestamp
		lastTimestamp = timestamp
		fps = 1000 / delta
	}

	CONTEXT.fillStyle = '#333'
	CONTEXT.fillRect(0, 0, ...canvasSize().array())

	world.update()
	world.draw(CONTEXT)

	for (let i = 0; i < Player.players.length; i++) {
		Player.players[i].update()
		Player.players[i].draw(CONTEXT)
	}

	CONTEXT.font = '16px monospace'
	CONTEXT.fillStyle = '#fff'
	CONTEXT.fillText(Math.round(fps).toString(), 16, 16)

	requestAnimationFrame(draw)
}

draw()
