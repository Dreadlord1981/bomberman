"use strict";

var utils = require('../utils');
var Updatable = require('./Updatable');
var direction = require('./direction.json');
var Asset = require('./Asset');
var state = require('./state.json');

function Bomb() {
	
	var i_self = this;
	var o_config = arguments[0] || {};

	o_config = Object.assign(o_config, {
		x: o_config.x,
		y: o_config.y,
		width: 16,
		height: 16,
		scale: {
			width: 48,
			height: 48
		},
		texture:  {
			x: 8,
			y: 275
		},
		sprite: o_config.sprite,
		frameIndex: 0,
		flameSize: o_config.flameSize || 1,
		frames: {
			ticks: [
				{
					x: 8,
					y: 275
				},
				{
					x: 32,
					y: 275
				},
				{
					x: 56,
					y: 275
				},
				{
					x: 32,
					y: 275
				}
			],
			explode: {
				center: [
					{
						x: 126,
						y: 350
					},
					{
						x: 150,
						y: 350
					},
					{
						x: 174,
						y: 350
					},
					{
						x: 198,
						y: 350
					}
				]
			}
		},
		timer: null,
		ticks: 0,
		frame: null,
		flames: {
			left: [],
			right: [],
			up: [],
			down: []
		},
		flameCount: 0,
		passable: true,
		velocity: 0,
		direction: null,
		exploded: false
	});
	Updatable.call(i_self, o_config);	
};

Bomb.prototype = Object.create(Asset.prototype);

Object.assign(Bomb.prototype, {
	constructor: Bomb,

	init: function() {

		var i_self = this;
		i_self.frame = i_self.frames.ticks[i_self.frameIndex];
	},

	triggerExplode: function(f_callback) {

		f_callback = f_callback || utils.emptyFn;

		var i_self = this;
		clearTimeout(i_self.timer);

		i_self.frameIndex = 0;
		i_self.createFlames();
		i_self.velocity = 0;
		i_self.direction = null;

		i_self.doExplode(function() {
			if (f_callback) {
				f_callback();
			}
		});
	},

	doExplode: function(f_callback) {

		var i_self = this;
		i_self.velocity = 0;
		i_self.direction = null;
		i_self.exploding = true;

		var a_flames = i_self.getFlames();

		if (i_self.frameIndex < i_self.frames.explode.center.length) {
			i_self.timer = setTimeout(function() {
				i_self.frameIndex++;
				i_self.frame = i_self.frames.explode.center[i_self.frameIndex];

				a_flames.forEach(function(i_flame) {
					i_flame.frame = i_flame.frames[i_self.frameIndex];
					if (i_flame.show) {
						i_flame.active = true;
					}
				});

				i_self.doExplode(f_callback);
			}, 125);
		}
		else {
			if (f_callback) {
				i_self.exploded = true;
				i_self.exploding = false;
				f_callback();
			}
		}
	},

	doTick: function(f_callback) {

		f_callback = f_callback || utils.emptyFn;

		var i_self = this;
		i_self.ticks++;

		if (i_self.ticks <= 30) {

			i_self.timer = setTimeout(function() {

				i_self.frameIndex++;
				if (i_self.frameIndex >= i_self.frames.ticks.length) {
					i_self.frameIndex = 0;
				}
				i_self.frame = i_self.frames.ticks[i_self.frameIndex];
				i_self.doTick(f_callback);

			}, 125);
		}
		else {
			if (f_callback) {
				i_self.frameIndex = 0;
				f_callback();
			}
		}
	},

	getBounds: function() {

		var i_self = this;

		var o_bounds = {
			left: i_self.x + 6,
			top: i_self.y + 6,
			right: i_self.x + (i_self.scale.width - 10),
			bottom: i_self.y + (i_self.scale.height - 12)
		};
		return o_bounds;
	},

	getActiveArea: function() {

		var i_self = this;
		var o_bounds = i_self.getBounds();

		var o_result = {
			left: o_bounds.left - 4,
			top: o_bounds.top - 8,
			right: i_self.x + i_self.scale.width,
			bottom: i_self.y + i_self.scale.height
		};

		return o_result;

	},

	update: function(a_players) {

		var i_self = this;
		var i_bombBounds = i_self.getBounds();

		if (i_self.velocity) {

			switch (i_self.direction) {

				case direction.UP:
					i_self.y -= i_self.velocity;
					break;
				case direction.DOWN:
					i_self.y += i_self.velocity;
					break;
				case direction.LEFT:
					i_self.x -= i_self.velocity;
					break;
				case direction.RIGHT:
					i_self.x += i_self.velocity;
					break;
			}
		}

		if (i_self.passable) {
			a_players.forEach(function(i_player) {

				var i_playerBounds = i_player.getBounds();
		
				var b_intersects = utils.intersects(i_playerBounds, i_bombBounds);

				if (!b_intersects) {
					i_self.passable = false;
				}
			});
		}		
	},

	checkCollition: function(a_objects, o_types) {

		var i_self = this;

		if (!i_self.passable) {

			var i_bombBounds = i_self.getBounds();

			a_objects.forEach(function(i_object) {

				if (i_object.type && i_object.type != o_types.GROUND) {

					var i_objectBounds = i_object.getBounds();

					var b_intersects = utils.intersects(i_objectBounds, i_bombBounds);

					if (b_intersects) {

						switch (i_self.direction) {

							case direction.UP:
								if (i_bombBounds.top <= i_objectBounds.bottom && i_objectBounds.top < i_bombBounds.top) {
									i_self.y = (i_objectBounds.bottom - 6);
								}
								break;
							case direction.DOWN:
								if (i_bombBounds.bottom >= i_objectBounds.top && i_objectBounds.bottom > i_bombBounds.bottom) {
									i_self.y = (i_objectBounds.top - (i_self.scale.height - 8));
								}
								break;
							case direction.LEFT:
								if (i_bombBounds.left <= i_objectBounds.right && i_objectBounds.right < i_bombBounds.right) {
									i_self.x = (i_objectBounds.right - 8) + 1;
								}

								break;
							case direction.RIGHT:
								if (i_bombBounds.right >= i_objectBounds.left && i_objectBounds.right > i_bombBounds.right) {
									i_self.x = (i_objectBounds.left - (i_self.scale.width -8)) - 1;
								}
								break;
						}
					}
				}
			});
		}
	},

	checkFlamesCollition: function(a_players, a_bombs, a_objects, o_types) {

		var i_self = this;

		var o_flames = i_self.flames;

		var a_leftFlames = o_flames.left;
		var a_upFlames = o_flames.up;
		var a_downFlames = o_flames.down;
		var a_rigthFlames = o_flames.right;

		i_self.checkSolid(a_objects, a_upFlames, o_types);
		i_self.checkSolid(a_objects,a_leftFlames, o_types);
		i_self.checkSolid(a_objects,a_downFlames, o_types);
		i_self.checkSolid(a_objects, a_rigthFlames, o_types);

		i_self.checkKillable(a_players, a_leftFlames, a_bombs);
		i_self.checkKillable(a_players, a_upFlames, a_bombs);
		i_self.checkKillable(a_players, a_downFlames, a_bombs);
		i_self.checkKillable(a_players, a_rigthFlames, a_bombs);
	},

	checkSolid: function(a_objects, a_flames, o_types) {
		
		var b_active = true;

		a_flames.forEach(function(i_flame, n_index) {

			i_flame.show = b_active;
			i_flame.active = b_active;

			if (b_active) {
				a_objects.forEach(function(i_object) {

					if (i_object.type && i_object.type != o_types.GROUND) {

						var i_objectBounds = i_object.getBounds();
						var i_flameBounds = i_flame.getBounds();

						var b_intersects = utils.intersects(i_objectBounds, i_flameBounds);

						if (b_intersects) {

							if (i_object.type === o_types.SOLID) {
								i_flame.show = false;
								i_flame.active = false;
								b_active = false;
							}
							else {
								i_object.type = o_types.GROUND;
							}
						}
					}
				});
			}
		});
	},

	checkKillable: function(a_players, a_flames, a_bombs) {

		var i_self = this;
		var i_bombBounds = i_self.getBounds();

		a_players.forEach(function(i_player) {

			var i_playerBounds = i_player.getBounds();

			a_flames.forEach(function(i_flame) {

				if (i_flame.active) {
					var i_flameBounds = i_flame.getBounds();
					
					var b_intersects = utils.intersects(i_playerBounds, i_flameBounds);

					if (b_intersects && i_player.state != state.DYING) {
						i_player.doDie();
					}

					a_bombs.forEach(function(i_bomb) {

						var i_bounds = i_bomb.getBounds();
						var b_equal = true;

						Object.keys(i_bounds).map(function(s_key) {
								
							var boundsValue = i_bombBounds[s_key];
							var value = i_bounds[s_key];

							if (boundsValue != value) {
								b_equal = false;
							}
						});

						if (!b_equal) {
							var b_intersects = utils.intersects(i_bounds, i_flameBounds);

							if (b_intersects && !i_bomb.exploding && !i_bomb.exploded) {
								i_bomb.triggerExplode(function() {});
							}
						}
					});
				}
			});
		});
	},

	createFlames: function() {

		var i_self = this;
		var i_bombBounds = i_self.getBounds();
		var a_flames = [];

		var o_flames = i_self.flames;

		for (var i = 1; i <= i_self.flameSize; i++) {

			var i_up = new Asset({
				sprite: i_self.sprite,
				x: i_bombBounds.left,
				y: i_bombBounds.top - ((i_self.scale.height - 16) * i),
				width: 16,
				height: 16,
				direction: direction.UP,
				show: true,
				active: false,
				scale: {
					width: 48,
					height: 48
				},
				getBounds: function() {

					var i_self = this;

					var o_bounds = {
						left: i_self.x + 16,
						top: i_self.y + 16,
						right: i_self.x + (i_self.scale.width - 32),
						bottom: i_self.y + (i_self.scale.height)
					};
					return o_bounds;
				},
				frames: [
					{
						x: i == i_self.flameSize ? 222 : 198,
						y: i == i_self.flameSize ? 350 : 374
					},
					{
						x: i == i_self.flameSize ? 246 : 222,
						y: i == i_self.flameSize ? 350 : 374
					},
					{
						x: i == i_self.flameSize ? 270 : 246,
						y: i == i_self.flameSize ? 350 : 374
					},
					{
						x: i == i_self.flameSize ? 294 : 270,
						y: i == i_self.flameSize ? 350 : 374
					}
				]
			});

			var i_left = new Asset({
				sprite: i_self.sprite,
				x: i_bombBounds.left - ((i_self.scale.width - 16) * i),
				y: i_bombBounds.top,
				width: 16,
				height: 16,
				show: true,
				active: false,
				direction: direction.LEFT,
				scale: {
					width: 48,
					height: 48
				},
				getBounds: function() {

					var i_self = this;

					var o_bounds = {
						left: i_self.x,
						top: i_self.y + 16,
						right: i_self.x + i_self.scale.width,
						bottom: i_self.y + (i_self.scale.height - 32)
					};
					return o_bounds;
				},
				frames: [
					{
						x: i == i_self.flameSize ? 102 : 294,
						y: 374
					},
					{
						x: i == i_self.flameSize ? 126 : 318,
						y: 374
					},
					{
						x: i == i_self.flameSize ? 150 : 342,
						y: 374
					},
					{
						x: i == i_self.flameSize ? 174 : 364,
						y: 374
					}
				]
			});

			var i_rigth = new Asset({
				sprite: i_self.sprite,
				x: i_bombBounds.left + ((i_self.scale.width - 16) * i),
				y: i_bombBounds.top,
				width: 16,
				height: 16,
				show: true,
				active: false,
				direction: direction.RIGHT,
				scale: {
					width: 48,
					height: 48
				},
				getBounds: function() {

					var i_self = this;

					var o_bounds = {
						left: i_self.x,
						top: i_self.y + 16,
						right: i_self.x + i_self.scale.width,
						bottom: i_self.y + (i_self.scale.height - 32)
					};
					return o_bounds;
				},
				frames: [
					{
						x: i == i_self.flameSize ? 318 : 294,
						y: i == i_self.flameSize ? 350 : 374
					},
					{
						x: i == i_self.flameSize ? 342 : 318,
						y: i == i_self.flameSize ? 350 : 374
					},
					{
						x: i == i_self.flameSize ? 366 : 342,
						y: i == i_self.flameSize ? 350 : 374
					},
					{
						x: i == i_self.flameSize ? 390 : 364,
						y: i == i_self.flameSize ? 350 : 374
					}
				]
			});

			var i_down = new Asset({
				sprite: i_self.sprite,
				x: i_bombBounds.left,
				y: i_bombBounds.top + ((i_self.scale.height - 16) * i),
				width: 16,
				height: 16,
				direction: direction.DOWN,

				scale: {
					width: 48,
					height: 48
				},
				getBounds: function() {

					var i_self = this;

					var o_bounds = {
						left: i_self.x + 16,
						top: i_self.y - 16,
						right: i_self.x + (i_self.scale.width - 32),
						bottom: i_self.y + (i_self.scale.height)
					};
					return o_bounds;
				},
				frames: [
					{
						x: i == i_self.flameSize ? 6 : 198,
						y: 374
					},
					{
						x: i == i_self.flameSize ? 30 : 222,
						y: 374
					},
					{
						x: i == i_self.flameSize ? 54 : 246,
						y: 374
					},
					{
						x: i == i_self.flameSize ? 78 : 270,
						y: 374
					}
				]
			});

			o_flames.up.push(i_up);
			o_flames.left.push(i_left);
			o_flames.right.push(i_rigth);
			o_flames.down.push(i_down);
		}
	},

	getFlames:  function() {

		var i_self = this;

		var o_flames = i_self.flames;

		var a_leftFlames = o_flames.left;
		var a_upFlames = o_flames.up;
		var a_downFlames = o_flames.down;
		var a_rigthFlames = o_flames.right;

		var a_flames = a_leftFlames.concat(a_rigthFlames).concat(a_upFlames).concat(a_downFlames);

		return a_flames;
	},

	draw: function(i_context) {

		var i_self = this;

		var a_flames = i_self.getFlames();

		if (i_self.frame) {

			var o_bounds = i_self.getBounds();
			var o_active = i_self.getActiveArea();

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

			i_context.fillStyle = "rgba(39,235,133,0.5)";

			i_context.fillRect(o_active.left, o_active.top, i_self.scale.width - 2, i_self.scale.height - 2);
		}

		a_flames.forEach(function(i_flame) {
			if (i_flame.frame) {
				
				if (i_flame.show) {
					i_context.drawImage(
						i_flame.sprite,
						i_flame.frame.x,
						i_flame.frame.y,
						i_flame.width,
						i_flame.height,
						i_flame.x,
						i_flame.y,
						i_flame.scale.width,
						i_flame.scale.height
					);
				}
				
				var o_bounds = i_flame.getBounds();
				i_context.fillStyle = "rgba(0,151,203,0.5)";

				//debug for flames to see bounds...
				switch (i_flame.direction) {
					case direction.LEFT:
						//i_context.fillRect(o_bounds.left, o_bounds.top, i_flame.scale.width, i_flame.scale.height - 32);
						break;
					case direction.RIGHT:
						//i_context.fillRect(o_bounds.left, o_bounds.top, i_flame.scale.width, i_flame.scale.height - 32);
						break;
					case direction.UP:
						//i_context.fillRect(o_bounds.left, o_bounds.top, i_flame.scale.width - 32, i_flame.scale.height);
						break;
					case direction.DOWN:
						//i_context.fillRect(o_bounds.left, o_bounds.top, i_flame.scale.width - 32, i_flame.scale.height);
						break;
				}
			}
		});
	}
});

module.exports = Bomb;
