export default class PizzaMachineScene extends Phaser.Scene {
	constructor() {
		super('pizza-machine');
	}

	preload() {
		this.load.image('player', 'assets/player.png');
		this.load.image('pizza', 'assets/pizza.png');
	}

	create() {
		this.physics.add.sprite(64, 256, 'player');
		this.physics.add.sprite(64, 64, 'pizza');
	}

	update() {

	}
}