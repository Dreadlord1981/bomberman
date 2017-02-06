"use strict";

var Asset = require('./Asset');

function Updatable() {

	var i_self = this;

	var o_config = arguments[0] || {};

	o_config = Object.assign(o_config, {
		update: o_config.update ? o_config.update : function() {}
	});

	Asset.call(i_self, o_config);

	return i_self;
};

Updatable.prototype = Object.create(Asset.prototype);
Updatable.prototype.constructor = Updatable;

module.exports = Updatable;
