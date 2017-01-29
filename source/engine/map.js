GameMap = function() {

	var i_self = this;
	i_self = Object.assign(i_self, {

		TYPE: {
			GROUND: 1,
			WALL: 2
		},
		points: [],
		level:[
				[
					"1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"
				],
				[
					"1","S",".",".",".",".",".",".",".",".",".",".",".",".",".","1"
				],
				[
					"1",".",".",".",".","2",".",".",".",".",".",".",".",".",".","1"
				],
				[
					"1",".",".",".",".","2",".",".",".",".",".",".",".",".",".","1"
				],
				[
					"1",".",".","2","2","2","2","2",".",".",".",".",".",".",".","1"
				],
				[
					"1",".",".",".",".","2",".",".",".",".",".",".",".",".",".","1"
				],
				[
					"1",".",".",".",".","2",".",".",".",".",".",".",".",".",".","1"
				],
				[
					"1",".",".",".",".",".",".",".",".",".",".",".",".",".",".","1"
				],
				[
					"1",".",".",".",".",".",".",".",".",".",".",".",".",".",".","1"
				],
				[
					"1",".",".",".",".",".",".",".",".",".",".",".",".",".",".","1"
				],
				[
					"1",".",".",".",".",".",".",".",".",".",".",".",".",".",".","1"
				],
				[
					"1",".",".",".",".",".",".",".",".",".",".",".",".",".",".","1"
				],
				[
					"1","1","1","1","1","1","1","1","1","1","1","1","1","1","1","1"
				]

		],
		init: function(i_sprite) {

			var i_self = this;
			var a_obejcts = [];

			i_self.level.forEach(function(a_values, y_index) {
				a_values.forEach(function(s_value, x_index) {

					var i_asset;
					switch(s_value) {
						case "1":
							i_asset = new Asset({
								x: x_index * 48,
								y: y_index * 48,
								width: 12,
								height: 12,
								scale: {
									width: 48,
									height: 48
								},
								texture:  {
									x: 8,
									y: 328
								},
								type: i_self.TYPE.WALL,
								sprite: i_sprite
							});
							break;
						case "2":
							i_asset = new Breakable({
								x: x_index * 48,
								y: y_index * 48,
								width: 12,
								height: 12,
								scale: {
									width: 48,
									height: 48
								},
								texture:  {
									x: 80,
									y: 328
								},
								type: i_self.TYPE.WALL,
								sprite: i_sprite
							});
							break;
						default:
							i_asset = new BaseObject({
								x: x_index * 48,
								y: y_index * 48,
								width: 8,
								height: 8,
								scale: {
									width: 48,
									height: 48
								},
								texture:  {
									x: 33,
									y: 328
								},
								type: i_self.TYPE.GROUND,
								sprite: i_sprite
							});
							break;
					}
					if (i_asset) {
						a_obejcts.push(i_asset);
					}
				});
				
			});

			i_self.objects = a_obejcts;

			var a_starts = [];
			i_self.level.forEach(function(a_values, y_index) {
				a_values.forEach(function(s_value, x_index) {

					switch(s_value) {
						case "S":
							var i_place = new Asset({
								x: x_index * 48,
								y: y_index * 48,
							});
							a_starts.push(i_place);
							break;
					}
				});
			});
			i_self.points = a_starts;
		},
		draw: function() {

				var i_self = this;

				var i_canvas = document.getElementById('canvas');
				var i_context = i_canvas.getContext('2d');
				if (i_canvas.getContext) {
					var i_context = i_canvas.getContext('2d');
					i_self.objects.forEach(function(i_object) {
						i_context.drawImage(i_object.sprite, i_object.texture.x, i_object.texture.y, i_object.width, i_object.height, i_object.x, i_object.y, i_object.scale.width, i_object.scale.height);
						
						//debug;
						if (i_object.getBounds) {
							i_context.fillStyle = 'rgba(225,0,0,0.5)';
							i_context.fillRect(i_object.x, i_object.y, i_object.scale.width, i_object.scale.height);
						}
						
					});
				}
		}
	});

		return i_self;
};