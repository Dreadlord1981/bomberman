Bomb = function(){
	
	var i_self = this;
	var o_config = arguments[0] || {};

	o_config = Object.assign(o_config,{
		x: o_config.x,
		y: o_config.y,
		width: 16,
		height: 16,
		scale: {
			width: 48,
			height: 48
		},
		texture:  {
			x: 8,
			y: 275
		},
		sprite: o_config.sprite,
		frameIndex: 0,
		flameSize: o_config.flameSize || 1,
		frames: {
			ticks: [
				{
					x: 8,
					y: 275
				},
				{
					x: 32,
					y: 275
				},
				{
					x: 56,
					y: 275
				},
				{
					x: 32,
					y: 275
				}
			],
			explode: {
				center: [
					{
						x: 126,
						y: 350
					},
					{
						x: 150,
						y: 350
					},
					{
						x: 174,
						y: 350
					},
					{
						x: 198,
						y: 350
					}
				],
			}
		},
		init: function() {

			var i_bomb = this;
			i_bomb.frame = i_bomb.frames.ticks[i_bomb.frameIndex];
		},
		timer: null,
		ticks: 0,
		frame: null,
		flames: [],
		passable: true,
		velocity: 0,
		direction: null,
		doTick: function(f_callback) {

			var i_bomb = this;
			i_bomb.ticks++;
			if (i_bomb.ticks <= 120) {
				i_bomb.timer = setTimeout(function() {
					i_bomb.frameIndex++;
					if (i_bomb.frameIndex >= i_bomb.frames.ticks.length) {
						i_bomb.frameIndex = 0;
					}
					i_bomb.frame = i_bomb.frames.ticks[i_bomb.frameIndex];
					i_bomb.doTick(f_callback);
				}, 125);
			}
			else {
				if(f_callback) {
					i_bomb.frameIndex = 0;
					f_callback();
				}
			}
			
		},
		update: function() {

			var i_self = this;

			if (i_self.velocity) {

				switch(i_self.direction) {

					case Direction.UP:
						i_self.y -= i_self.velocity;
						break;
					case Direction.DOWN:
						i_self.y += i_self.velocity;
						break;
					case Direction.LEFT:
						i_self.x -= i_self.velocity;
						break;
					case Direction.RIGHT:
						i_self.x += i_self.velocity;
						break;
				}
			}
		},
		createFlames: function() {

			var i_bomb = this;
			var i_bombBounds = i_bomb.getBounds();
			var a_flames = [];

			for(var i = 1; i <= i_bomb.flameSize; i++) {

				var i_up = new Asset({
					sprite: i_self.sprite,
					x: i_bombBounds.left,
					y: i_bombBounds.top - ((i_bomb.scale.height - 16) * i),
					width: 16,
					height: 16,
					direction: Direction.UP,
					scale: {
						width: 48,
						height: 48
					},
					getBounds: function() {

						var i_self = this;

						var o_bounds = {
							left: i_self.x + 16,
							top: i_self.y + 16,
							right: i_self.x + (i_self.scale.width - 32),
							bottom: i_self.y + (i_self.scale.height)
						};
						return o_bounds;
					},
					frames: [
						{
							x: i == i_bomb.flameSize ? 222 : 198,
							y: i == i_bomb.flameSize ? 350 : 374,
						},
						{
							x: i == i_bomb.flameSize ? 246 : 222,
							y: i == i_bomb.flameSize ? 350 : 374
						},
						{
							x: i == i_bomb.flameSize ? 270 : 246,
							y: i == i_bomb.flameSize ? 350 : 374
						},
						{
							x: i == i_bomb.flameSize ? 294 : 270,
							y: i == i_bomb.flameSize ? 350 : 374
						}
					]
				});

				var i_left = new Asset({
					sprite: i_self.sprite,
					x: i_bombBounds.left - ((i_bomb.scale.width - 16) * i),
					y: i_bombBounds.top,
					width: 16,
					height: 16,
					direction: Direction.LEFT,
					scale: {
						width: 48,
						height: 48
					},
					getBounds: function() {

						var i_self = this;

						var o_bounds = {
							left: i_self.x,
							top: i_self.y + 16,
							right: i_self.x + i_self.scale.width,
							bottom: i_self.y + (i_self.scale.height - 32)
						};
						return o_bounds;
					},
					frames: [
						{
							x: i == i_bomb.flameSize ? 102 : 294,
							y: 374
						},
						{
							x: i == i_bomb.flameSize ? 126 : 318,
							y: 374
						},
						{
							x: i == i_bomb.flameSize ? 150 : 342,
							y: 374
						},
						{
							x: i == i_bomb.flameSize ? 174 : 364,
							y: 374
						}
					]
				});

				var i_rigth = new Asset({
					sprite: i_self.sprite,
					x: i_bombBounds.left + ((i_bomb.scale.width - 16) * i),
					y: i_bombBounds.top,
					width: 16,
					height: 16,
					direction: Direction.RIGHT,
					scale: {
						width: 48,
						height: 48
					},
					getBounds: function() {

						var i_self = this;

						var o_bounds = {
							left: i_self.x,
							top: i_self.y + 16,
							right: i_self.x + i_self.scale.width,
							bottom: i_self.y + (i_self.scale.height - 32)
						};
						return o_bounds;
					},
					frames: [
						{
							x: i == i_bomb.flameSize ? 318 : 294,
							y: i == i_bomb.flameSize ? 350 : 374
						},
						{
							x: i == i_bomb.flameSize ? 342 : 318,
							y: i == i_bomb.flameSize ? 350 : 374
						},
						{
							x: i == i_bomb.flameSize ? 366 : 342,
							y: i == i_bomb.flameSize ? 350 : 374
						},
						{
							x: i == i_bomb.flameSize ? 390 : 364,
							y: i == i_bomb.flameSize ? 350 : 374
						}
					]
				});

				var i_down = new Asset({
					sprite: i_self.sprite,
					x: i_bombBounds.left,
					y: i_bombBounds.top + ((i_bomb.scale.height - 16) * i),
					width: 16,
					height: 16,
					direction: Direction.DOWN,
					scale: {
						width: 48,
						height: 48
					},
					getBounds: function() {

						var i_self = this;

						var o_bounds = {
							left: i_self.x + 16,
							top: i_self.y - 16,
							right: i_self.x + (i_self.scale.width - 32),
							bottom: i_self.y + (i_self.scale.height)
						};
						return o_bounds;
					},
					frames: [
						{
							x: i == i_bomb.flameSize ? 6 : 198,
							y: 374
						},
						{
							x: i == i_bomb.flameSize ? 30 : 222,
							y: 374
						},
						{
							x: i == i_bomb.flameSize ? 54 : 246,
							y: 374
						},
						{
							x: i == i_bomb.flameSize ? 78 : 270,
							y: 374
						}
					]
				});

				i_bomb.flames.push(i_up);
				i_bomb.flames.push(i_left);
				i_bomb.flames.push(i_rigth);
				i_bomb.flames.push(i_down);

			}
		},
		triggerExplode: function(f_callback) {

			var i_bomb = this;
			clearTimeout(i_bomb.timer);
			i_bomb.frameIndex = 0;
			i_bomb.createFlames();
			i_bomb.velocity = 0;
			i_bomb.direction = null;
			i_bomb.doExplode(function() {
				if(f_callback) {
					f_callback();
				}
			});
		},
		doExplode: function(f_callback) {

			var i_bomb = this;
			i_bomb.velocity = 0;
			i_bomb.direction = null;
			if (i_bomb.frameIndex < i_bomb.frames.explode.center.length) {
				i_bomb.timer = setTimeout(function() {
					i_bomb.frameIndex++;
					i_bomb.frame = i_bomb.frames.explode.center[i_bomb.frameIndex];

					i_bomb.flames.forEach(function(i_flame) {
						i_flame.frame = i_flame.frames[i_bomb.frameIndex];
					});

					i_bomb.doExplode(f_callback);
				}, 125);
			}
			else {
				if(f_callback) {
					f_callback();
				}
			}
		}
	});
	Updatable.call(i_self, o_config)	
};