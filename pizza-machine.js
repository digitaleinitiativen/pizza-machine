import PizzaMachineScene from './scenes/PizzaMachineScene.js'


const config = {
	type: Phaser.AUTO,
	width: window.innerWidth,
	height: window.innerHeight,
	backgroundColor: '#ffffff',
	physics: {
		default: 'arcade',
		arcade: {
			gravity: { y: 0 }
		}
	},
	scene: [PizzaMachineScene]
}

export default new Phaser.Game(config)