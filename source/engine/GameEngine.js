"use strict";

var utils = require('../utils');
var BaseObject = require('./BaseObject');
var direction = require('./direction.json');
var GameMap = require('./GameMap');
var Player = require('./Player');

function GameEngine() {

	var i_self = this;
	i_self = Object.assign(i_self, {
		players: [],
		timer: null,
		sprite: null,
	});
};

GameEngine.prototype = Object.create(BaseObject.prototype);

Object.assign(GameEngine.prototype, {
	constructor: GameEngine,
	init: function() {

		var i_self = this;
		i_self.sprite = new Image();

		i_self.sprite.onload = function() {
			var i_map = new GameMap();
			i_map.init(i_self.sprite);

			var a_spawn = i_map.points;
			a_spawn.forEach(function(i_place) {

				var i_player = new Player({
					x: i_place.x,
					y: i_place.y
				});
				i_player.initialize(i_self.sprite);
				i_self.players.push(i_player);
			});
			i_self.map = i_map;
			i_self.run();
		};

		i_self.sprite.src =  "/source/resources/images/sprites.png";
	},
	draw: function() {

		var i_canvas = document.getElementById('canvas');
		var i_self = this;

		i_self.map.draw();
		var o_types = i_self.map.TYPE;
		var a_bombs = [];

		i_self.players.forEach(function(i_player) {

			var a_slice = i_player.bombs.slice();
			a_bombs = a_bombs.concat(a_slice);
		});

		i_self.players.forEach(function(i_player) {

			i_player.update();
			var i_playerBounds = i_player.getBounds();
			var b_intersects = false;
			var a_done = [];
			var a_objects = i_self.map.objects;

			if (i_player.x < 0) {
				i_player.x = 0;
			}
			else if (i_player.x > (i_canvas.width - i_player.scale.width)) {
				i_player.x = i_canvas.width - i_player.scale.width;
			}

			if (i_player.y < 0) {
				i_player.y = 0;
			}
			else if (i_player.y >  (i_canvas.height - i_player.scale.height)) {
				i_player.y = i_canvas.height - i_player.scale.height;
			}

			a_objects.forEach(function(i_object) {

				if (i_object.type && i_object.type != o_types.GROUND) {

					if (i_object.getBounds) {

						var i_objectBounds = i_object.getBounds();

						b_intersects = utils.intersects(i_playerBounds, i_objectBounds);

						if (b_intersects && i_player.walk.length > 0) {

							var s_key = i_player.walk.shift();

							a_done.push(s_key);

							i_playerBounds = i_player.getBounds();

							switch (s_key) {
								case "a":
									if (i_playerBounds.left <= i_objectBounds.right && i_objectBounds.right < i_playerBounds.right) {
										i_player.x = i_objectBounds.right + 2;
									}
									break;
								case "d":
									if (i_playerBounds.right >= i_objectBounds.left && i_objectBounds.right > i_playerBounds.right) {
										i_player.x = (i_objectBounds.left - i_player.scale.width) - 2;
									}
									break;
								case "w":
									if (i_playerBounds.top <= i_objectBounds.bottom && i_objectBounds.top < i_playerBounds.top) {
										i_player.y += 3;
									}
									break;
								case "s":
									if (i_playerBounds.bottom >= i_objectBounds.top && i_objectBounds.bottom > i_playerBounds.bottom) {
										i_player.y = (i_objectBounds.top - (i_player.scale.height + 2));
									}
									break;
							}
						}
					}
				}
			});

			a_bombs.forEach(function(i_bomb) {
				i_bomb.update();
				if (!i_bomb.passable) {

					var i_bombBounds = i_bomb.getBounds();

					b_intersects = utils.intersects(i_playerBounds, i_bombBounds);

					if (b_intersects) {
						if (i_bomb.velocity) {
							i_bomb.velocity = 0;
						}
						if (i_player.walk.length > 0) {
							var s_key = i_player.walk.shift();

							a_done.push(s_key);

							i_playerBounds = i_player.getBounds();

							switch (s_key) {
								case "a":
									if (i_playerBounds.left <= i_bombBounds.right && i_bombBounds.right < i_playerBounds.right) {
										i_player.x = i_bombBounds.right + 2;
									}
									break;
								case "d":
									if (i_playerBounds.right >= i_bombBounds.left && i_bombBounds.right > i_playerBounds.right) {
										i_player.x = (i_bombBounds.left - i_player.scale.width) - 2;
									}
									break;
								case "w":
									if (i_playerBounds.top <= i_bombBounds.bottom && i_bombBounds.top < i_playerBounds.top) {
										i_player.y += 3;
									}
									break;
								case "s":
									if (i_playerBounds.bottom >= i_bombBounds.top && i_bombBounds.bottom > i_playerBounds.bottom) {
										i_player.y = (i_bombBounds.top - (i_player.scale.height + 2));
									}
									break;
							}
						}
						if (i_player.buttons.length > 0) {
							if (i_bomb.velocity == 0) {
								i_player.kickBomb(i_bomb);
							}
						}
					}
				}
			});

			a_bombs.forEach(function(i_bomb) {

				if (!i_bomb.passable) {
					a_objects.forEach(function(i_object) {
						if (i_object.type && i_object.type != o_types.GROUND) {
							var i_objectBounds = i_object.getBounds();
							var i_bombBounds = i_bomb.getBounds();

							b_intersects = utils.intersects(i_objectBounds, i_bombBounds);

							if (b_intersects) {
								switch (i_bomb.direction) {

									case direction.UP:
										if (i_bombBounds.top <= i_objectBounds.bottom && i_objectBounds.top < i_bombBounds.top) {
											i_bomb.y += 3;
										}
										break;
									case direction.DOWN:
										if (i_bombBounds.bottom >= i_objectBounds.top && i_objectBounds.bottom > i_bombBounds.bottom) {
											i_bomb.y = (i_objectBounds.top - (i_bomb.scale.height + 2));
										}
										break;
									case direction.LEFT:
										if (i_bombBounds.left <= i_objectBounds.right && i_objectBounds.right < i_bombBounds.right) {
											i_bomb.x = i_objectBounds.right + 2;
										}

										break;
									case direction.RIGHT:
										if (i_bombBounds.right >= i_objectBounds.left && i_objectBounds.right > i_bombBounds.right) {
											i_bomb.x = (i_objectBounds.left - i_bomb.scale.width) - 2;
										}
										break;
								}
							}
						}
					});
				}
			});

			i_player.draw();
			i_player.buttons = [];
			if (i_player.walk.length == 0) {
				i_player.walk = a_done;
			}

			//debug;
		});
	},
	clear: function() {
		var i_canvas = document.getElementById('canvas');
	},
	loadMap: function(s_file) {

		this.init();
	},
	run: function() {

		var i_engine = this;
		i_engine.clear();
		i_engine.draw();
		i_engine.timer = setTimeout(function() {
			i_engine.run();
		}, 16);
	},
	stop: function() {

		clearTimeout(this.timer);;
	}
});

	module.exports = GameEngine;
