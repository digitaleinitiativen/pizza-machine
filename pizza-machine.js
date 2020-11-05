import PizzaMachineScene from './scenes/PizzaMachineScene.js'


const config = {
	type: Phaser.AUTO,
	width: 1024,
	height: 512,
	backgroundColor: '#ffffff',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 400 }
		}
	},
	scene: [PizzaMachineScene]
}

export default new Phaser.Game(config)