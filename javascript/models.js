// Constructor function for Person objects
    function Asteroid( id, title, width, height, xcord, ycord, xvel, yvel, color, type, oob) {
        this.id = id;
        this.title = title;
        this.width = width;
        this.height = height;
        this.xcord = xcord;
        this.ycord = ycord;
        this.xvel = xvel;
        this.yvel = yvel;
        this.color = color;
        this.type = type;
        this.oob = oob; // Out of bounds
        this.gravity = 0.1;
        this.gravitySpeed = 0;
        this.bounce = 0.4;

        this.resetGravity = function(){
           // this.gravity =  0.05;
           // this.gravitySpeed = 0;

        };

        this.newPos = function() {
            this.gravitySpeed += this.gravity;
            this.xcord += this.xvel;
            var gavVel = this.yvel;
            if(this.yvel < 0){
                gavVel = 0;
                }
                gavVel = 0;
            this.ycord += gavVel + this.gravitySpeed;
            this.hitBottom();
        };

        this.hitBottom = function() {
            //var rockbottom = window.screen.availHeight - this.height;
            var rockbottom = window.innerHeight - this.height;
            if (this.ycord > rockbottom) {
                this.ycord = rockbottom;
                this.gravitySpeed = -(this.gravitySpeed * this.bounce);
            };

            if (this.xcord > (window.innerWidth + this.width)){
                this.xcord = (0 - this.width);

            };

            if (this.xcord < (0 - this.width)){
                this.xcord = (window.innerWidth + this.width);

            };
        };

        this.changeColor = function (color) {
            this.color = color;
        };

        this.oob = function (oob) {
            this.oob = oob;
        };

        this.changeVelocity = function (dir,speed) {

            if(dir == 'x'){
                this.xvel = speed;
            }
            if(dir == 'y'){
                this.yvel = speed;
            }
        };

        this.changePosition = function (x,y) {
                this.xcord = x;
                this.ycord = y;
        };


        this.getVelocity = function (direction) {
          return this.direction; // I should return the requested directional velocity

        };

    }


     function Spaceship(x,y,vx,vy,theta,yaw, x_points,y_points){

            this.x = x;
            this.y = y;
            this.vx = vx;
            this.vy = vy;
            this.theta = theta;
            this.yaw = yaw;
            this. x_points = x_points;
            this. y_points = y_points;
            this.shape ="M 6.0055459,0.26400664 0.13363476,14.295661 l 5.87191114,-2.40543 5.4202261,2.40543 z";
            //this.x_points = [-params.size,-params.size,2*params.size],
            //this.y_points = [-params.size,params.size,0]
          }
