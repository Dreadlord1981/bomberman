"use strict";

var BaseObject = require('./BaseObject');

var Asset = function() {

	var i_self = this;
	var o_config = arguments[0] || {};

	o_config = Object.assign(o_config, {
		init: o_config.init ? o_config.init : function() {}
	});

	BaseObject.call(i_self, o_config);

	if (!o_config.getBounds) {
		i_self = Object.assign(i_self, {
		
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
	}

	i_self.init();

	return i_self;
};

Asset.prototype = Object.create(BaseObject.prototype);
Asset.prototype.constructor = Asset;

module.exports = Asset;
