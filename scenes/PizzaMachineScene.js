export default class PizzaMachineScene extends Phaser.Scene {
	constructor() {
		super('pizza-machine');

		this.player = null;
		this.pizza = null;
	}

	preload() {
		this.load.image('player', 'assets/player.png');
		this.load.image('pizza', 'assets/pizza.png');
	}

	create() {
		this.player = this.physics.add.sprite(
			(1024 - 64) / 2
			, 512
			, 'player'
		);
		this.player.setCollideWorldBounds(true);
		this.player.body.velocity.x = 20;


		this.pizza = this.physics.add.sprite(
			Math.random() * (1024 - 64),
			0, 
			'pizza'
		);
		this.pizza.setCollideWorldBounds(true);
		this.pizza.body.bounce.y = 0.75;
		this.pizza.body.velocity.x = -40;
	}

	update() {

	}
}