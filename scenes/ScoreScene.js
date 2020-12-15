export default class ScoreScene extends Phaser.Scene {
	constructor() {
		super('score');
	}

	preload() {
		this.load.image('background-done', 'assets/background-done.png');
	}

	create() {
		this.add.image(512, 256, 'background-done');
		let t = this.add.text(213, 320, this.game.score, {
			fontSize: 40,
			color: 'black'
		});
		t.setOrigin(0.5, 0.5);

		let ti = this;
		if(this.game.registry.get('socket')) {			
			this.game.registry.get('socket').onmessage = function(message) {
				let data = JSON.parse(message.data);
				if(data.event == 'control' && data.key == "enter") {
					ti.scene.stop();
					ti.scene.start('pizza-machine');
				}
			}
		}

		this.time.addEvent({
			delay: 10000,
			callback: function() {
	            ti.moveOn();
			}
		});

		this.input.once('pointerdown', this.moveOn, this);
		this.time.addEvent({
			delay: 10000,
			callback: function() {
				ti.input.keyboard.once('keydown', ti.moveOn, ti);
			}
		});
	}

	moveOn() {
		this.scene.stop();
		this.scene.start('pizza-machine');		
	}
}