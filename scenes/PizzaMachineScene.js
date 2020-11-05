export default class PizzaMachineScene extends Phaser.Scene {
	constructor() {
		super('pizza-machine');

		this.player = null;
		this.pizza = null;
		this.cursors = null;

		// parameters
		this.config = {
			pizzaRotation: 720,
			pizzaSpawnSpeed: 200,
			playerMaxSpeed: 800,
			playerAcceleration: 2000
		}
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
		this.player.body.maxSpeed 
			= this.config.playerMaxSpeed;


		this.pizza = this.physics.add.sprite(
			Math.random() * (1024 - 64),
			0, 
			'pizza'
		);
		this.pizza.setCollideWorldBounds(true);
		this.pizza.body.bounce.y = 0.75;
		this.pizza.body.velocity.x = 
			(this.config.pizzaSpawnSpeed / 2)
			- Math.random() * this.config.pizzaSpawnSpeed;
		this.pizza.body.angularVelocity = 
			(this.config.pizzaRotation / 2) 
			- Math.random() * this.config.pizzaRotation;

		this.cursors = this.input.keyboard.createCursorKeys();
	}

	update() {
		if(this.cursors.left.isDown) {
			this.player.body.acceleration.x = 
				this.config.playerAcceleration * -1;
		}
		else if(this.cursors.right.isDown) {
			this.player.body.acceleration.x = 
				this.config.playerAcceleration;
		}
		else {
			this.player.body.acceleration.x = 0;
			this.player.body.velocity.x = 0;
		}

		this.physics.add.collider(this.player, this.pizza, this.collide, null, this);
	}

	collide(player, pizza) {
		pizza.destroy();
	}
}