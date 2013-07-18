$(function() {
	var $cont = $('#container');
	_(200).times(function (i) {
		var $div = $("<div></div>");
		$div.attr('id', i);
		$cont.append($div);
	});
});

$(function() {

	// set up mapping of coordinates to divs

	function makeDivMap() {
		var $squares = $('#container div');
		var divMap = {};
		var x = 0;
		var y = 0;

		$.each($squares, function(idx, el) {
			divMap[x+","+y] = $(el);
			x += 1;
			if (x === 20) {
				x = 0;
				y += 1;
			}
		});
		return divMap;
	}

	// loop through divs, render worm and apple

	function render(game, divMap) {
		var keys = _.keys(divMap);
		var body = game.board.snake.body;
		$.each(keys, function(idx, el) {
			divMap[el].removeClass('snake');
			if (body.indexOf(el) !== -1) {
				divMap[el].removeClass("apple");
				divMap[el].addClass("snake");
			} else if (el === game.board.apple) {
				divMap[el].addClass("apple");
			} else {
				divMap[el].removeAttr('class');
			}
		});
	}

	var game = new Snake.Game;

	STEP_TIME = 100;
	var divMap = makeDivMap();
	var intervalID = window.setInterval(function() {

		$('html').keydown(function (event) {
			switch (event.keyCode) {
				case 37:
					game.board.snake.turn("east");
					break;
				case 39:
					game.board.snake.turn("west");
					break;
				case 38:
					game.board.snake.turn("north");
					break;
				case 40:
					game.board.snake.turn("south");
					break;
			}
		});


		game.board.step();
		render(game, divMap);
		if (game.gameOver()) {
			console.log("You lose");
			clearInterval(intervalID);
		}
	}, STEP_TIME);	


});








