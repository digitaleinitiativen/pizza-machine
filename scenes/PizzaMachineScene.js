export default class PizzaMachineScene extends Phaser.Scene {
	constructor() {
		super('pizza-machine');

		this.player = null;
		this.positions = null;
		this.playerPosition = null;
		this.pizzaDrops = null;
		this.pizzaPosition = {
			x: null,
			y: null
		}
		this.pizzas = null;
		this.pizza = null;
		this.cursors = null;
		this.lastMove = 0;
		this.lastPizzaMove = 0;

		// parameters
		this.config = {
			pizzaRotation: 720,
			pizzaSpawnSpeed: 200,
			playerMaxSpeed: 800,
			playerAcceleration: 2000,
			tilt: 300,
			pizzaTick: 300
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
		this.positionPlayer(this.playerPosition);

		this.pizzas = this.add.group();

		this.spawnPizza();

		this.cursors = this.input.keyboard.createCursorKeys();
	}

	preparePlayerPositions() {
		let i = 0, pw = 236;
		let w = (this.scale.width) / 9;
		this.positions = [
			{
				x: w * i++
				,	frame: 0
				,	inverted: false
			}, {
				x: w * i++
				,	frame: 4
				,	inverted: false
			}, {
				x: w * i++
				,	frame: 1
				,	inverted: false
			}, {
				x: w * i++
				,	frame: 2
				,	inverted: true
			}, {
				x: w * i++
				,	frame: 3
				,	inverted: false
			}, {
				x: w * i++
				,	frame: 4
				,	inverted: true
			}, {
				x: w * i++
				,	frame: 2
				,	inverted: false
			}, {
				x: w * i++
				,	frame: 0
				,	inverted: true
			}
		];
		let j = 0;
		let drops = [
			this.scale.height / 7 * j++
			,	this.scale.height / 7 * j++
			,	this.scale.height / 7 * j++
			,	this.scale.height / 7 * j++
			,	this.scale.height / 7 * j++
			,	this.scale.height / 7 * j++
			,	this.scale.height / 7 * j++
		];
		this.pizzaDrops = [
			drops
			, drops
			, drops
			, drops
			, drops
			, drops
			, drops
			, drops
		];
		this.playerPosition = Math.floor(
			Math.random() * (this.positions.length - 1)
		);
	}

	spawnPizza() {
		this.pizzaPosition.x = Math.floor(
			Math.random() * (this.positions.length - 1)
		);
		this.pizzaPosition.y = 0;
		this.pizza = this.pizzas.create(
			this.positions[this.pizzaPosition.x].x,
			this.pizzaDrops[this.pizzaPosition.x][this.pizzaPosition.y],
			'pizza'
		);
		this.pizza.setOrigin(0, 0);
	}

	positionPizza(position) {
		this.pizzaPosition.y = Math.max(0, Math.min(position, this.pizzaDrops[this.pizzaPosition.x].length - 1));
		this.pizza.setPosition(
			this.positions[this.pizzaPosition.x].x
			,	this.pizzaDrops[this.pizzaPosition.x][this.pizzaPosition.y]
		);
		if(this.pizzaPosition.y >= this.pizzaDrops[this.pizzaPosition.x].length - 1) {
			//lose live
		}
	}

	positionPlayer(position) {
		if(this.time.now - this.config.tilt < this.lastMove && this.lastMove != 0) return;
		let p = this.playerPosition = Math.max(0, Math.min(position, this.positions.length - 1));
		this.player.setPosition(this.positions[p].x, this.scale.height);
		this.player.setFrame(this.positions[p].frame);
		this.player.flipX = this.positions[p].inverted;
		this.lastMove = this.time.now;
	}

	update() {
		if(this.cursors.left.isDown) {
			this.positionPlayer(this.playerPosition - 1);
		}
		else if(this.cursors.right.isDown) {
			this.positionPlayer(this.playerPosition + 1);
		}

		if(this.time.now - this.config.pizzaTick > this.lastPizzaMove) {
			this.positionPizza(this.pizzaPosition.y + 1);
			this.lastPizzaMove = this.time.now;
		}

		if(this.playerPosition == this.pizzaPosition.x && this.pizzaPosition.y > 5) {
			this.pizza.destroy();
			this.spawnPizza();
		}
	}
}