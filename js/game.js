"use strict;"

var cvs = document.getElementById("canvas");
var ctx = cvs.getContext("2d");

var currentLevel = 0;
var target = [1, 1, 2];

var player, obstacles, coins;

var canvas_width = 800;
var canvas_height = 800;
var fps = 60;

var then, now, elapsed, fpsInterval;

cvs.width = canvas_width;
cvs.height = canvas_height;

var setLevel = function(lvl) {
	if(lvl === 0) {
		player = {
			x : 0,
			y : 0,
			width : 32,
			height : 64,
			xVelocity : 0,
			yVelocity : 0,
			jump : true,
			xPrev : 0,
			yPrev : 0,
			coin : 0,
		};

		obstacles = [
			{
				x : 100,
				y : 700,
				width : 200,
				height : 20,
			},

			{
				x : 350,
				y : 550,
				width : 200,
				height : 20,
			},

			{
				x : 100,
				y : 400,
				width : 200,
				height : 20,
			}
		];

		coins = [
			{
				x : 150,
				y : 375,
				width : 25,
				height : 25,
			}
		]
	};

	if(lvl === 1) {
		player = {
			x : 0,
			y : 0,
			width : 32,
			height : 64,
			xVelocity : 0,
			yVelocity : 0,
			jump : true,
			xPrev : 0,
			yPrev : 0,
			coin : 0,
		};

		obstacles = [
			{
				x : 300,
				y : 690,
				width : 100,
				height : 20,
			},

			{
				x : 420,
				y : 540,
				width : 100,
				height : 20,
			},

			{
				x : 110,
				y : 430,
				width : 100,
				height : 20,
			}
		];

		coins = [
			{
				x : 110,
				y : 405,
				width : 25,
				height : 25,
			}
		]
	};

	if(lvl === 2) {
		player = {
			x : 0,
			y : 0,
			width : 32,
			height : 64,
			xVelocity : 0,
			yVelocity : 0,
			jump : true,
			xPrev : 0,
			yPrev : 0,
			coin : 0,
		};

		obstacles = [
			{
				x : 400,
				y : 650,
				width : 50,
				height : 20,
			},

			{
				x : 450,
				y : 500,
				width : 50,
				height : 20,
			},

			{
				x : 390,
				y : 350,
				width : 50,
				height : 20,
			},

			{
				x : 210,
				y : 200,
				width : 50,
				height : 20,
			},

			{
				x : 70,
				y : 220,
				width : 50,
				height : 20,
			},

			{
				x : 550,
				y : 200,
				width : 50,
				height : 20,
			},
		];

		coins = [
			{
				x : 82,
				y : 195,
				width : 25,
				height : 25,
			},

			{
				x : 562,
				y : 175,
				width : 25,
				height : 25,
			},
		]
	};

	if(lvl === 3) {
		alert("Вы победили! Сидите дома и отдыхайте!");
	};
}

var controller = {
	left : false,
	right : false,
	up : false,
	keyListener : function(event) {
		var keyState = (event.type == "keydown") ? true : false;
		switch(event.keyCode) {
			case 37:
				controller.left = keyState;
				break;
			case 38:
				controller.up = keyState;
				break;
			case 39:
				controller.right = keyState;
				break;
		}
	}
}

var startAnimation = function(fps) {
	setLevel(currentLevel);
	fpsInterval = 1000 / fps;
	then = window.performance.now();
	animation(then);
}

var animation = function(newTime) {
	window.requestAnimationFrame(animation);
	now = newTime;
	elapsed = now - then;
	if(elapsed > fpsInterval) {
		then = now - (elapsed % fpsInterval);
		update();
		draw();
	}
}

var isCollided = function(obst, obj) {
	if(obj.x + obj.width > obst.x
		&& obj.x < obst.x + obst.width
		&& obj.y < obst.y + obst.height
		&& obj.y + obj.height > obst.y) {
		return true;
	} else {
		return false;
	}
}

var collideHandler = function(obst, obj) {
	if (isCollided(obst, obj)) {
		if(obj.xPrev >= obst.x + obst.width) {
			obj.x = obst.x + obst.width;
			obj.xVelocity = 0;
		}
		if(obj.xPrev + obj.width <= obst.x) {
			obj.x = obst.x - obj.width;
			obj.xVelocity = 0;
		}
		if(obj.yPrev + obj.height <= obst.y) {
			obj.y = obst.y - obj.height;
			obj.yVelocity = 0;
			obj.jump = false;
		}
		if(obj.yPrev + obj.height >= obst.y + obst.height) {
			obj.y = obst.y + obst.height;
			obj.yVelocity = 0;
		}
	}
}

var coinHandler = function(coin, obj) {
	if(isCollided(coin, obj)) {
		player.coin += 1;
		coin.x = -25;
	}
}

var update = function() {
	player.xPrev = player.x;
	player.yPrev = player.y;

	if(controller.up && player.jump === false) {
		player.yVelocity -= 30;
		player.jump = true;
	}

	if(controller.left) {
		player.xVelocity -= 1;
	}

	if(controller.right) {
		player.xVelocity += 1;
	}

	player.yVelocity += 1;
	player.x += player.xVelocity;
	player.y += player.yVelocity;
	player.xVelocity *= 0.9;
	player.yVelocity *= 0.9;

	if(player.x < 0) {
		player.x = 0;
	}

	if(player.x > canvas_width - player.width) {
		player.x = canvas_width - player.width;
	}

	if(player.y > canvas_height - player.height) {
		player.y = canvas_height - player.height;
		player.yVelocity = 0;
		player.jump = false;
	}

	for(let i=0; i < obstacles.length; i++) {
		collideHandler(obstacles[i], player);
	}

	for(let i=0; i < coins.length; i++) {
		coinHandler(coins[i], player);
	}

	if(target[currentLevel] === player.coin) {
		currentLevel += 1;
		setLevel(currentLevel);
	}

}

var drawObject = function(obj, style) {
	ctx.fillStyle = style;
	ctx.fillRect(obj.x, obj.y, obj.width, obj.height);
}

var draw = function() {
	//фон
	ctx.fillStyle = "white";
	ctx.fillRect(0, 0, canvas_width, canvas_height);

	//игрок
	drawObject(player, "black");

	//препятствия (obstacles)
	for(let i=0; i<obstacles.length; i++) {
		drawObject(obstacles[i], "green");
	}

	//coins
	for(let i=0; i<coins.length; i++) {
		drawObject(coins[i], "yellow");
	}

	//Кол-во монеток
	ctx.fillStyle = "pink";
	ctx.font = "bold 30px Arial";
	ctx.fillText(player.coin, 20, 50)
};

startAnimation(fps);

window.addEventListener("keydown", controller.keyListener);
window.addEventListener("keyup", controller.keyListener);