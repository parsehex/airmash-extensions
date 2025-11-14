// ==UserScript==
// @name         AIRMASH: Flag Borders
// @namespace    http://parsehex.github.io/
// @version      1.1
// @description  Show borders around your window whenever a flag is being carried.
// @author       parsehex, original: fabiospampinato
// @match        https://airmash.rocks/
// @match        http://localhost:3501/
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==
(function () {
	/* INIT */

	// reset on new game
	const Games_Prep = Games.prep;
	Games.prep = () => {
		toggleBlue(false);
		toggleRed(false);
		Games_Prep();
	};

	function init() {
		initHTML();
		initStyle();
		initEvents();
	}

	function initHTML() {
		const html = `
      <div id="flag-border-blue-left"></div>
      <div id="flag-border-blue-right"></div>
      <div id="flag-border-red-left"></div>
      <div id="flag-border-red-right"></div>
    `;

		$('body').append(html);

		toggleRed(false);
		toggleBlue(false);
	}

	function initStyle() {
		const style = `
      <style>
        #flag-border-blue-left, #flag-border-red-left, #flag-border-blue-right, #flag-border-red-right {
          pointer-events: none;
          position: fixed;
          top: 0;
          bottom: 0;
          border-style: solid;
          width: 50vw;
          box-sizing: border-box;
          opacity: .75;
        }

        #flag-border-blue-left, #flag-border-red-left {
          left: 0;
          border-width: 5px 0 5px 5px;
        }

        #flag-border-blue-right, #flag-border-red-right {
          right: 0;
          border-width: 5px 5px 5px 0;
        }

        #flag-border-blue-left, #flag-border-blue-right {
          border-color: #2d6eeb;
        }

        #flag-border-blue-left {
          z-index: 1;
        }

        #flag-border-red-left, #flag-border-red-right {
          border-color: #bc2a2e;
        }

        #flag-border-red-right {
          z-index: 1;
        }
      </style>
    `;

		$('head').append(style);
	}

	function initEvents() {
		// CTF_FlagEvent
		const UI_serverMessage = UI.serverMessage;
		UI.serverMessage = (msg) => {
			UI_serverMessage(msg);

			const isCtf = game.gameType === 2;
			if (isCtf) {
				const isFlagEvent = msg.c === 90;
				const isBlueFlag = msg.text.includes('blueflag'); // 1
				const isRedFlag = msg.text.includes('redflag'); // 2
				const team = isBlueFlag ? 1 : isRedFlag ? 2 : '';
				const pieces = msg.text.split('</span>');
				const verbText = pieces[pieces.length - 1];
				const verb = verbText.split(' ')[0].toLowerCase();
				if (isFlagEvent) {
					onFlagEvent(msg, team, verb);
				}
			}
		};
	}

	window.addEventListener('load', init);

	/* EVENTS */

	function onFlagEvent(event, team, verb) {
		const taken = verb === 'taken';

		if (team === 1) {
			toggleBlue(taken);
		} else if (team === 2) {
			toggleRed(taken);
		}
	}

	/* API */

	function _toggleElement(selector, force) {
		if (force === undefined) {
			force = !$(selector).is(':visible');
		}
		if (force) {
			UI.show(selector);
		} else {
			UI.hide(selector);
		}
	}

	function toggleBlue(force) {
		_toggleElement('#flag-border-blue-left', force);
		_toggleElement('#flag-border-blue-right', force);
	}

	function toggleRed(force) {
		_toggleElement('#flag-border-red-left', force);
		_toggleElement('#flag-border-red-right', force);
	}
})();
