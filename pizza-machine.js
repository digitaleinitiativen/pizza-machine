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
	scene: [PizzaMachineScene, ScoreScene]
}

let socketUrl = 'wss://us-nyc-1.websocket.me/v3/1?api_key=QJ3733IrJhU667fuYoITyxYedPDd9VST5xuhV6Xz&notify_self';
let socket = new WebSocket(socketUrl);

socket.onmessage = function(message) {
	
}

socket.onopen = function() {
    console.log(`Websocket connected`);
    socket.send(JSON.stringify({
        event: 'new game',
        sender: 'pizza-machine'
    }));
};

let game = new Phaser.Game(config);
export default game;