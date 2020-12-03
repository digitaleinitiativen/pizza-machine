export default class PizzaMachineScene extends Phaser.Scene {
	constructor() {
		super('pizza-machine');

		this.player = null;
		this.pizza = null;
		this.pizzas = null;
		this.cursors = null;
		this.positions = null;
		this.position = null;
		this.lastMove = null;
		this.lastPizzaMove = null;
		this.pizzaPosition = {
			x: null,
			y: null
		};
		this.pizzaDrops = null;

		this.score = 0;
		this.scoreBox = null;


		// parameters
		this.config = {
			pizzaRotation: 720,
			pizzaSpawnSpeed: 200,
			playerMaxSpeed: 800,
			playerAcceleration: 2000,
			tilt: 300,
			pizzaTick: 300,
			pizzaCatchBonus: 5000,
			pizzaCowBonus: -10000
		}
	}

	preload() {
		this.load.spritesheet('player', 'assets/player-2.png', {
			frameWidth: 236,
			frameHeight: 320
		});
		this.load.spritesheet('pizza', 'assets/pizza-2.png', {
			frameWidth: 128,
			frameHeight: 87
		});
		this.load.image('background', 'assets/background.png');
	}

	create() {

		this.add.image(512, 256, 'background');

		this.scoreBox = this.add.text(0, 0, "Score: 0");

		this.preparePlayerPositions();
		this.player = this.add.sprite(
			0
			, 0
			, 'player'
			, 0
		);
		this.player.setOrigin(0, 1);
		this.positionPlayer(Math.floor(
			Math.random() * (this.positions.length - 1)
		));

		this.pizzas = this.add.group();

		this.spawnPizza();

		this.cursors = this.input.keyboard.createCursorKeys();
	}

	positionPlayer(position) {
		if(this.time.now - this.config.tilt < this.lastMove) return;
		let p = this.position = Math.max(0, Math.min(position, this.positions.length - 1));
		this.player.setPosition(this.positions[p].x, this.scale.height);
		this.player.setFrame(this.positions[p].frame);
		this.player.flipX = this.positions[p].inverted;
		this.lastMove = this.time.now;
	}

	positionPizza(position) {
		this.pizzaPosition.y = Math.max(0, Math.min(position, this.pizzaDrops[this.pizzaPosition.x].length - 1));
		this.pizza.setPosition(
			this.positions[this.pizzaPosition.x].x,
			this.pizzaDrops[this.pizzaPosition.x][this.pizzaPosition.y]
		);
		if(this.pizzaPosition.y < this.pizzaDrops[this.pizzaPosition.x].length - 1)
			this.pizza.angle = Math.random() * 90 - 45;
	}

	preparePlayerPositions() {
		let i = 0, pw = 236;
		let w = this.scale.width / 9;
		this.positions = [
			{
				x: w * i++
				,	frame: 0
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
				,	frame: 3
				,	inverted: true
			}, {
				x: w * i++
				,	frame: 1
				,	inverted: false
			}, {
				x: w * i++
				,	frame: 4
				,	inverted: false
			}, {
				x: w * i++
				,	frame: 0
				,	inverted: true
			}, {
				x: w * i++
				,	frame: 3
				,	inverted: false
			}
		];

		let j = 0;
		let h = this.scale.height / 7;
		let drops = [
			h * j++
			,	h * j++
			,	h * j++
			,	h * j++
			,	h * j++
			,	h * j++
			,	h * j++
		];
		this.pizzaDrops = [
			drops
			,	drops
			,	drops
			,	drops
			,	drops
			,	drops
			,	drops
			,	drops
		];
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

	update() {
		if(this.cursors.left.isDown) {
			this.positionPlayer(this.position - 1);
		}
		else if(this.cursors.right.isDown) {
			this.positionPlayer(this.position + 1);
		}

		if(this.time.now - this.config.pizzaTick  > this.lastPizzaMove) {
			this.positionPizza(this.pizzaPosition.y + 1);
			this.lastPizzaMove = this.time.now;
		}

		if(this.position == this.pizzaPosition.x  && this.pizzaPosition.y > 4) {
			this.pizza.destroy();
			this.spawnPizza();
			this.score += this.config.pizzaCatchBonus;
			this.scoreBox.setText("Score: " + this.score);
		}

		if(this.pizzaPosition.y == this.pizzaDrops[this.pizzaPosition.x].length - 1) {
			this.pizza.setFrame(1);
		}
	}
}