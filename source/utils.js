"use strict";

function intersects(a, b) {
	var b_intersects = (
		a.left <= b.right &&
			a.right >= b.left &&
			a.top <= b.bottom &&
			a.bottom >= b.top
	);

	return b_intersects;
}

module.exports = {
	intersects: intersects
};
