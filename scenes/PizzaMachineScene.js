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

		this.lifes = [];
		this.lifesCount = 3;

		this.gameOver = false;


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
		this.score = 0;
		this.gameOver = false;
		this.lifesCount = 3;

		this.add.image(512, 256, 'background');

		this.scoreBox = this.add.text(5, 5, "Score: 0");

		for(let i = 0; i < 3; i++) {
			let lifes = this.add.group();
			let life = lifes.create(this.scale.width - 60 + i * 20, 0, 'pizza');
			life.setOrigin(0, 0);
			life.setDisplaySize(20, 15);
			this.lifes.push(life);
		}

		this.preparePlayerPositions();

		/*
		this.showAll();
		this.gameOver = true;
		return; //*/

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

	showAll() {
		let players = this.add.group();		
		for(let i = 0; i < this.positions.length; i++) {
			let player = players.create(
				this.positions[i].x,
				this.scale.height,
				'player'
			);
			player.setOrigin(0, 1);
			player.setFrame(this.positions[i].frame);
			player.flipX = this.positions[i].inverted;
		}

		let pizzas = this.add.group();
		for(let i = 0; i < this.pizzaDrops.length; i++) {
			for(let j = 0; j < this.pizzaDrops[i].drops.length; j++) {
				let pizza = pizzas.create(
					this.pizzaDrops[i].x,
					this.pizzaDrops[i].drops[j],
					'pizza'
				);
				pizza.alpha = 0.5;
				pizza.scale = 0.5;
				pizza.setOrigin(0.5, 0.5);
				if(j == this.pizzaDrops[i].length - 1)
					pizza.setFrame(1);
				else
					pizza.angle = Math.random() * 90 - 45;
			}
		}

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
		this.pizzaPosition.y = Math.max(0, Math.min(position, this.pizzaDrops[this.pizzaPosition.x].drops.length - 1));
		this.pizza.setPosition(
			this.pizzaDrops[this.pizzaPosition.x].x,
			this.pizzaDrops[this.pizzaPosition.x].drops[this.pizzaPosition.y]
		);
		if(this.pizzaPosition.y < this.pizzaDrops[this.pizzaPosition.x].drops.length - 1)
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
		let h = (this.scale.height + 87) / 7;
		let drops = [
			h * j++
			,	h * j++
			,	h * j++
			,	h * j++
			,	h * j++
			,	h * j++
			,	h * j++
		];
		i = 0;
		this.pizzaDrops = [
			{
				x: w * i++ + 40,
				drops: drops
			},	{
				x: w * i++ + 25,
				drops: drops
			},	{
				x: w * i++ + 60,
				drops: drops
			},	{
				x: w * i++ + 60,
				drops: drops
			},	{
				x: w * i++ + 60,
				drops: drops
			},	{
				x: w * i++ + 180,
				drops: drops
			},	{
				x: w * i++ + 40,
				drops: drops
			},	{
				x: w * i++ + 80,
				drops: drops
			},	{
				x: w * i++ + 80,
				drops: drops
			}];
	}

	spawnPizza() {
		this.pizzaPosition.x = Math.floor(
			Math.random() * (this.pizzaDrops.length - 1)
		);
		this.pizzaPosition.y = 0;
	
		this.pizza = this.pizzas.create(
			this.pizzaDrops[this.pizzaPosition.x].x,
			this.pizzaDrops[this.pizzaPosition.x].drops[this.pizzaPosition.y], 
			'pizza'
		);
		this.pizza.setOrigin(0.5, 0.5);
		this.pizza.scale = 0.7;
	}

	update() {
		if(this.gameOver) return;
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

		if(this.pizzaPosition.y == this.pizzaDrops[this.pizzaPosition.x].drops.length - 1) {
			if(this.pizza.frame == 0)
				this.pizza.setFrame(1);
			else {
				this.lifesCount--;
				if(this.lifesCount >= 0) {
					this.lifes[this.lifesCount].setFrame(1);
					this.pizza.destroy();
					this.spawnPizza();
					this.score += this.config.pizzaCowBonus;
					this.scoreBox.setText("Score: " + this.score);
				} else {
					this.gameOver = true;
					this.game.score = this.score;
					this.scene.stop();
					this.scene.start('score');
				}
			}
		}
	}
}