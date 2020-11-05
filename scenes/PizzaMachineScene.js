export default class PizzaMachineScene extends Phaser.Scene {
	constructor() {
		super('pizza-machine');

		this.player = null;
		this.pizzas = null;
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

		this.pizzas = this.physics.add.group();

		this.spawnPizza();

		this.cursors = this.input.keyboard.createCursorKeys();
	}

	spawnPizza() {
		let pizza = this.pizzas.create(
			Math.random() * (1024 - 64),
			0, 
			'pizza'
		);
		pizza.setCollideWorldBounds(true);
		pizza.body.bounce.y = 0.75;
		pizza.body.velocity.x = 
			(this.config.pizzaSpawnSpeed / 2)
			- Math.random() * this.config.pizzaSpawnSpeed;
		pizza.body.velocity.y = 40;
		pizza.body.angularVelocity = 
			(this.config.pizzaRotation / 2) 
			- Math.random() * this.config.pizzaRotation;
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

		this.physics.add.collider(this.player, this.pizzas, this.collide, null, this);
	}

	collide(player, pizza) {
		pizza.destroy();
		this.spawnPizza();
	}
}