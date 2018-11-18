"use strict";

var BaseObject = require("./BaseObject");
var Asset = require("./Asset");
var Breakable = require("./Breakable");
var Camera = require("./Camera");

function GameMap() {

	var i_self = this;
	i_self = Object.assign(i_self, {

		CAMERA: null,
		TYPE: {
			GROUND: 1,
			WALL: 2,
			SOLID: 3
		},
		points: [],
		level: [
			"111111111111111111111".split(""),
			"1S..................1".split(""),
			"1....2.....22222....1".split(""),
			"1....2.........2....1".split(""),
			"1..22222.......2....1".split(""),
			"1....2....222..2....1".split(""),
			"1....2......2..2....1".split(""),
			"1...........2..2....1".split(""),
			"1.....222222222222..1".split(""),
			"1.....2........2....1".split(""),
			"1.....2...2....2....1".split(""),
			"1.........2.........1".split(""),
			"111111111111111111111".split("")
		]
	});

		return i_self;
};

GameMap.prototype = Object.create(BaseObject.prototype);

Object.assign(GameMap.prototype, {

	constructor: GameMap,

	init: function(i_sprite) {

		var i_self = this;
		var a_obejcts = [];

		var i_canvas = document.getElementById("canvas");
		var i_context = i_canvas.getContext("2d");

		i_self.level.forEach(function(a_values, y_index) {
			a_values.forEach(function(s_value, x_index) {

				var i_asset;
				switch (s_value) {
					case "1":
						i_asset = new Asset({
							x: x_index * 48,
							y: y_index * 48,
							width: 12,
							height: 12,
							scale: {
								width: 48,
								height: 48
							},
							texture:  {
								x: 8,
								y: 328
							},
							type: i_self.TYPE.SOLID,
							sprite: i_sprite
						});
						break;
					case "2":
						i_asset = new Breakable({
							x: x_index * 48,
							y: y_index * 48,
							width: 12,
							height: 12,
							scale: {
								width: 48,
								height: 48
							},
							texture:  {
								x: 80,
								y: 328
							},
							type: i_self.TYPE.WALL,
							sprite: i_sprite
						});
						break;
					default:
						i_asset = new Asset({
							x: x_index * 48,
							y: y_index * 48,
							width: 8,
							height: 8,
							scale: {
								width: 48,
								height: 48
							},
							texture:  {
								x: 33,
								y: 328
							},
							type: i_self.TYPE.GROUND,
							sprite: i_sprite
						});
						break;
				}
				if (i_asset) {
					a_obejcts.push(i_asset);
				}
			});
		});

		i_self.objects = a_obejcts;

		var a_starts = [];

		i_self.level.forEach(function(a_values, y_index) {
			a_values.forEach(function(s_value, x_index) {

				switch (s_value) {
					case "S":
						var i_place = new Asset({
							x: x_index * 48,
							y: y_index * 48
						});
						a_starts.push(i_place);
						break;
				}
			});
		});

		i_self.points = a_starts;

		var n_width = i_self.level[0].length * 48;
		var n_height = i_self.level.length * 48;

		var i_camera = new Camera({
			world: {
				x: 0,
				y: 0,
				width: n_width,
				height: n_height
			},
			view: {
				x: 0,
				y: 0,
				width: i_context.canvas.width,
				height: i_context.canvas.height
			},
			deadZone: {
				width: i_context.canvas.width / 2,
				height: i_context.canvas.height / 2
			}
		});

		i_self.CAMERA = i_camera;
	},

	drawGround: function(i_context) {

		var i_self = this;

		var i_camera = i_self.CAMERA;

		var o_view = i_camera.getViewPort();

		i_self.objects.forEach(function(i_object) {

			if (i_object.getBounds) {

				i_context.fillStyle = "rgb(32,96,0)";

				//i_context.fillStyle = "rgba(225,0,0,0.5)"; <--- debug;

				i_context.fillRect(i_object.x, i_object.y, i_object.scale.width, i_object.scale.height);
			}
		});
	},

	drawWalls: function(i_context) {

		var i_self = this;

		var i_camera = i_self.CAMERA;

		var o_view = i_camera.getViewPort();

		i_self.objects.forEach(function(i_object) {

			if (i_object.type == i_self.TYPE.WALL) {
				i_context.drawImage(i_object.sprite, i_object.texture.x, i_object.texture.y, i_object.width, i_object.height, i_object.x, i_object.y, i_object.scale.width, i_object.scale.height);
			}
		});
	},

	drawSolids: function(i_context) {

		var i_self = this;

		i_self.objects.forEach(function(i_object) {

			if (i_object.type == i_self.TYPE.SOLID) {
				i_context.drawImage(i_object.sprite, i_object.texture.x, i_object.texture.y, i_object.width, i_object.height, i_object.x, i_object.y, i_object.scale.width, i_object.scale.height);
			}
		});
	}
});

module.exports = GameMap;
