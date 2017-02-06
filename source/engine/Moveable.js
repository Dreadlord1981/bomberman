"use strict";

var Updatable = require('./Updatable');

function Moveable(o_config) {

	var i_self = this;

	Updatable.call(i_self, o_config);

	return i_self;
};

Moveable.prototype = Object.create(Updatable.prototype);
Object.assign(Moveable.prototype, {
	constructor: Moveable,
	initEvents: function() {}
});

module.exports = Moveable;
