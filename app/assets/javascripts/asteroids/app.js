$(function () {
	var canvas = $('<canvas width="500" height="500"></canvas>');
	$('#game').append(canvas);

	var ctx = canvas.get(0).getContext('2d');

	var game = new Asteroids.Game(ctx);
	game.start();

});
