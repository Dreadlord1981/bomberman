"use strict";

var state = require('./state.json');
var Updatable = require('./Updatable');

function Breakable() {

	var i_self = this;
	var o_config = arguments[0] || {};

	Object.assign(o_config, {
		state: state.ALIVE
	});

	Updatable.call(i_self, o_config);
}

module.exports = Breakable;
