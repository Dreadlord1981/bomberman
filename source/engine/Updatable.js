"use strict";

var Asset = require('./Asset');

function Updatable() {

	var i_self = this;

	var o_config = arguments[0] || {};

	Asset.call(i_self, o_config);

	return i_self;
};

Updatable.prototype = Object.create(Asset.prototype);
Object.assign(Updatable.prototype, {
	constructor: Updatable,
	update: function() {}
});

module.exports = Updatable;
