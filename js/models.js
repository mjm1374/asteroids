
class Asteroid {
    constructor(id, title, width, height, xcord, ycord, xvel, yvel, color, type, oob, points, exists) {
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
        this.exists = true;
        this.resetGravity = function () {
            // this.gravity =  0.05;
            // this.gravitySpeed = 0;
        };
        this.newPos = function () {
            this.gravitySpeed += this.gravity;
            this.x += this.xvel;
            var gavVel = this.yv;
            if (this.yv < 0) {
                gavVel = 0;
            }
            gavVel = 0;
            this.y += gavVel + this.gravitySpeed;
            this.hitBottom();
        };
        this.hitBottom = function () {
            //var rockbottom = window.screen.availHeight - this.height;
            var rockbottom = window.innerHeight - this.height;
            if (this.y > rockbottom) {
                this.x = rockbottom;
                this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            }
            if (this.x > (window.innerWidth + this.width)) {
                this.x = (0 - this.width);
            }
            if (this.x < (0 - this.width)) {
                this.x = (window.innerWidth + this.width);
            }
        };
        this.changeColor = function (color) {
            this.color = color;
        };
        this.oob = function (oob) {
            this.oob = oob;
        };
        this.changeVelocity = function (dir, speed) {
            if (dir == 'x') {
                this.xv = speed;
            }
            if (dir == 'y') {
                this.yv = speed;
            }
        };
        this.changePosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        this.getVelocity = function (direction) {
            return this.direction; // I should return the requested directional velocity
        };
        this.changeExistance = function (e) {
            this.exists = e;
        };

        this.destroy = function () {};
    }
}


class Spaceship {
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
        this.shape = "14.383032,5.9181762 0.35137621,0.04626516 2.7568063,5.9181762 0.35137621,11.338401";
        //this.x_points = [-params.size,-params.size,2*params.size],
        //this.y_points = [-params.size,params.size,0] 
        //this.destroy = function () {};
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
        this.changePosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
        this.changeLife = function (l) {
            this.life = l;
        };
    }
}



class Sound {
    constructor(src) {
        this.sound = document.createElement("audio");
        this.sound.src = src;
        this.sound.setAttribute("preload", "auto");
        this.sound.setAttribute("controls", "none");
        this.sound.style.display = "none";
        document.body.appendChild(this.sound);
        this.play = function () {
            this.sound.play();
        };
        this.stop = function () {
            this.sound.pause();
        };
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
        this.changePosition = function (x, y) {
            this.x = x;
            this.y = y;
        };
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
