// ==UserScript==
// @name         AIRMASH: Laser Pointer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Enable laser pointer on AIRMASH by pressing P
// @author       parsehex, original: Fabio Spampinato
// @match        https://airmash.rocks/
// @match        http://localhost:3501/
// @grant        none
// ==/UserScript==

(function () {
	/* VARIABLES */

	const PI2 = Math.PI * 2;

	let active = false,
		prevAngle = null,
		$laserPointer;

	/* INIT */

	function init() {
		initHTML();
		initStyle();
		initGame();
		// initEvents();
	}

	function initHTML() {
		const div = document.createElement('div');
		div.id = 'laser-pointer';
		document.body.appendChild(div);

		toggle(false);
	}

	function initStyle() {
		const css = `
			#laser-pointer {
				display: block;
				height: 1px;
				width: calc( 50vw * 1.5 );
				opacity: .25;
				background: white;
				position: fixed;
				top: 50%;
				left: 50%;
				rotate: -90deg;
				transform-origin: 0;
			}
    `;
		const style = document.createElement('style');
		style.innerText = css;

		document.body.appendChild(style);
	}

	function initGame() {
		$laserPointer = document.getElementById('laser-pointer');

		const cb = () => {
			if (!active || game.gameType === null) return requestAnimationFrame(cb);

			const me = Players.getMe();
			let player;
			if (game.spectatingID === null) player = me;
			else player = Players.get(game.spectatingID);

			if (me) {
				// console.log(player.rot);
				update(player.rot);
			}
			requestAnimationFrame(cb);
		};
		requestAnimationFrame(cb);
	}

	// function initEvents() {
	window.addEventListener('keydown', onKeydown);
	init();
	// }

	// SWAM.on('gameLoaded', init);

	/* EVENTS */

	function onKeydown(event) {
		if (event.key === 'p') {
			//TODO: This should be customizable

			event.stopImmediatePropagation();

			toggle(!active);
		}
	}

	/* API */

	function update(angle) {
		if (!active) return;

		if (prevAngle !== null && angle === prevAngle) return;

		const deg = (angle * 180) / Math.PI;

		$laserPointer.style.transform = `rotate(${deg}deg)`;
		// console.log(deg);

		prevAngle = angle;
	}

	function toggle(force) {
		active = force === undefined ? !active : force;
		if (active) {
			UI.show('#laser-pointer');
		} else {
			UI.hide('#laser-pointer');
		}
	}

	// name: 'Laser Pointer',
	// id: 'fabiospampinato.laserPointer',
	// description: 'Add a laser pointer to your spaceship!',
	// version: '1.0.0',
	// author: 'Fabio Spampinato',
})();
