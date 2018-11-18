"use strict";

var Updatable = require('./Updatable');

function Camera () {

	var i_self = this;
	var o_config = arguments[0] || {};

	Updatable.call(i_self, o_config);

	i_self.init();

	return i_self;
}

Camera.prototype = Object.create(Updatable.prototype);

Object.assign(Camera.prototype, {

	constructor: Camera,

	moveAxis: 1,

	AXIS: {
		NONE: 0,
		BOTH: 1,
		HORIZONTAL: 2,
		VERTICAL: 3
	},

	world: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},

	view: {
		x: 0,
		y: 0,
		width: 0,
		height: 0
	},

	follow: null,

	deadZone: {
		width: 0,
		height: 0
	},

	getWorldView: function() {

		var i_self = this;

		var o_world = i_self.world;

		var o_bounds = {
			x: 0,
			y: 0,
			left: 0,
			top: 0,
			rigth: o_world.width,
			bottom: o_world.height,
			width: o_world.width,
			height: o_world.height
		};

		return o_bounds;
	},

	getViewPort: function() {

		var i_self = this;

		var o_view = i_self.view;

		var o_bounds = {
			x: o_view.x,
			y: o_view.y,
			left: o_view.x,
			top: o_view.y,
			rigth: o_view.x + o_view.width,
			bottom: o_view.y + o_view.height,
			width: o_view.width,
			height: o_view.height
		};

		return o_bounds;
	},

	init: function() {},

	setFollow: function(i_player) {

		var i_self = this;
		i_self.follow = i_player;
	},

	update: function() {

		var i_self = this;

		var i_follow = i_self.follow;

		if (i_follow) {

			var o_world = i_self.getWorldView();
			var o_view = i_self.view;
			var o_deadZone = i_self.deadZone;

			var n_axis = i_self.moveAxis;

			var o_axis = i_self.AXIS;

			if (n_axis == o_axis.HORIZONTAL || n_axis == o_axis.BOTH) {

				if (i_follow.x - o_view.x + o_deadZone.width > o_world.width) {

					o_view.x = i_follow.x + (o_world.width - o_deadZone.width);
				}
				else if (i_follow.x  - o_deadZone.width < o_view.x) {
					o_view.x = i_follow.x  - o_deadZone.width;
				}
			}

			if (n_axis == o_axis.VERTICAL || n_axis == o_axis.BOTH) {

				if (i_follow.y - o_view.y + o_deadZone.height > o_world.height) {

					o_view.y = i_follow.y - (o_world.height - o_deadZone.height);
				}
				else if (i_follow.y - o_deadZone.height < o_view.y) {
					o_view.y = i_follow.y  - o_deadZone.height;
				}
			}

			i_self.adjustView();
		}
	},

	adjustView: function() {

		var i_self = this;

		var o_viewPort = i_self.getViewPort();
		var o_worldPort = i_self.getWorldView();

		var o_view = i_self.view;

		if(o_viewPort.left < o_worldPort.left){
			o_view.x = o_worldPort.left;
		}

		if(o_viewPort.top < o_worldPort.top){
			o_view.y = o_worldPort.top;
		}

		if(o_viewPort.rigth > o_worldPort.rigth){
			o_view.x = o_worldPort.rigth - o_worldPort.width;
		}

		if(o_viewPort.bottom > o_worldPort.bottom){
			o_view.y = o_worldPort.bottom - o_view.width;
		}
	}
});

module.exports = Camera;
