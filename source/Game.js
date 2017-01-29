Game = {

	entries: [],
	require: function(a_required, f_callback) {
		
		var i_self = this;
		var b_loaded = true;

		if (typeof a_required === "string") {
			a_required = [{
				src: a_required
			}]
		}

		i_self.checkLoaded(a_required);

		a_required.forEach(function(o_require) {
			if (!o_require.loaded) {
				b_loaded = false;
				return false;
			}
		})

		if (b_loaded) {
			f_callback && f_callback();
			return;
		}

		var o_entry = {
			entries: a_required
		};

		i_self.entries.push(o_entry);

		a_required.forEach(function(o_require) {

			if (o_require.require) {
				i_self.require(o_require.require, function() {

					if (!o_require.loaded) {
						var s_src = o_require.src;
						var s_extension = s_src.split(".").pop();

						if (s_extension == "js") {

							o_require.head = document.getElementsByTagName("head")[0] || document.documentElement;
							o_require.elm = document.createElement('script');
							o_require.elm.type = 'text/javascript';
							o_require.elm.src = s_src;

							o_require.elm.addEventListener("load", function() {
								var b_done =  i_self.loaded(o_require);
								if(b_done) {
									f_callback && f_callback();
								}
							})

							o_require.head.append(o_require.elm);
						}
					}
				})
			}
			else {
				if (!o_require.loaded) {
					var s_src = o_require.src;
					var s_extension = s_src.split(".").pop();

					if (s_extension == "js") {

						o_require.head = document.getElementsByTagName("head")[0] || document.documentElement;
						o_require.elm = document.createElement('script');
						o_require.elm.type = 'text/javascript';
						o_require.elm.src = s_src;

						o_require.elm.addEventListener("load", function() {
							var b_done =  i_self.loaded(o_require);
							if(b_done) {
								f_callback && f_callback();
							}
						});

						o_require.head.append(o_require.elm);
					}
				}
			}
		});
	},
	loaded: function(o_loaded) {

		var i_self = this;
		var b_done = false;
		var a_entries = i_self.entries;

		
		a_entries.forEach(function(o_entry, n_entry) {

			var a_required = o_entry.entries;
			var n_index = 0;
			var b_found = false;

			a_required.forEach(function(o_require, index) {
				if (o_loaded.src == o_require.src) {
					n_index = index;
					b_found = true;
					return false;
				}
			});
			if (b_found) {
				a_required.splice(n_index, 1);
				if (a_required.length == 0) {
					b_done = true;
					i_self.entries.splice(n_entry, 1);
				}
				return false;
			}
		});

		return b_done;
	},
	checkLoaded: function (a_require) {

		var a_scripts = Array.from(document.getElementsByTagName("script"));

		a_require.forEach(function(o_require) {
			a_scripts.forEach(function(o_script) {
				if (o_script.src.indexOf(o_require.src) > -1) {
					o_require.loaded = true;
					return false;
				}
			});
		})
	},
	intersects: function(a, b) {
		var b_intersects = (
			a.left <= b.right &&
			a.right >= b.left &&
			a.top <= b.bottom &&
			a.bottom >= b.top
		);
		

		return b_intersects;
	}
};

var a_required = [
	{
		src: "/bomberman/source/engine/Player.js",
		require: [
			{
				src: "/bomberman/source/engine/map.js",
				require: [
					{
						src: "/bomberman/source/engine/core.js",
						require: [
							{
								src: "/bomberman/source/engine/Breakable.js",
								require: [
									{
										src: "/bomberman/source/engine/Asset.js",
										require: [
											{
												src: "/bomberman/source/engine/BaseObject.js",
											}
										]
									}
								]
							},
							{
								src: "/bomberman/source/engine/Bomb.js"
							}
						]
					}
				]
			}
		]
	}
];

Game.require(a_required, function() {

	var i_engine = new GameEngine();
	i_engine.loadMap();
});