Player = function() {

	var i_self = this;
	var o_config = arguments[0] || {};

	o_config = Object.assign(o_config, {
		x: 48,
		y: 48,	
		speed: 3,
		velocity: 0,
		MAX_SPEED: 3,
		state: State.ALIVE,
		width: 16,
		height: 20,
		frame: null,
		bombs: [],
		walk: [],
		buttons: [],
		MAX_BOMBS: 8,
		timers: {
			frame: null,
		},
		actions: {
			down: {
				id: 1,
				frames: [
					{
						x: 8,
						y: 12
					},
					{
						x: 32,
						y: 12
					},
					{
						x: 8,
						y: 12
					},
					{
						x: 56,
						y: 12
					}
					
				]
			},
			up: {
				id: 2,
				frames: [
					{
						x: 80,
						y: 12
					},
					{
						x: 104,
						y: 12
					},
					{
						x: 80,
						y: 12
					},
					{
						x: 128,
						y: 12
					}
				]
			},
			left: {
				id: 3,
				frames: [
					{
						x: 464,
						y: 12
					},
					{
						x: 440,
						y: 12
					},
					{
						x: 464,
						y: 12
					},
					{
						x: 416,
						y: 12
					}
				]
			},
			rigth: {
				id: 4,
				frames: [
					{
						x: 152,
						y: 12
					},
					{
						x: 176,
						y: 12
					},
					{
						x: 152,
						y: 12
					},
					{
						x: 200,
						y: 12
					}
				]
			},
			dying: {
				id: 5,
				frames: [
					{
						x: 8,
						y: 12
					},
					{
						x: 224,
						y: 12
					},
					{
						x: 248,
						y: 12
					},
					{
						x: 272,
						y: 12
					},
					{
						x: 296,
						y: 12
					},
					{
						x: 320,
						y: 12
					},
					{
						x: 344,
						y: 12
					},
					{
						x: 368,
						y: 12
					},
					{
						x: 392,
						y: 12
					}
				]
			}
		},
		action: null,
		direction: Direction.DOWN,
		scale: {
			width: 32,
			height: 64
		},
		initialize: function(i_sprite) {

			var i_self = this;
			i_self.sprite = i_sprite;
			i_self.initEvents();
			i_self.doAction();
			i_self.reset();
		},
		getBounds: function() {

			var i_self = this;

			var o_bounds = {
				left: i_self.x,
				top: i_self.y + 20,
				right: i_self.x + i_self.scale.width,
				bottom: i_self.y + i_self.scale.height
			};
			return o_bounds;
		},
		doAction: function(f_callback) {

			var i_self = this;
			clearTimeout(i_self.timers.frame);

			var a_keys = Object.keys(i_self.actions);

			a_keys.forEach(function(s_key) {
				var o_config = i_self.actions[s_key];
				if (o_config.id == i_self.direction) {
					i_self.action = o_config;
					i_self.frame = o_config.frames[0];
					return false;
				}
			});

			i_self.getFrame(f_callback);
		},
		getFrame: function(f_callback) {

			var i_self  = this;
			if (i_self.velocity || i_self.state == State.DYING) {
				i_self.frameIndex++;
				if (i_self.frameIndex >= i_self.action.frames.length) {
					i_self.frameIndex = 0;
					if (f_callback) {
						f_callback();
					}
				}
				i_self.frame = i_self.action.frames[i_self.frameIndex];
				i_self.timers.frame = setTimeout(function() {
					i_self.getFrame(f_callback);
				}, 125);
			}
			
		},
		initEvents: function() {

			var i_self = this;

			document.addEventListener("keydown", function(e) {

			var s_key = e.key.toLowerCase();

				switch(s_key) {
					case "w":
					case "s":
					case "d":
					case "a":
						if (i_self.state != State.DYING) {
							if (i_self.walk.length > 0) {
								i_self.walk.pop();
							}
							if (i_self.walk.indexOf(s_key) < 0) {
								i_self.walk.push(s_key);
							}
							i_self.state = State.MOVING;
						}
						
						break;
					case "g":
						i_self.placeBomb();
						break;
					case "h":
						if (i_self.buttons.indexOf(s_key) < 0) {
							i_self.buttons.push(s_key);
						}
						break;
				}
			});

			document.addEventListener("keyup", function(e) {

				var s_key = e.key.toLowerCase();
				
				if (i_self.walk.indexOf(s_key) > -1) {
					i_self.walk.splice(i_self.walk.indexOf(s_key), 1);
				}
				if (i_self.walk.length == 0 && i_self.state != State.DYING) {
					i_self.reset();
				} 
			});
		},
		doDie: function() {

			var i_self = this;

			i_self.state = State.DYING;
			i_self.direction = Direction.DYING;
			i_self.doAction(function() {
				i_self.x = 49;
				i_self.y = 49;
				i_self.state = State.IDEL;
				i_self.direction = Direction.DOWN;
				i_self.doAction();
				i_self.reset();
			});
		},
		kickBomb: function(i_bomb) {

			var i_self = this;

			i_bomb.velocity = 5;
			i_bomb.direction = i_self.direction;
		},
		placeBomb: function() {

			var i_self = this;
			if (i_self.state != State.DYING && 
				i_self.state != State.DEAD &&
				i_self.bombs.length <= i_self.MAX_BOMBS) {

				var i_bounds = i_self.getBounds();

				var n_x = 0;
				var n_y = 0;

				switch(i_self.direction) {
					case Direction.DOWN:
						n_y = i_bounds.bottom - (i_self.height * 2);
						n_x = i_bounds.left - (i_self.width / 2);
						break;
					case Direction.UP:
						n_y = i_bounds.top - 16;
						n_x = i_bounds.left - (i_self.width / 2);
						break;
					case Direction.LEFT:
						n_y = i_bounds.top - (i_self.width / 4);
						n_x = i_bounds.left - (i_self.scale.width / 2);
						break;
					case Direction.RIGHT:
						n_y = i_bounds.top - (i_self.width / 4);
						n_x = i_bounds.right - i_self.scale.width;
						break;
				}

				var i_bomb = new Bomb({
					x: n_x,
					y: n_y,
					sprite: i_self.sprite,
					flameSize: 2
				});
				i_bomb.doTick(function(){
					i_bomb.createFlames();
					i_bomb.doExplode(function(){
						i_self.bombs.shift();
					});
				});
				i_self.bombs.push(i_bomb);
			}
		},
		reset: function() {

			var i_self = this;
			i_self.frame = i_self.action.frames[0];
			clearTimeout(i_self.timers.frame);
			i_self.frameIndex = 0;
			i_self.walk = [];
			i_self.state = State.IDEL;
			i_self.oldDirection = i_self.direction;
		},
		update: function() {

			var i_self = this;
			var a_keys = i_self.walk;
			if (i_self.state === State.MOVING) {

				if (a_keys.length) {

					if (i_self.velocity < i_self.MAX_SPEED) {
						i_self.velocity += i_self.speed;
					}
					if (i_self.velocity > i_self.MAX_SPEED) {
						i_self.velocity = i_self.MAX_SPEED;
					}
					
					var i_oldDirection = i_self.direction;
					var s_lastkey = a_keys.slice(a_keys.length-1).pop();

					switch(s_lastkey) {
						case "a":
							i_self.direction = Direction.LEFT;
							break;
						case "d":
							i_self.direction = Direction.RIGHT;
							break;
						case "w":
							i_self.direction = Direction.UP;
							break;
						case "s":
							i_self.direction = Direction.DOWN;
							break;
					}
					if (i_self.oldDirection || i_oldDirection !== i_self.direction) {
						i_self.doAction();
						delete i_self.oldDirection;
					}

					a_keys.forEach(function(s_key){
						switch(s_key) {
							case "a":
								i_self.x -= i_self.velocity;
								break;
							case"d":
								i_self.x += i_self.velocity;
								break;
							case "w":
								i_self.y -= i_self.velocity;
								break;
							case "s":
								i_self.y += i_self.velocity;
								break;
						}
					});
				}
				else {
					i_self.velocity = 0;
				}
			}
			else {
				i_self.velocity = 0;
			}
		},
		draw: function() {

			var i_self = this;
			var i_canvas = document.getElementById('canvas');
			var i_context = i_canvas.getContext('2d');

			if (i_canvas.getContext) {
				
				var i_context = i_canvas.getContext('2d');
				var i_playerBounds = i_self.getBounds();

				i_self.bombs.forEach(function(i_bomb) {
					if (i_bomb.frame) {
						i_context.drawImage(
							i_bomb.sprite,
							i_bomb.frame.x,
							i_bomb.frame.y,
							i_bomb.width,
							i_bomb.height,
							i_bomb.x,
							i_bomb.y,
							i_bomb.scale.width,
							i_bomb.scale.height
						);

						if (i_bomb.passable) {
							var i_bombBounds = i_bomb.getBounds();
							var b_intersects = Game.intersects(i_playerBounds, i_bombBounds);
							if (!b_intersects) {
								i_bomb.passable = false;
							}
						}
						//i_context.fillStyle = 'rgba(0,151,203,0.5)';

						//i_context.fillRect(o_bounds.left, o_bounds.top, i_bomb.scale.width, i_bomb.scale.height);
					}
					i_bomb.flames.forEach(function(i_flame) {
						if (i_flame.frame) {
							var i_flameBounds = i_flame.getBounds();
							i_context.drawImage(
								i_flame.sprite,
								i_flame.frame.x,
								i_flame.frame.y,
								i_flame.width,
								i_flame.height,
								i_flame.x,
								i_flame.y,
								i_flame.scale.width,
								i_flame.scale.height
							);

							var o_bounds = i_flame.getBounds();
							i_context.fillStyle = 'rgba(0,151,203,0.5)';

							//debug for flames to see bounds...
							switch(i_flame.direction) {
								case Direction.LEFT:
									//i_context.fillRect(o_bounds.left, o_bounds.top, i_flame.scale.width, i_flame.scale.height - 32);
									break;
								case Direction.RIGHT:
									//i_context.fillRect(o_bounds.left, o_bounds.top, i_flame.scale.width, i_flame.scale.height - 32);
									break;
								case Direction.UP:
									//i_context.fillRect(o_bounds.left, o_bounds.top, i_flame.scale.width - 32, i_flame.scale.height);
									break;
								case Direction.DOWN:
									//i_context.fillRect(o_bounds.left, o_bounds.top, i_flame.scale.width - 32, i_flame.scale.height);
									break;
							}

							var b_intersects = Game.intersects(i_playerBounds, i_flameBounds);

							if (b_intersects && i_self.state != State.DYING) {
								i_self.doDie();
							}

							i_self.bombs.forEach(function(i_bomb) {
								if (i_bomb.flames.length == 0) {
									var i_bounds = i_bomb.getBounds();

									var b_intersects = Game.intersects(i_bounds, i_flameBounds);

									if (b_intersects) {
										i_bomb.triggerExplode(function() {
											i_self.bombs.shift();
										})
									}
								}
							})
						}
						
					});
					
				});

				i_context.drawImage(
					i_self.sprite,
					i_self.frame.x,
					i_self.frame.y,
					i_self.width,
					i_self.height,
					i_self.x,
					i_self.y,
					i_self.scale.width,
					i_self.scale.height
				);
				//debug;
				var o_bounds = i_self.getBounds();
				i_context.fillStyle = 'rgba(39,235,133,0.5)';

				i_context.fillRect(o_bounds.left, o_bounds.top, i_self.scale.width, i_self.scale.height -20);
			}
		}
	});

	Moveable.call(i_self, o_config);

	return i_self;
};

Player.prototype = Object.create(Moveable.prototype);
Player.prototype.constructor = Player