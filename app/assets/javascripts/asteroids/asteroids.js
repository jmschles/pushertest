var Asteroids = (function () {

	// ------------------------------
	//   moving object
	// ------------------------------

	function MovingObject(x, y) {
		this.x = x;
		this.y = y;
		this.dx = 0;
		this.dy = 0;
	}

	MovingObject.prototype.update = function() {
		// console.log(this);
		this.x += this.dx;
		this.y += this.dy;
	};

	MovingObject.prototype.offScreen = function () {
		if (this.x > 500 || this.x < 0 || this.y < 0 || this.y > 500) {
			return true;
		}
		return false;
	};

	// ------------------------------
	//   asteroid
	// ------------------------------

	function Asteroid(x, y) {
		MovingObject.apply(this, arguments);
		this.radius = Math.random() * 5 + 25;
		this.dx = Math.random() * 5 - 2.5; // -2.5 - 2.5
		this.dy = Math.random() * 5 - 2.5; // -2.5 - 2.5
	}

	Asteroid.prototype = new MovingObject();

	Asteroid.prototype.draw = function(ctx) {
		ctx.fillStyle = "black";
		ctx.beginPath();

		ctx.arc(
			this.x,
			this.y,
			// 25,
			this.radius,
			0,
			2 * Math.PI,
			false
		);

		ctx.fill();
	};

	// ------------------------------
	//   ship
	// ------------------------------

	function Ship() {
		MovingObject.apply(this, arguments);
		this.x = 250;
		this.y = 250;
		this.radius = 12;
		this.dx = 0;
		this.dy = 0;

		this.angle = 0;
		this.start_angle = Math.PI - 0.75;
		this.end_angle = 2 * Math.PI + 0.75;
		this.forward = (this.start_angle + this.end_angle) / 2;
	}

	Ship.prototype = new MovingObject();

	Ship.prototype.draw = function (ctx) {

		// circle ship
		ctx.fillStyle = '#00AD0E';
		ctx.strokeStyle = '#007D0A';
		ctx.lineWidth = 1.5;
		ctx.beginPath();

		// full circle
		// ------------
		// ctx.arc(
		// 	this.x,
		// 	this.y,
		// 	this.radius,
		// 	0,
		// 	2 * Math.PI,
		// 	false
		// );

		// semi-circle ship
		// ------------
		ctx.arc(
			this.x,
			this.y,
			this.radius,
			this.start_angle,
			this.end_angle,
			false
		);

		// ---------------
		ctx.fill();
		ctx.stroke();
		ctx.closePath();

	};

	Ship.prototype.fireBullet = function() {
		var bullet = new Bullet(this);
		return bullet;
	};

	// ------------------------------
	//   bullet
	// ------------------------------

	function Bullet(ship) {
		MovingObject.apply(this, arguments);
		// this.ship = this;
		this.x = ship.x;
		this.y = ship.y;
		this.radius = 3;
		this.dx = Math.cos(ship.forward) * 10; //ship.dx / 1000 + 15;
		this.dy = Math.sin(ship.forward) * 10; //ship.dy / 1000 + 15;

		// bullet vector adjuster
		// this.bulletHelper();
	}

	Bullet.prototype = new MovingObject();

	Bullet.prototype.draw = function (ctx) {
		ctx.fillStyle = "blue";
		ctx.beginPath();

		ctx.arc(
			this.x,
			this.y,
			this.radius,
			0,
			2 * Math.PI,
			false
		);

		ctx.fill();
	};

	Bullet.prototype.bulletHelper = function () {
		if (this.dx <= 0) {
			this.dx = -15;
		}

	};

	// ------------------------------
	//   game
	// ------------------------------

	function Game(ctx) {
		this.ctx = ctx;
		this.asteroids = [];
		this.bullets = [];
		this.ship = new Ship();
		this.gameover = false;

		// generate asteroids
		for (var i = 0; i < 10; i++) {
			this.asteroids.push(this.randomAsteroid());
		}
	}

	Game.prototype.shipIsHit = function() {
		var ship_pos = [this.ship.x, this.ship.y];
		for (var i = 0, n = this.asteroids.length; i < n; i++) {
			var asteroid = this.asteroids[i];
			var asteroid_pos = [asteroid.x, asteroid.y];
			var dx = ship_pos[0] - asteroid_pos[0];
			var dy = ship_pos[1] - asteroid_pos[1];
			if (Math.pow((Math.pow(dx, 2) + Math.pow(dy, 2)), 0.5) < (asteroid.radius + this.ship.radius)) {
				this.gameover = true;
				return true;
			}
		}
		return false;
	};

	Game.prototype.asteroidIsHit = function(asteroid) {
		for (var i = 0; i < this.bullets.length; i++) {
			var bullet = this.bullets[i];
			var bullet_x = bullet.x;
			var bullet_y = bullet.y;
			var dx = asteroid.x - bullet_x;
			var dy = asteroid.y - bullet_y;
			if (Math.pow((Math.pow(dx, 2) + Math.pow(dy, 2)), 0.5) < (asteroid.radius + bullet.radius)) {
				this.bullets.splice(i, 1);
				console.log("Asteroid obliterated!");
				return true;
			}
		}
		return false;
	}

	Game.prototype.randomAsteroid = function () {
		var x = this.generateCoord();
		var y = this.generateCoord();
		return new Asteroid(x, y);
	};

	Game.prototype.generateCoord = function() {
		var coord = Math.random() * 600 - 50;
		while (coord > -25 && coord < 525) {
			coord = Math.random() * 600 - 50;
		}
		return coord;
	}

	Game.prototype.wrapShip = function() {
		var x = this.ship.x;
		var y = this.ship.y;
		if (x < 0) {
			this.ship.x = 500;
		}
		if (x > 500) {
			this.ship.x = 0;
		}
		if (y < 0) {
			this.ship.y = 500;
		}
		if (y > 500) {
			this.ship.y = 0;
		}
	}

	Game.prototype.update = function () {
		// update ship
		this.wrapShip();
		this.ship.update();

		for (var i = 0; i < this.asteroids.length; i++) {
			var asteroid = this.asteroids[i];
			asteroid.update();
			if (asteroid.x > 550 || asteroid.x < -50 || asteroid.y < -50 || asteroid.y > 550) {
				this.asteroids[i] = this.randomAsteroid();
			}
			if (this.asteroidIsHit(asteroid)) {
				console.log("Asteroid hit");
				if (asteroid.radius >= 19) {
					var asteroid1 = new Asteroid(asteroid.x, asteroid.y);
					var asteroid2 = new Asteroid(asteroid.x, asteroid.y);

					asteroid1.radius = asteroid.radius - 10;
					asteroid2.radius = asteroid.radius - 10;

					this.asteroids.push(asteroid1);
					this.asteroids.push(asteroid2);
				}
				this.asteroids.splice(i, 1);
			}
		}

		// update bullets
		for (var j = 0; j < this.bullets.length; j++) {
			var bullet = this.bullets[j];
			if (bullet.x > 550 || bullet.x < -50 || bullet.y < -50 || bullet.y > 550) {
				this.bullets.splice(j, 1);
			}
			bullet.update();
		}
	};

	Game.prototype.draw = function () {
		this.ctx.clearRect(0, 0, 500, 500);

		if (this.gameover) {
			this.ctx.fillStyle = '#f00';
			this.ctx.fillRect(0, 0, 500, 500);
		}

		for (var i = 0, n = this.asteroids.length; i < n; i++) {
			this.asteroids[i].draw(this.ctx);
		}

		for (var j = 0, m = this.bullets.length; j < m; j++) {
			this.bullets[j].draw(this.ctx);
		}

		this.ship.draw(this.ctx);
	};

	Game.prototype.gameOver = function (intervalId) {
		this.draw();
		clearInterval(intervalId);
	}

	Game.prototype.start = function (ctx) {
		var that = this;

		document.addEventListener("keydown", function (e) {
	    switch (e.charCode || e.keyCode) {

				// space
				case 32:
					that.bullets.push(that.ship.fireBullet());
					break;

				// left
				case 37:
					that.ship.start_angle -= .25;
					that.ship.end_angle -= .25;
					that.ship.forward = (that.ship.start_angle + that.ship.end_angle) / 2;
					break;


				// right
				case 39:
					that.ship.start_angle += .25;
					that.ship.end_angle += .25;
					that.ship.forward = (that.ship.start_angle + that.ship.end_angle) / 2;
					break;

				// up
	      case 38:
					// TODO: consider adding speed limit
					that.ship.dy += Math.sin(that.ship.forward);
					that.ship.dx += Math.cos(that.ship.forward);
					break;

				// down
	      case 40:
					break;
	    }
		});

		var intervalId = window.setInterval(function () {
			that.update();
			that.draw(ctx);
			if (that.shipIsHit()) {
				that.gameOver(intervalId);
			}
		}, 35);
	};

	return {
		Game: Game
	};

})();
