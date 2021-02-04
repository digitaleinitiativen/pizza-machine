export default class PizzaMachineScene extends Phaser.Scene {
	constructor() {
		super('pizza-machine');
		this.player = null;

		this.PIZZA_STATE = {
			SPENDY: 1,
			BELTY: 2,
			FELTY: 3
		};

		this.pizza = null;
		this.pizzas = null;
		this.pizzaPlate = null;
		this.pizzaState = null;
		this.cursors = null;
		this.positions = null;
		this.position = null;
		this.lastMove = null;
		this.lastPizzaMove = null;
		this.pizzaTargetDrop = null;
		this.pizzaPosition = {
			x: null,
			y: null
		};
		this.pizzaDrops = null;

		this.conveyerBeltX = null;
		this.conveyerBeltY = 75;

		this.bigSpenderX = 863;
		this.bigSpenderY = 55;

		this.score = 0;
		this.scoreBox = null;

		this.lifes = [];
		this.lifesCount = 3;

		this.gameOver = false;

		this.controls = {
			left: false,
			right: false,
			enter: false
		}

		this.yas = [
			"Hab sie",
			"Pizza digitalo",
			"Logo Logo",
			"Heiß und fettig",
			"Hurrrrrray"
		];

		this.nas = [
			"Mamma mia",
			"Bleib doch liegen",
			"Whoopsie",
			"Damn"
		];

		this.uhyas = [
			"Pronto!",
			"E ancora!",
			"Nochmal!"
		];


		// parameters
		this.config = {
			tilt: 200,
			pizzaTick: 200,
			pizzaCatchBonus: 5000,
			pizzaCowBonus: -10000
		}
	}

	preload() {
		this.load.spritesheet('player', 'assets/player-3.png', {
			frameWidth: 280,
			frameHeight: 326
		});
		this.load.spritesheet('pizza', 'assets/pizza-3.png', {
			frameWidth: 114,
			frameHeight: 60
		});
		this.load.spritesheet('life', 'assets/lifes.png', {
			frameWidth: 30,
			frameHeight: 30
		});

		this.load.spritesheet('sausage', 'assets/sausage.png', {
			frameWidth: 40,
			frameHeight: 120
		});
		this.load.spritesheet('wheels', 'assets/conveyer-belt-wheels.png', {
			frameWidth: 40,
			frameHeight: 40
		});
		this.load.image('background', 'assets/background-2.png');
		this.load.image('conveyer-belt-front', 'assets/conveyer-belt-front.png');
	}

	create() {
		this.score = 0;
		this.gameOver = false;
		this.lifesCount = 3;

		this.add.image(512, 256, 'background');
		let cbf = this.add.image(512, 62, 'conveyer-belt-front');
		cbf.depth = 101010101;


		this.scoreBox = this.add.text(25, 188, "Yum: 0", {
			color: 'black'
		});
		this.scoreBox.setOrigin(0, 0);


		let lifesPos = [[55, 162], [84, 160], [110, 163]];
		let lifes = this.add.group();
		for(let i = 0; i < this.lifesCount; i++) {
			let life = lifes.create(lifesPos[i][0], lifesPos[i][1], 'life');
			life.setOrigin(0.5, 0.5);
			this.lifes.push(life);
		}

		let sausage = this.add.sprite(870, 194, 'sausage', 0);

		this.anims.create({
			key: 'wackeln',
			frames: this.anims.generateFrameNumbers('sausage', { frames: [0, 1, 2, 3, 4, 3, 2, 1 ] }),
			frameRate: 4,
			repeat: -1
		});

		sausage.play('wackeln');


		this.anims.create({
			key: 'rotate',
			frames: this.anims.generateFrameNumbers('wheels', {frames: [0, 1, 2]}),
			frameRate: 4,
			repeat: -1
		});

		for(let i = 0; i < 11; i++) {
			let wheel = this.add.sprite(25 + i * 97, 99, 'wheels', 0);
			wheel.play('rotate');
			wheel.rotation = Math.random();
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
		this.pizzaPlate = this.add.group();
		this.pizzaPlate.setOrigin(0.5, 1);

		this.positionPlayer(Math.floor(
			Math.random() * (this.positions.length - 1)
		));

		this.pizzas = this.add.group();

		this.spawnPizza();

		this.cursors = this.input.keyboard.createCursorKeys();
		if(this.game.registry.get('socket')) {
			let t = this;
			this.game.registry.get('socket').onmessage = function(message) {
				let data = JSON.parse(message.data);
				if(data.event == 'control') {
					if(data.key == 'left')
						t.controls.left = true;
					else if(data.key == 'right')
						t.controls.right = true;
				}
			}
		}
		this.input.keyboard.on('keydown-N', this.restart, this);
	}

	restart() {
		this.score = 0;
		this.gameOver = false;
		this.lifesCount = 3;
		this.lifes[0].setFrame(2);
		this.lifes[1].setFrame(2);
		this.lifes[2].setFrame(2);
		this.pizzaPlate.clear(true);
		this.scoreBox.setText("Yum: " + this.score);
		this.scream(this.uhyas[Math.floor(this.uhyas.length * Math.random())]);
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
					this.pizzaDrops[i].drops[j].y,
					'pizza'
				);
				pizza.alpha = 0.5;
				pizza.scale = 0.5;
				pizza.setOrigin(0.5, 0.5);
				pizza.setFrame(this.pizzaDrops[i].drops[j].frame);
				pizza.angle = this.pizzaDrops[i].angle
			}
		}

	}

	positionPlayer(position) {
		if(this.time.now - this.config.tilt < this.lastMove) return;
		let p = this.position = Math.max(0, Math.min(position, this.positions.length - 1));
		this.player.setPosition(this.positions[p].x, this.scale.height);
		this.player.setFrame(this.positions[p].frame);
		this.player.flipX = this.positions[p].inverted;
		this.pizzaPlate.setXY(
			this.positions[p].plateX,
			this.positions[p].plateY,
			0,
			-5
		);
		this.lastMove = this.time.now;
	}

	positionPizza(position) {
		switch(this.pizzaState) {
			case this.PIZZA_STATE.SPENDY:
				this.pizzaPosition.x = 7; 
				if(this.pizzaTargetDrop == this.pizzaPosition.x)
					this.pizzaState = this.PIZZA_STATE.FELTY;
				else
					this.pizzaState = this.PIZZA_STATE.BELTY;
				this.pizza.setPosition(
					this.conveyerBeltX[this.pizzaPosition.x],
					this.conveyerBeltY
				);
			break;
			case this.PIZZA_STATE.BELTY:
				if(this.pizzaTargetDrop < this.pizzaPosition.x)
					this.pizzaPosition.x -= 0.5;
				else
					this.pizzaPosition.x += 0.5;
				this.pizza.setPosition(
					(this.conveyerBeltX[Math.floor(this.pizzaPosition.x)]
					+	this.conveyerBeltX[Math.ceil(this.pizzaPosition.x)])/2,
					this.conveyerBeltY
				);
				this.pizza.angle = Math.random() * 20 - 10;
				if(this.pizzaTargetDrop == this.pizzaPosition.x)
					this.pizzaState = this.PIZZA_STATE.FELTY;
			break;
			case this.PIZZA_STATE.FELTY:
				this.pizzaPosition.y = Math.max(0, Math.min(position, this.pizzaDrops[this.pizzaPosition.x].drops.length - 1));
				this.pizza.setPosition(
					this.pizzaDrops[this.pizzaPosition.x].x,
					this.pizzaDrops[this.pizzaPosition.x].drops[this.pizzaPosition.y].y
				);
				this.pizza.angle = this.pizzaDrops[this.pizzaPosition.x].drops[this.pizzaPosition.y].angle;
				this.pizza.setFrame(this.pizzaDrops[this.pizzaPosition.x].drops[this.pizzaPosition.y].frame);
			break;
		}

	}

	preparePlayerPositions() {
		this.positions = [
			{ x: 140 - 140, frame: 0, inverted: false, plateX: 50, plateY: 392},
			{ x: 256 - 145, frame: 1, inverted: false, plateX: 165, plateY: 313},
			{ x: 348 - 145, frame: 2, inverted: false, plateX: 284, plateY: 348},
			{ x: 474 - 145, frame: 3, inverted: false, plateX: 400, plateY: 432},
			{ x: 553 - 145, frame: 4, inverted: false, plateX: 550, plateY: 407},
			{ x: 623 - 145, frame: 5, inverted: false, plateX: 698, plateY: 432},
			{ x: 727 - 145, frame: 6, inverted: false, plateX: 791, plateY: 348},
			{ x: 812 - 145, frame: 7, inverted: false, plateX: 904, plateY: 313},
			{ x: 885 - 145, frame: 8, inverted: false, plateX: 980, plateY: 392}
		];
		let drops = [
			{ y: 75, angle: 0,	 	frame: 0 },
			{ y: 120, angle: 10,	frame: 0 },
			{ y: 166, angle: 24,	frame: 0 },
			{ y: 211, angle: -15,	frame: 0 },
			{ y: 256, angle: 13,	frame: 0 },
			{ y: 302, angle: -5,	frame: 0 },
			{ y: 347, angle: 1, 	frame: 0 },
			{ y: 393, angle: 15,	frame: 0 },
			{ y: 438, angle: -7,	frame: 0 },
			{ y: 500, angle: 0, 	frame: 1 }
		];
		this.pizzaDrops = [
			{ x: 50,  drops: drops, catch: [7, 8] },
			{ x: 164, drops: drops, catch: [5, 6] },
			{ x: 284, drops: drops, catch: [6, 7] },
			{ x: 399, drops: drops, catch: [8] },
			{ x: 549, drops: drops, catch: [7, 8] },
			{ x: 698, drops: drops, catch: [8] },
			{ x: 791, drops: drops, catch: [6, 7] },
			{ x: 904, drops: drops, catch: [5, 6] },
			{ x: 980, drops: drops, catch: [7, 8] }
		];
		this.conveyerBeltX = [
			50,
			50 + 116 * 1,
			50 + 116 * 2,
			50 + 116 * 3, 
			50 + 116 * 4,
			50 + 116 * 5,
			50 + 116 * 6,
			50 + 116 * 7,
			50 + 116 * 8
		];
	}

	spawnPizza() {
		this.pizzaTargetDrop = Math.floor(
			Math.random() * (this.pizzaDrops.length - 1)
		);
		this.pizzaPosition.y = 1;

		this.pizzaState = this.PIZZA_STATE.SPENDY;
	
		this.pizza = this.pizzas.create(
			this.bigSpenderX,
			this.bigSpenderY, 
			'pizza'
		);
		this.pizza.setOrigin(0.5, 0.5);
	}

	platePizza(){
		if(this.pizzaPlate.getLength() == 5)
			this.pizzaPlate.clear(true);
		else {
			let p = this.pizzaPlate.create(
				this.positions[this.position].plateX,
				this.positions[this.position].plateY + this.pizzaPlate.getLength() * -5,
				'pizza'
			);
			p.setOrigin(0.5, 1);
		}
	}

	scream(text) {
		let t = this.add.text(
			this.positions[this.position].x + 145
			,	200
			,	text.toUpperCase()
			,	{
				color: "white",
				backgroundColor: "black",
				fontSize: 32,
				textTransform: "uppercase"
			}
		);

		this.tweens.add({
			targets: t
			,	delay: 0
			,	duration: 900
			,	y: 0
			,	alpha: 0
			,	onComplete: function(obj) {
				t.destroy();
			}
		});
	}

	update() {
		if(this.gameOver) return;
		if(this.cursors.left.isDown || this.controls.left) {
			this.positionPlayer(this.position - 1);
		} else if(this.cursors.right.isDown || this.controls.right) {
			this.positionPlayer(this.position + 1);
		}
		this.controls.right = this.controls.left = this.controls.enter = false;

		if(this.time.now - this.config.pizzaTick  > this.lastPizzaMove) {
			this.positionPizza(this.pizzaPosition.y + 1);
			this.lastPizzaMove = this.time.now;
		}
		if(this.pizzaState != this.PIZZA_STATE.FELTY) return;
		if(this.position == this.pizzaPosition.x
			&& this.pizzaDrops[this.pizzaPosition.x].catch.indexOf(this.pizzaPosition.y) != -1)
		{
			this.pizza.destroy();
			this.platePizza();
			this.spawnPizza();
			this.score += this.config.pizzaCatchBonus;
			this.scoreBox.setText("Yum: " + this.score);
			this.scream(this.yas[Math.floor(this.yas.length * Math.random())]);
		} else if(this.pizzaPosition.y >= this.pizzaDrops[this.pizzaPosition.x].drops.length - 1) {
			this.lifesCount--;
			if(this.lifesCount >= 0) {
				this.lifes[this.lifes.length - this.lifesCount - 1].setFrame(1);
				this.pizza.setFrame(1);					
				this.spawnPizza();
				this.score += this.config.pizzaCowBonus;
				this.scoreBox.setText("Yum: " + this.score);
				this.scream(this.nas[Math.floor(this.nas.length * Math.random())]);
			} else {
				this.gameOver = true;
				this.game.score = this.score;
				this.scene.stop();
				this.scene.start('score');
			}
		}
	}
}
