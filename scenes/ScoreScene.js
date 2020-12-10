export default class ScoreScene extends Phaser.Scene {
	constructor() {
		super('score');
	}

	preload() {
		this.load.image('background', 'assets/background.png');
	}

	create() {
		this.add.image(512, 256, 'background');
		this.add.text(5, 5, "YOUR SCORE IS " + this.game.score);
		let start = this.add.text(5, 30, "START OVER AGAIN");

		this.input.once('pointerdown', function () {

            this.scene.stop();
            this.scene.start('pizza-machine');

        }, this);
	}
}