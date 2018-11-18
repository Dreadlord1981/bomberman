"use strict";

var utils = require("../utils");
var state = require("./state.json");
var direction = require("./direction.json");
var Moveable = require("./Moveable");
var Bomb = require("./Bomb");

function Player() {

	var i_self = this;
	var o_config = arguments[0] || {};

	o_config = Object.assign(o_config, {
		x: 48,
		y: 48,
		speed: 3,
		velocity: 0,
		MAX_SPEED: 3,
		state: state.ALIVE,
		width: 16,
		height: 20,
		frame: null,
		bombs: [],
		walk: [],
		buttons: [],
		MAX_BOMBS: 8,
		timers: {
			frame: null
		},
		actions: {
			down: {
				id: 1,
				frames: [
					{
						x: 8,
						y: 12
					},
					{
						x: 32,
						y: 12
					},
					{
						x: 8,
						y: 12
					},
					{
						x: 56,
						y: 12
					}

				]
			},
			up: {
				id: 2,
				frames: [
					{
						x: 80,
						y: 12
					},
					{
						x: 104,
						y: 12
					},
					{
						x: 80,
						y: 12
					},
					{
						x: 128,
						y: 12
					}
				]
			},
			left: {
				id: 3,
				frames: [
					{
						x: 464,
						y: 12
					},
					{
						x: 440,
						y: 12
					},
					{
						x: 464,
						y: 12
					},
					{
						x: 416,
						y: 12
					}
				]
			},
			rigth: {
				id: 4,
				frames: [
					{
						x: 152,
						y: 12
					},
					{
						x: 176,
						y: 12
					},
					{
						x: 152,
						y: 12
					},
					{
						x: 200,
						y: 12
					}
				]
			},
			dying: {
				id: 5,
				frames: [
					{
						x: 8,
						y: 12
					},
					{
						x: 224,
						y: 12
					},
					{
						x: 248,
						y: 12
					},
					{
						x: 272,
						y: 12
					},
					{
						x: 296,
						y: 12
					},
					{
						x: 320,
						y: 12
					},
					{
						x: 344,
						y: 12
					},
					{
						x: 368,
						y: 12
					},
					{
						x: 392,
						y: 12
					}
				]
			}
		},
		action: null,
		direction: direction.DOWN,
		scale: {
			width: 32,
			height: 64
		},
	});

	Moveable.call(i_self, o_config);

	return i_self;
}

Player.prototype = Object.create(Moveable.prototype);

Object.assign(Player.prototype, {
	constructor: Player,

	initialize: function(i_sprite) {

		var i_self = this;
		i_self.sprite = i_sprite;
		i_self.initEvents();
		i_self.doAction();
		i_self.reset();
	},

	getBounds: function() {

		var i_self = this;

		var o_bounds = {
			left: i_self.x,
			top: i_self.y + 20,
			right: i_self.x + i_self.scale.width,
			bottom: i_self.y + i_self.scale.height
		};
		return o_bounds;
	},

	doAction: function(f_callback) {

		var i_self = this;
		clearTimeout(i_self.timers.frame);

		var a_keys = Object.keys(i_self.actions);

		a_keys.forEach(function(s_key) {
			var o_config = i_self.actions[s_key];
			if (o_config.id == i_self.direction) {
				i_self.action = o_config;
				i_self.frame = o_config.frames[0];
				return false;
			}
		});

		i_self.getFrame(f_callback);
	},

	getFrame: function(f_callback) {

		var i_self  = this;
		if (i_self.velocity || i_self.state == state.DYING) {
			i_self.frameIndex++;
			if (i_self.frameIndex >= i_self.action.frames.length) {
				i_self.frameIndex = 0;
				if (f_callback) {
					f_callback();
				}
			}
			i_self.frame = i_self.action.frames[i_self.frameIndex];
			i_self.timers.frame = setTimeout(function() {
				i_self.getFrame(f_callback);
			}, 125);
		}
	},

	initEvents: function() {

		var i_self = this;

		document.addEventListener("keydown", function(e) {

			var s_key = e.key.toLowerCase();

			switch (s_key) {
				case "w":
				case "s":
				case "d":
				case "a":
					if (i_self.state != state.DYING) {
						if (i_self.walk.length > 0) {
							i_self.walk.pop();
						}
						if (i_self.walk.indexOf(s_key) < 0) {
							i_self.walk.push(s_key);
						}
						i_self.state = state.MOVING;
					}

					break;
				case "g":
					i_self.placeBomb();
					break;
				case "h":
					if (i_self.buttons.indexOf(s_key) < 0) {
						i_self.buttons.push(s_key);
					}
					break;
			}
		});

		document.addEventListener("keyup", function(e) {

			var s_key = e.key.toLowerCase();

			if (i_self.walk.indexOf(s_key) > -1) {
				i_self.walk.splice(i_self.walk.indexOf(s_key), 1);
			}
			if (i_self.walk.length === 0 && i_self.state != state.DYING) {
				i_self.reset();
			}
		});
	},

	doDie: function() {

		var i_self = this;

		i_self.state = state.DYING;
		i_self.direction = direction.DYING;
		i_self.doAction(function() {
			i_self.x = 49;
			i_self.y = 49;
			i_self.state = state.IDEL;
			i_self.direction = direction.DOWN;
			i_self.doAction();
			i_self.reset();
		});
	},

	kickBomb: function(i_bomb) {

		var i_self = this;

		i_bomb.velocity = 5;
		i_bomb.direction = i_self.direction;
	},

	placeBomb: function() {

		var i_self = this;
		if (i_self.state != state.DYING &&
			i_self.state != state.DEAD &&
				i_self.bombs.length <= i_self.MAX_BOMBS) {

					var i_bounds = i_self.getBounds();

					var n_x = 0;
					var n_y = 0;

					switch (i_self.direction) {
						case direction.DOWN:
							n_y = i_bounds.bottom - (i_self.height * 2);
							n_x = i_bounds.left - (i_self.width / 2);
							break;
						case direction.UP:
							n_y = i_bounds.top - 16;
							n_x = i_bounds.left - (i_self.width / 2);
							break;
						case direction.LEFT:
							n_y = i_bounds.top - (i_self.width / 4);
							n_x = i_bounds.left - (i_self.scale.width / 2);
							break;
						case direction.RIGHT:
							n_y = i_bounds.top - (i_self.width / 4);
							n_x = i_bounds.right - i_self.scale.width;
							break;
					}

					var i_bomb = new Bomb({
						x: n_x,
						y: n_y,
						sprite: i_self.sprite,
						flameSize: 1
					});

					i_bomb.doTick(function() {
						i_bomb.triggerExplode();
					});

					i_self.bombs.push(i_bomb);
				}
	},

	checkCollition: function(a_objects, a_bombs,  o_types) {

		var i_self = this;
		var i_playerBounds = i_self.getBounds();

		var a_done = [];
		var a_walk = i_self.walk.slice();
		var a_buttons = i_self.buttons.slice();

		a_objects.forEach(function(i_object) {

			if (i_object.type && i_object.type != o_types.GROUND) {

				var i_objectBounds = i_object.getBounds();

				var b_intersects = utils.intersects(i_playerBounds, i_objectBounds);

				if (b_intersects && a_walk.length > 0) {

					var s_key = a_walk.shift();

					i_playerBounds = i_self.getBounds();

					switch (s_key) {
						case "a":
							if (i_playerBounds.left <= i_objectBounds.right && i_objectBounds.right < i_playerBounds.right) {
								i_self.x = i_objectBounds.right + 2;
							}
							break;
						case "d":
							if (i_playerBounds.right >= i_objectBounds.left && i_objectBounds.right > i_playerBounds.right) {
								i_self.x = (i_objectBounds.left - i_self.scale.width) - 2;
							}
							break;
						case "w":
							if (i_playerBounds.top <= i_objectBounds.bottom && i_objectBounds.top < i_playerBounds.top) {
								i_self.y += 3;
							}
							break;
						case "s":
							if (i_playerBounds.bottom >= i_objectBounds.top && i_objectBounds.bottom > i_playerBounds.bottom) {
								i_self.y = (i_objectBounds.top - (i_self.scale.height + 2));
							}
							break;
					}

					a_done.push(s_key);
				}
			}
		});

		a_bombs.forEach(function(i_bomb) {

			if (!i_bomb.passable) {

				var i_bombBounds = i_bomb.getActiveArea();

				var i_playerBounds = i_self.getBounds();

				var b_intersects = utils.intersects(i_playerBounds, i_bombBounds);

				if (b_intersects) {

					var s_key = a_buttons.shift();

					switch (s_key) {
						case "h":
							i_self.kickBomb(i_bomb);
							i_bomb.update();
							break;
					}
				}
			}
		});

		

		a_bombs.forEach(function(i_bomb) {

			if (!i_bomb.passable) {

				var i_bombBounds = i_bomb.getBounds();

				var i_playerBounds = i_self.getBounds();

				var b_intersects = utils.intersects(i_playerBounds, i_bombBounds);

				if (b_intersects) {

					if (i_bomb.velocity) {
						i_bomb.velocity = 0;
					}

					if (a_walk.length > 0) {

						var s_key = a_walk.shift();

						switch (s_key) {
							case "a":
								if (i_playerBounds.left <= i_bombBounds.right && i_bombBounds.right < i_playerBounds.right) {
									i_self.x = i_bombBounds.right + 2;
								}
								break;
							case "d":
								if (i_playerBounds.right >= i_bombBounds.left && i_bombBounds.right > i_playerBounds.right) {
									i_self.x = (i_bombBounds.left - i_self.scale.width) - 2;
								}
								break;
							case "w":
								if (i_playerBounds.top <= i_bombBounds.bottom && i_bombBounds.top < i_playerBounds.top) {
									i_self.y += 3;
								}
								break;
							case "s":
								if (i_playerBounds.bottom >= i_bombBounds.top && i_bombBounds.bottom > i_playerBounds.bottom) {
									i_self.y = (i_bombBounds.top - (i_self.scale.height + 2));
								}
								break;
						}

						a_done.push(s_key);
					}
				}
			}
		});

		i_self.walk = a_walk;
		i_self.buttons = [];
	},

	reset: function() {

		var i_self = this;
		i_self.frame = i_self.action.frames[0];
		clearTimeout(i_self.timers.frame);
		i_self.frameIndex = 0;
		i_self.walk = [];
		i_self.state = state.IDEL;
		i_self.oldDirection = i_self.direction;
	},

	update: function() {

		var i_self = this;
		var a_keys = i_self.walk.slice();
		var a_bombs = i_self.bombs;

		if (i_self.state === state.MOVING) {

			if (a_keys.length) {

				if (i_self.velocity < i_self.MAX_SPEED) {
					i_self.velocity += i_self.speed;
				}
				if (i_self.velocity > i_self.MAX_SPEED) {
					i_self.velocity = i_self.MAX_SPEED;
				}

				var i_oldDirection = i_self.direction;
				var s_lastkey = a_keys.slice(a_keys.length - 1).pop();

				switch (s_lastkey) {
					case "a":
						i_self.direction = direction.LEFT;
						break;
					case "d":
						i_self.direction = direction.RIGHT;
						break;
					case "w":
						i_self.direction = direction.UP;
						break;
					case "s":
						i_self.direction = direction.DOWN;
						break;
				}
				if (i_self.oldDirection || i_oldDirection !== i_self.direction) {
					i_self.doAction();
					delete i_self.oldDirection;
				}

				a_keys.forEach(function(s_key) {
					switch (s_key) {
						case "a":
							i_self.x -= i_self.velocity;
							break;
						case "d":
							i_self.x += i_self.velocity;
							break;
						case "w":
							i_self.y -= i_self.velocity;
							break;
						case "s":
							i_self.y += i_self.velocity;
							break;
					}
				});
			}
			else {
				i_self.velocity = 0;
			}
		}
		else {
			i_self.velocity = 0;
		}

		var n_remove = 0;

		a_bombs.forEach(function(i_bomb, n_index) {
			if (i_bomb.exploded) {
				n_remove++;
			}
		});

		if (n_remove) {
			a_bombs.splice(0, n_remove);
		}

	},

	draw: function(i_context, i_camera) {

		var i_self = this;

		var o_viewPort = i_camera.getViewPort();

		if (i_context) {

			i_context.drawImage(
				i_self.sprite,
				i_self.frame.x,
				i_self.frame.y,
				i_self.width,
				i_self.height,
				i_self.x,
				i_self.y,
				i_self.scale.width,
				i_self.scale.height
			);
			//debug;
			//var o_bounds = i_self.getBounds();
			//i_context.fillStyle = "rgba(39,235,133,0.5)";

			//i_context.fillRect(o_bounds.left, o_bounds.top, i_self.scale.width, i_self.scale.height - 20);
		}
	}
});

module.exports = Player;
