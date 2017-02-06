"use strict";

var Updatable = require('./Updatable');
var direction = require('./direction.json');
var Asset = require('./Asset');

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
		flames: [],
		passable: true,
		velocity: 0,
		direction: null
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
		if (i_self.frameIndex < i_self.frames.explode.center.length) {
			i_self.timer = setTimeout(function() {
				i_self.frameIndex++;
				i_self.frame = i_self.frames.explode.center[i_self.frameIndex];

				i_self.flames.forEach(function(i_flame) {
					i_flame.frame = i_flame.frames[i_self.frameIndex];
				});

				i_self.doExplode(f_callback);
			}, 125);
		}
		else {
			if (f_callback) {
				f_callback();
			}
		}
	},
	doTick: function(f_callback) {

		var i_self = this;
		i_self.ticks++;
		if (i_self.ticks <= 120) {
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
	update: function() {

		var i_self = this;

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
	},
	createFlames: function() {

		var i_self = this;
		var i_bombBounds = i_self.getBounds();
		var a_flames = [];

		for (var i = 1; i <= i_self.flameSize; i++) {

			var i_up = new Asset({
				sprite: i_self.sprite,
				x: i_bombBounds.left,
				y: i_bombBounds.top - ((i_self.scale.height - 16) * i),
				width: 16,
				height: 16,
				direction: direction.UP,
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

			i_self.flames.push(i_up);
			i_self.flames.push(i_left);
			i_self.flames.push(i_rigth);
			i_self.flames.push(i_down);
		}
	}
});

module.exports = Bomb;
