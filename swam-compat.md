# SWAM without SWAM

One of my goals here is to develop userscript mods for airmash without needing to use starmash, since the modern vanilla client/frontend is much like SWAM itself. This document is about what I have done to make SWAM extensions work without SWAM.

## Events

Starmash allows listening for various things during the life of the extension. The process I use to match compatibility here is to find the game's code that the event looks for and I hook into that game function and do whatever custom stuff is needed before calling the original function.

For example, to listen for players being killed we can use:

```js
SWAM.on('playerKilled', function(msg, victim, killer) {
  // do stuff
});
```

and to hook into the vanilla engine to do the same:

```js
const oldPlayersKill = Players.kill;
Players.kill = function(msg) {
  const victim = Players.get(msg.id);
  const killer = Players.get(msg.killer);
  // do stuff
  oldPlayersKill(msg);
}
```
