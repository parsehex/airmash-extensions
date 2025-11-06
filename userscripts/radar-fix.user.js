// ==UserScript==
// @name         AIRMASH: Prowler Radar Fix
// @namespace    http://parsehex.github.io/
// @version      1.0
// @description  Prowler Radar for each aircraft type on AIRMASH.
// @author       parsehex, original: wight
// @match        https://airmash.rocks/
// @match        http://localhost:3501/
// @require      https://code.jquery.com/jquery-3.6.0.min.js
// @grant        none
// ==/UserScript==

(function () {
	const radars = {};
	const radarCircleRadius = 600;
	let isEnabled = true;
	let radarsUpdateInterval = 0;

	const $radarIndicator = $(
		'<div id="prowlerAlert-fix" style="position: absolute; top: 100px; left: calc(50% - 50px); width: 100px; height: 30px; background-color: red; opacity:0.6; display:none;"></div>'
	);

	function initRadar(player) {
		const radar = new PIXI.Graphics();

		radar.clear();
		radar.beginFill(16711680, 0.125);
		radar.drawCircle(0, 0, radarCircleRadius);
		radar.endFill();

		radars[player.id] = radar;
		game.graphics.layers.groundobjects.addChild(radar);

		return radar;
	}

	function updateRadar(player, me = Players.getMe()) {
		if (isEnabled && player) {
			const radar = radars[player.id] || initRadar(player);

			radar.position.set(player.lowResPos.x, player.lowResPos.y);

			if (
				5 != player.type ||
				(player.render && !player.stealthed) ||
				player.team == me.team ||
				player.hidden ||
				player.removedFromMap
			) {
				radar.renderable = false;
			} else {
				radar.renderable = true;
			}
		}
	}

	function updateRadars() {
		const playerIds = Players.getIDs();
		const me = Players.getMe();

		$radarIndicator.hide();

		if (isEnabled) {
			for (const playerId in playerIds) {
				const player = Players.get(playerId);

				if (
					5 == player.type &&
					player.team != me.team &&
					Tools.distance(
						player.lowResPos.x,
						player.lowResPos.y,
						me.pos.x,
						me.pos.y
					) < radarCircleRadius
				) {
					$radarIndicator.show();
				}

				updateRadar(player, me);
			}
		}
	}

	function removeRadars() {
		for (const radarId in radars) {
			removeRadar(radarId);
		}
	}

	function removeRadar(radarId) {
		const radar = radars[radarId];

		if (radar) {
			game.graphics.layers.groundobjects.removeChild(radar);
			radar.destroy();
			delete radars[radarId];
		}
	}

	const oldPlayers = {
		changeType: Players.changeType,
		kill: Players.kill,
		stealth: Players.stealth,
		impact: Players.impact,
		destroy: Players.destroy,
	};

	Players.changeType = (msg) => {
		updateRadar(Players.get(msg.id));
		oldPlayers.changeType(msg);
	};

	Players.kill = (msg) => {
		const victim = Players.get(msg.id);
		updateRadar(victim);
		oldPlayers.kill(msg);
	};

	Players.stealth = (msg) => {
		setTimeout(() => {
			updateRadar(Players.get(msg.id));
		}, 17);
		oldPlayers.stealth(msg);
	};

	Players.impact = (msg) => {
		for (let index = 0; index < msg.players.length; index += 1) {
			updateRadar(Players.get(msg.players[index].id));
		}
		oldPlayers.impact(msg);
	};

	Players.destroy = (msg) => {
		removeRadar(msg.id);
		oldPlayers.destroy(msg);
	};

	const oldScoreboardUpdate = UI.scoreboardUpdate;
	UI.scoreboardUpdate = (...args) => {
		updateRadars();
		oldScoreboardUpdate(...args);
	};

	const oldGamesPrep = Games.prep;
	Games.prep = () => {
		$('body').append($radarIndicator);

		updateRadars();
		oldGamesPrep();
	};

	const oldGamesWipe = Games.wipe;
	Games.wipe = () => {
		radarsUpdateInterval = clearInterval(radarsUpdateInterval);
		removeRadars();
		$radarIndicator.remove();
		oldGamesWipe();
	};
})();
