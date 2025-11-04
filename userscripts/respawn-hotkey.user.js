// ==UserScript==
// @name         AIRMASH: Respawn Hotkey
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Adds quick-respawn hotkeys for AIRMASH. Press Shift+(1 thru 5)
// @author       parsehex
// @match        https://airmash.rocks/
// @match        http://localhost:3501/
// @grant        none
// ==/UserScript==

(function () {
	'use strict';

	window.addEventListener('keyup', function respawnHook(e) {
		if (!game || game.gameType === null) return; // Game isn't active
		if (!e.shiftKey) return;
		if (e.keyCode < 49 || e.keyCode > 53) return; // not 1-5 keys

		// exit if Chat is active
		const chatinput = document.getElementById('chatinput');
		if (chatinput && chatinput === document.activeElement) return;

		const me = Players.getMe();
		let ship = '';
		const { keyCode } = e;
		if (keyCode === 49) ship = '1';
		else if (keyCode === 50) ship = '2';
		else if (keyCode === 51) ship = '3';
		else if (keyCode === 52) ship = '4';
		else if (keyCode === 53) ship = '5';
		else if (me.type && !me.spectate) ship = me.type;
		else return;

		Network.sendCommand('respawn', ship + '');
		e.stopPropagation();
	});
})();
