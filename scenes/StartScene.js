export default class StartScene extends Phaser.Scene {
	constructor() {
		super('start');
	}

	preload() {
		this.load.image('background', 'assets/background.png');
	}

	create() {
		this.add.image(512, 256, 'background');
		this.add.text(5, 5, "WELCOME TO PIZZA MACHINE");
		let start = this.add.text(5, 30, "START");

		this.input.once('pointerdown', function () {

            this.scene.stop();
            this.scene.start('pizza-machine');

        }, this);
	}
}