BaseObject = function() {

	var i_self = this;
	var a_arguments = Array.from(arguments);
	a_arguments.forEach(function(argument) {
		if (typeof argument === 'object') {

			for( key in argument) {
				if (argument.hasOwnProperty(key)) {
					i_self[key] = argument[key];
				}
			}
		}
		else {
			i_self[argument] = argument;
		}
	});

	return  i_self;
};