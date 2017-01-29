Breakable = function() {

	var i_self = this;
	var o_config = arguments[0] || {};

	Object.assign(o_config, {
		state: State.ALIVE
	});

	Updatable.call(i_self, o_config);
}