Snake = (function() {
	function Snake(startRow, startCol) {
		var that = this;

		this.body = [];
		this.size = 3;
		this.dir = "east";

		// generate snake
		_(this.size).times(function (n) {
			that.body[n] = ((startCol + n) + "," + (startRow));
		});
	}


	Snake.prototype.turn = function (dir) {
		if (this.dir === dir) {
			return;
		}
		switch (dir) {
			case "north":
				if (this.dir !== "south") {
					this.dir = dir;
				}
				break;
			case "south":
				if (this.dir !== "north") {
					this.dir = dir;
				}
				break;
			case "east":
				if (this.dir !== "west") {
					this.dir = dir;
				}
				break;
			case "west":
				if (this.dir !== "east") {
					this.dir = dir;
				}
				break;
			default:
				console.log("Unrecognized direction");
		}
	}

	function Board(numRows, numCols) {
		var that = this;
		this.dimensions = [numCols, numRows];
		this.snake = new Snake(parseInt(numRows / 2), Math.floor(numCols / 2));

		this.grid = [];
		this.apple = null;

		// generate grid
		_(numRows).times(function (r) {
			that.grid[r] = [];
			_(numCols).times(function (c) {
				that.grid[r][c] = null;
			});
		});

		// place an apple
		this.generateApple();

	}

	Board.prototype.step = function () {

		var head = this.snake.body[0];
		var head_arr = head.split(",");
		var x = parseInt(head_arr[0]);
		var y = parseInt(head_arr[1]);
		switch (this.snake.dir) {
			case "north":
				this.snake.body.unshift(x + "," + (y - 1));
				break;
			case "south":
				this.snake.body.unshift(x + "," + (y + 1));
				break;
			case "east":
				this.snake.body.unshift((x - 1) + "," + y);
				break;
			case "west":
				this.snake.body.unshift((x + 1) + "," + y);
				break;
			default:
				console.log("Step failed");
		}
		if (this.snake.body[0] !== this.apple) {
			this.snake.body.pop();
		} else {
			this.generateApple();
		}
	}

	Board.prototype.generateApple = function() {
		xCoord = Math.floor(Math.random() * this.dimensions[0]);
		yCoord = Math.floor(Math.random() * this.dimensions[1]);
		while (this.snake.body.indexOf(xCoord + "," + yCoord) !== -1) {
			xCoord = Math.floor(Math.random() * this.dimensions[0]);
			yCoord = Math.floor(Math.random() * this.dimensions[1]);
		}
		this.apple = xCoord + "," + yCoord;
	}

	function Game() {
		this.board = new Board(10, 20);
	}

	Game.prototype.run = function() {
		this.board.step();
		if (this.gameOver()) {
			console.log("You lose");
			return;
		}
	}

	Game.prototype.gameOver = function() {
		var body = this.board.snake.body;
		for (var i = 0, n = body.length; i < n; i++) {
			var coordArray = body[i].split(",");
			var x = parseInt(coordArray[0]);
			var y = parseInt(coordArray[1]);
			if (x < 0 || x > 19 || y < 0 || y > 9) {
				return true;
			}
			copied_body = body.slice();
			copied_body.sort();
			for (var j = 0, m = copied_body.length - 1; j < m; j++) {
				if (copied_body[j] === copied_body[j+1]) {
					return true;
				}
			}
		}
		return false
	}

	return {
		Game: Game
	};
})();

