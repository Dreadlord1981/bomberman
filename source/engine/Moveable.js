"use strict";

var Updatable = require('./Updatable');

function Moveable() {

	var i_self = this;

	var o_config = arguments[0] || {};

	o_config = Object.assign(o_config, {
		initEvents: o_config.initEvents ? o_config.initEvents : function() {}
	});

	Updatable.call(i_self, o_config);

	return i_self;
};

Moveable.prototype = Object.create(Updatable.prototype);
Moveable.prototype.constructor = Moveable;

module.exports = Moveable;
