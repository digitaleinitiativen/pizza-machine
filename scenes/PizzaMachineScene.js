export default class PizzaMachineScene extends Phaser.Scene {
	constructor() {
		super('pizza-machine');

		this.player = null;
		this.pizzas = null;
		this.cursors = null;
		this.playerPositions = null;
		this.currentPlayerPosition = null;
		this.lastMove = null;

		// parameters
		this.config = {
			pizzaRotation: 720,
			pizzaSpawnSpeed: 200,
			playerMaxSpeed: 800,
			playerAcceleration: 2000,
			tilt: 300
		}
	}

	preload() {
		this.load.spritesheet('player', 'assets/player-2.png', {
			frameWidth: 236,
			frameHeight: 320
		});
		this.load.image('pizza', 'assets/pizza-2.png');
		this.load.image('background', 'assets/background.png');
	}

	create() {

		this.add.image(512, 256, 'background');

		this.preparePlayerPositions();
		this.player = this.add.sprite(
			0
			, 0
			, 'player'
			, 0
		);
		this.player.setOrigin(0, 1);
		this.positionPlayer(Math.floor(
			Math.random() * (this.playerPositions.length - 1)
		));

		this.pizzas = this.physics.add.group();

		this.spawnPizza();

		this.cursors = this.input.keyboard.createCursorKeys();
	}

	positionPlayer(position) {
		if(this.time.now - this.config.tilt < this.lastMove) return;
		let p = this.currentPlayerPosition = Math.max(0, Math.min(position, this.playerPositions.length - 1));
		this.player.setPosition(this.playerPositions[p].x, this.scale.height);
		this.player.setFrame(this.playerPositions[p].frame);
		this.lastMove = this.time.now;
	}

	preparePlayerPositions() {
		let i = 0, pw = 236;
		let w = this.scale.width / 9;
		this.playerPositions = [
			{
				x: w * i++
				,	frame: 0
			}, {
				x: w * i++
				,	frame: 4
			}, {
				x: w * i++
				,	frame: 2
			}, {
				x: w * i++
				,	frame: 3
			}, {
				x: w * i++
				,	frame: 1
			}, {
				x: w * i++
				,	frame: 4
			}, {
				x: w * i++
				,	frame: 0
			}, {
				x: w * i++
				,	frame: 3
			}, {
				x: w * i++
				,	frame: 2
			}
		];
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
			this.positionPlayer(this.currentPlayerPosition - 1);
		}
		else if(this.cursors.right.isDown) {
			this.positionPlayer(this.currentPlayerPosition + 1);
		}
	}
}