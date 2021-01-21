export default class StartScene extends Phaser.Scene {
	constructor() {
		super('start');
	}

	preload() {
		this.load.image('background-start', 'assets/background-start.png');
	}

	create() {
		this.add.image(512, 256, 'background-start');

		this.input.once('pointerdown', this.moveOn, this);
		this.input.keyboard.once('keydown-SPACE', this.moveOn, this);
	}

	moveOn() {
		this.scene.stop();
		this.scene.start('pizza-machine');		
	}
}