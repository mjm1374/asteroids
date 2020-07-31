class Asteroid {
	static colors = ['#edc951', '#eb6841', '#cc2a36', '#4f372d', '#00a0b0'];
	static rocksLrg = [
		'26.087899,1.0434852 49.503787,26.009091 74.220561,2.6541843 96.335572,25.203747 85.278067,50.974686 98.286898,75.940275 62.512619,99.295186 26.087905,100.10053 0.7206885,77.55096 1.3711312,27.619771',
		'27.46638,2.6445482 66.467442,0.98983643 99.048213,24.999426 V 35.822504 L 65.202598,51.325844 98.421452,73.55696 76.484471,97.835645 H 72.723845 L 60.501821,85.842551 27.596351,98.713169 0.95859607,63.02645 1.8987487,25.29194 H 36.997914',
		'14.670645,48.844427 1.9670478,25.614646 27.37424,2.3848478 48.335078,12.875719 73.107033,1.6354928 97.878992,24.865291 75.012591,39.102909 97.878992,60.834007 75.012591,97.552066 39.442599,87.061197 26.739004,99.050766 1.3318868,75.820971',
	];

	constructor(
		id,
		title,
		width,
		height,
		xcord,
		ycord,
		xvel,
		yvel,
		color,
		type,
		oob,
		points
	) {
		this.id = id;
		this.title = title;
		this.width = width;
		this.height = height;
		this.x = xcord;
		this.y = ycord;
		this.xv = xvel;
		this.yv = yvel;
		this.color = color;
		this.type = type;
		this.oob = oob; // Out of bounds
		this.points = points;
		this.gravity = 0.1;
		this.gravitySpeed = 0;
		this.bounce = 0.4;
	}

	resetGravity() {
		// this.gravity =  0.05;
		// this.gravitySpeed = 0;
	}

	newPos() {
		this.gravitySpeed += this.gravity;
		this.x += this.xvel;
		var gavVel = this.yv;
		if (this.yv < 0) {
			gavVel = 0;
		}
		gavVel = 0;
		this.y += gavVel + this.gravitySpeed;
		this.hitBottom();
	}

	hitBottom() {
		//var rockbottom = window.screen.availHeight - this.height;
		var rockbottom = window.innerHeight - this.height;
		if (this.y > rockbottom) {
			this.x = rockbottom;
			this.gravitySpeed = -(this.gravitySpeed * this.bounce);
		}
		if (this.x > window.innerWidth + this.width) {
			this.x = 0 - this.width;
		}
		if (this.x < 0 - this.width) {
			this.x = window.innerWidth + this.width;
		}
	};

	changeColor(color) {
		this.color = color;
	}

	oob(oob) {
		this.oob = oob;
	}

	changeVelocity(dir, speed) {
		if (dir == 'x') {
			this.xv = speed;
		}
		if (dir == 'y') {
			this.yv = speed;
		}
	}

	changePosition(x, y) {
		this.x = x;
		this.y = y;
	}

	getVelocity(direction) {
		return this.direction; // I should return the requested directional velocity
	}

	changeExistance(e) {
		this.exists = e;
	}
}

class Spaceship {
	static shape = '14.383032,5.9181762 0.35137621,0.04626516 2.7568063,5.9181762 0.35137621,11.338401';

	constructor(x, y, vx, vy, theta, yaw, x_points, y_points) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.theta = theta;
		this.width = 20;
		this.height = 15;
		this.yaw = yaw;
		this.x_points = x_points;
		this.y_points = y_points;
		this.shape = Spaceship.shape;
	}
}

class Shot {
	constructor(id, x, y, vx, vy, theta, yaw, life, x_points, y_points) {
		this.id = id;
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.theta = theta;
		this.width = 6;
		this.height = 6;
		this.yaw = yaw;
		this.life = life;
		this.x_points = x_points;
		this.y_points = y_points;
	}

	changePosition(x, y) {
		this.x = x;
		this.y = y;
	}

	changeLife(l) {
		this.life = l;
	};
}

class Sound {
	constructor(src) {
		this.sound = document.createElement('audio');
		this.sound.src = src;
		this.sound.setAttribute('preload', 'auto');
		this.sound.setAttribute('controls', 'none');
		this.sound.style.display = 'none';
		document.body.appendChild(this.sound);
	}

	play() {
		this.sound.play();
	}

	stop() {
		this.sound.pause();
	}
}

class Ufo {
	constructor(x, y, vx, vy, theta, yaw, points) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
		this.theta = theta;
		this.width = 52;
		this.height = 42;
		this.yaw = yaw;
		this.points = points;
	}

	changePosition(x, y) {
		this.x = x;
		this.y = y;
	}
}

class SpawnBox {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.width = 100;
		this.height = 100;
	}
}