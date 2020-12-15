export default class StartQRScene extends Phaser.Scene {
	constructor() {
		super('start');
		this.channel = Math.floor(Math.random() * (100000 - 1) + 1);
		this.bang = ((1<<24)*Math.random()|0).toString(16);
	}

	preload() {
		this.load.image('background-qr', 'assets/background-qr.png');

		// QR Code
		let uri = window.location.origin + window.location.pathname.replace('index', 'controls');
		if(uri.indexOf('controls') == -1)
			uri += '/controls.html';
		uri += '?hash=' + this.bang + '|' + this.channel;
		let size = 400;
		let qrURL = 'https://api.qrserver.com/v1/create-qr-code/?size='
			+ size + 'x'
			+ size + '&data=' + uri;

		console.log(qrURL);

		this.load.image('qr', qrURL);
	}

	create() {

		let socketUrl = 'wss://us-nyc-1.websocket.me/v3/'
			+ this.channel
			+ '?api_key=QJ3733IrJhU667fuYoITyxYedPDd9VST5xuhV6Xz&notify_self';

		let socket = new WebSocket(socketUrl);

		let bang = this.bang;

		socket.onopen = function() {
		    console.log(`Websocket connected`);
		    socket.send(JSON.stringify({
		        event: 'new game',
		        sender: 'pizza-machine',
		        bang: bang
		    }));
		};

		this.game.registry.set('socket', socket);
		this.game.registry.set('channel', this.channel);
		this.game.registry.set('bang', this.bang);

		this.add.image(512, 256, 'background-qr');
		this.add.image(
			750,
			256,
			'qr'
		);

        let t = this;
        this.game.registry.get('socket').onmessage = function(message) {
        	let data = JSON.parse(message.data);
        	console.log(data);
        	if(data.bang != t.bang) return;
        	if(data.event == 'control-ready')
        		t.moveOn();
        };
		this.input.once('pointerdown', this.moveOn, this);
		this.input.keyboard.once('keydown', this.moveOn, this);
	}

	moveOn() {
		this.scene.stop();
		this.scene.start('pizza-machine');		
	}
}