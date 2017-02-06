"use strict";

var BaseObject = require('./BaseObject');

var Asset = function() {

	var i_self = this;
	var o_config = arguments[0] || {};

	BaseObject.call(i_self, o_config);

	i_self.init();

	return i_self;
};

Asset.prototype = Object.create(BaseObject.prototype);
Object.assign(Asset.prototype, {
	constructor: Asset,
	init: function() {},
	getBounds: function() {
		var i_self = this;

		var o_bounds = {
			left: i_self.x,
			top: i_self.y,
			right: i_self.x + i_self.scale.width,
			bottom: i_self.y + i_self.scale.height
		};
		return o_bounds;
	}
});

module.exports = Asset;
