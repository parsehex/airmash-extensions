!(function () {
	let capsOn = false;

	SWAM.on('keyup', (e) => {
		// console.log('keyup', e);
		const { key } = e;
		// console.log(e);
		if (game?.gameType === null) return;
		if (key !== 'CapsLock') return;

		capsOn = !capsOn;

		if (capsOn) {
			// console.log('Caps Lock is on');

			// every x ms, boost
			outerid = setInterval(() => {
				if (Players.getMe().energy < 0.75) return; // don't boost if we're low on energy
				if (capsOn === false) {
					// caps lock is off
					clearInterval(outerid);
					return;
				}

				// console.log('boosting');
				Network.sendKey('SPECIAL', true);

				// stop boosting after x ms
				innerid = setTimeout(() => {
					// console.log('stopping');
					Network.sendKey('SPECIAL', false);
				}, 150);
			}, 300);
		}

		// let ship = '';
		// if (keyCode === 49) ship = '1';
		// else if (keyCode === 50) ship = '2';
		// else if (keyCode === 51) ship = '3';
		// else if (keyCode === 52) ship = '4';
		// else if (keyCode === 53) ship = '5';
		// else return;

		// const ship = Players.getMe().type; // works even if /spec ing

		// Network.sendCommand('respawn', ship + '');
	});

	SWAM.registerExtension({
		name: 'speedup',
		id: 'speedup',
		description: 'Press CapsLock to go faster in pred',
		author: 'parsehex',
		version: '1.0',
	});
})();
