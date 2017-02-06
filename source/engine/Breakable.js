"use strict";

var state = require('./state.json');
var Updatable = require('./Updatable');

function Breakable(o_config) {

	var i_self = this;

	Updatable.call(i_self, o_config);
}

Breakable.prototype = Object.create(Updatable.prototype);
Object.assign(Breakable.prototype, {
	constructor: Breakable,
	state: state.ALIVE
});

module.exports = Breakable;
