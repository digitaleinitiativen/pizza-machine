export default class StartQRScene extends Phaser.Scene {
	constructor() {
		super('start');
	}

	preload() {
		this.load.image('background', 'assets/background.png');

		// QR Code
		let uri = window.location.href.replace('index', 'controls');
		if(uri == window.location.href)
			uri += '/controls.html';
		let bang = ((1<<24)*Math.random()|0).toString(16);
		uri += '#000000';// + bang;
		let size = 400;
		let qrURL = 'https://api.qrserver.com/v1/create-qr-code/?size='
			+ size + 'x'
			+ size + '&data=' + uri;
		this.load.image('qr', qrURL);
	}

	create() {
		this.add.image(512, 256, 'background');
		this.add.image(
			this.scale.width / 2 + 200,
			this.scale.height / 2,
			'qr'
		);
		this.add.text(5, 5, "WELCOME TO PIZZA MACHINE");
		let start = this.add.text(5, 30, "START");

		this.input.once('pointerdown', function () {

            this.scene.stop();
            this.scene.start('pizza-machine');

        }, this);
	}
}