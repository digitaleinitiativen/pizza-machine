import PizzaMachineScene from './scenes/PizzaMachineScene.js'
import StartScene from './scenes/StartScene.js'
import StartQRScene from './scenes/StartQRScene.js'
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

if(window.location.hash == "#qr") {
	config.scene.shift();
	config.scene.unshift(StartQRScene);
} else if(window.location.hash == "#game")
	config.scene.shift();


let game = new Phaser.Game(config);

export default game;