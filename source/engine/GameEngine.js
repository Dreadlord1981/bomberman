"use strict";

var utils = require("../utils");
var BaseObject = require("./BaseObject");
var direction = require("./direction.json");
var GameMap = require("./GameMap");
var Player = require("./Player");
var state = require("./state.json");

function GameEngine() {

	var i_self = this;

	i_self = Object.assign(i_self, {
		players: [],
		timer: null,
		sprite: null,
		states: state
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

			var i_camera = i_map.CAMERA;

			var a_spawn = i_map.points;

			a_spawn.forEach(function(i_place) {

				var i_player = new Player({
					x: i_place.x,
					y: i_place.y
				});
				i_player.initialize(i_self.sprite);
				i_self.players.push(i_player);
			});

			 i_camera.setFollow(i_self.players[0]);

			i_self.map = i_map;
			i_self.run();
		};

		i_self.sprite.src =  "/source/resources/images/sprites.png";
	},

	draw: function() {

		var i_canvas = document.getElementById("canvas");
		var i_context = i_canvas.getContext("2d");

		var i_self = this;
		
		var i_map = i_self.map;
		var i_camera = i_map.CAMERA;

		var o_types = i_map.TYPE;
		var a_objects = i_map.objects;
		var o_states = i_self.states;
		var a_playes = i_self.players;

		var a_bombs = [];

		a_playes.forEach(function(i_player) {

			var a_slice = i_player.bombs.slice();
			a_bombs = a_bombs.concat(a_slice);
		});

		i_map.drawGround(i_context);
		i_map.drawSolids(i_context);
		i_map.drawWalls(i_context);

		i_camera.update();

		a_playes.forEach(function(i_player) {

			i_player.update();

			var i_playerBounds = i_player.getBounds();
			var b_intersects = false;

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

			i_player.checkCollition(a_objects, a_bombs, o_types);

			i_player.draw(i_context, i_camera);
			//debug;
		});

		a_bombs.forEach(function(i_bomb) {

			i_bomb.update(a_playes);
			i_bomb.checkCollition(a_objects, o_types);

			if (i_bomb.exploding) {
				i_bomb.checkFlamesCollition(a_playes, a_bombs, a_objects, o_types);
			}

			i_bomb.draw(i_context, i_camera);

		});

		
	},

	clear: function() {

		var i_canvas = document.getElementById("canvas");
		var i_context = i_canvas.getContext("2d");

		i_context.clearRect(0, 0, i_canvas.width, i_canvas.height);
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

		clearTimeout(this.timer);
	}
});

module.exports = GameEngine;
