"use strict";

var BaseObject = function(o_config) {

	var i_self = this;

	if (o_config) {
		Object.assign(i_self, o_config);
	}

	return i_self;
};

module.exports = BaseObject;
