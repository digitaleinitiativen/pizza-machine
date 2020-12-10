import PizzaMachineScene from './scenes/PizzaMachineScene.js'
import StartScene from './scenes/StartScene.js'
import ScoreScene from './scenes/ScoreScene.js'



const config = {
	type: Phaser.AUTO,
	width: 1024,
	height: 512,
	backgroundColor: '#ffffff',
	parent: 'phaser',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 400 }
		}
	},
	scene: [StartScene, PizzaMachineScene, ScoreScene]
}

export default new Phaser.Game(config)