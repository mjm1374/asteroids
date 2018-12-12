 var asteroids = [],
 rocksLrg = ["M 26.087899,1.0434852 49.503787,26.009091 74.220561,2.6541843 96.335572,25.203747 85.278067,50.974686 98.286898,75.940275 62.512619,99.295186 26.087905,100.10053 0.7206885,77.55096 1.3711312,27.619771 Z", "M 27.46638,2.6445482 66.467442,0.98983643 99.048213,24.999426 V 35.822504 L 65.202598,51.325844 98.421452,73.55696 76.484471,97.835645 H 72.723845 L 60.501821,85.842551 27.596351,98.713169 0.95859607,63.02645 1.8987487,25.29194 H 36.997914 Z", "M 14.670645,48.844427 1.9670478,25.614646 27.37424,2.3848478 48.335078,12.875719 73.107033,1.6354928 97.878992,24.865291 75.012591,39.102909 97.878992,60.834007 75.012591,97.552066 39.442599,87.061197 26.739004,99.050766 1.3318868,75.820971 Z"];
 	xLimit = resetWindowLimit("x") - 1,
 	yLimit = resetWindowLimit("y") - 1,
 	//sqFt = (xLimit * yLimit),
 	mode = 'asteroids',
 	rockCnt = 10,
  spaceship = new Spaceship((xLimit/2), (yLimit/2),0,0,0,0,0,0), //(x,y,vx,vy,theta,yaw, x_points,y_points)
  colors = ['#edc951', '#eb6841', '#cc2a36', '#4f372d', '#00a0b0'];
 //console.log(sqFt);
 //Box( id, title, xcord, ycord, xvel, yvel, color, type, oob)
 //Make me some asteroids
 for (i = 0; i < rockCnt; i++) {
 	thisRockSize = Math.floor(getRandomFloat(50, 100));
 	thisRockSize = 100;
 	asteroids.push(new Asteroid(i, 'test', thisRockSize, thisRockSize, getRandomFloat(0, (xLimit - 150)), getRandomFloat(0, (yLimit - 150)), getRandomFloat(-5, 5), getRandomFloat(-5, 5), colors[Math.floor(getRandomFloat(0, 5))], 'generic', false));
 }


 function resetWindowLimit(whatDim) {

 	var newDim, newDimx, newDimy;
 	newDimx = window.innerHeight;
 	newDimy = window.innerHeight;


 	if (whatDim == "x") {
 		newDim = window.innerWidth;
 		for (i = 0; i < asteroids.length; i++) {
 			if (asteroids[i].xcord >= (newDimx - asteroids[i].width)) {
 				asteroids[i].changePosition((newDimx - asteroids[i].width), (newDimy - asteroids[i].height));
 			}
 		}

 	} else {
 		newDim = window.innerHeight;
 		for (i = 0; i < asteroids.length; i++) {
 			if (asteroids[i].ycord >= (newDimy - asteroids[i].height)) {
 				asteroids[i].changePosition((newDimx - asteroids[i].width), (newDim - asteroids[i].height));
 			}

 		}
 	}

 	return newDim;
 }

 function animateBoxes(obj) {
 	var asteroids = obj;

 	for (var key in asteroids) {
 		if (asteroids.hasOwnProperty(key)) {
 			var newVel;
 			//console.log("box: " + asteroids[key].xcord + " - " + asteroids[key].ycord);
 			//console.log("in vololation", asteroids[key].ycord >= yLimit, yLimit, asteroids[key].yvel );

 			asteroids[key].changePosition((asteroids[key].xcord + asteroids[key].xvel), (asteroids[key].ycord + asteroids[key].yvel));


 			if (mode == "asteroids") {
 				if (asteroids[key].xcord <= (0 - asteroids[key].width) || asteroids[key].xcord >= ((xLimit + asteroids[key].width))) {
 					//console.log(asteroids[key].id, asteroids[key].xcord);
 					if (asteroids[key].xcord >= (xLimit + asteroids[key].width)) {
 						asteroids[key].xcord = -Math.abs((0 - asteroids[key].width));
 					} else {
 						asteroids[key].xcord = xLimit + asteroids[key].width;
 					}
 				}

 				if (asteroids[key].ycord <= (0 - asteroids[key].width) || asteroids[key].ycord >= ((yLimit + asteroids[key].height))) {
 					//console.log(asteroids[key].id, asteroids[key].xcord);
 					if (asteroids[key].ycord >= (yLimit + asteroids[key].height)) {
 						asteroids[key].ycord = -Math.abs((0 - asteroids[key].height));
 					} else {
 						asteroids[key].ycord = yLimit + asteroids[key].height;
 					}
 				}

 			}




    //paint the screen
    $('#spaceship').css('left', spaceship.x).css('top', spaceship.y);

 			$('#rockAnim' + asteroids[key].id)
 				.css('left', asteroids[key].xcord).css('top', asteroids[key].ycord);
 		}

 	}


 }


 function getRandomFloat(min, max) {
 	return Math.random() * (max - min) + min;
 }

 //state
  var _this = this;
  this.thrust = 0; //1 = forward, -1 = backward
  this.turn = 0; //1 = right, -1 = left

  //params
  this.turn_per_milli = .1;
  this.thrust_per_milli = .00005;
  this.key_delay = 50;

  window.onkeydown = function(e) {
   var key = e.keyCode;
    switch(key){
      case 68://d = yaw left
        _this.turn = 1;
        console.log('left');
      break;
      case 65://a = yaw right
        _this.turn = -1;
        console.log('right');
      break;
      case 87://w = forward
        _this.thrust = 1;
        console.log('forward');
      break;
      case 83://s = backward
        _this.thrust = -1;
        console.log('backward');
      break;
     case 32://s = shoot
        //_this.thrust = -1;
        console.log('Pew, pew pew!');
      break;
    }
  };

  window.onkeyup = function(e) {
    var key = e.keyCode;
    switch(key){
      case 65://a = yaw left
        _this.turn = 0;
      break;
      case 68://d = yaw right
        _this.turn = 0;
      break;
      case 87://w = forward
        _this.thrust = 0;
      break;
      case 83://s = backward
        _this.thrust = 0;
      break;
    }
  };


 $( document ).ready(function() {

 	for (var key in asteroids) {

 		if (asteroids.hasOwnProperty(key)) {
 			$('body')
 				.append("<svg id='rockAnim" + asteroids[key].id + "' data-id='" + asteroids[key].id + "' class='clicker'><path cx='" + (asteroids[key].width) + "' cy='"+ (asteroids[key].height) + "' r='" + (asteroids[key].width /2 -5) + "' stroke='" + asteroids[key].color + "' stroke-width='2' d='" + rocksLrg[Math.floor(getRandomFloat(0, 3))] + "'  id='path81' /><text x='20' y='50' fill='" + asteroids[key].color + "'>" + asteroids[key].id + "</text></svg>");

                //.append("<svg id='rockAnim" + asteroids[key].id + "' data-id='" + asteroids[key].id + "' class='clicker'><image xlink:href='img/asteroid_lrg_" + Math.floor(getRandomFloat(1, 4)) + ".svg' x='10' y='25' height='100' width='100' cx='" + (asteroids[key].width) + "' cy='"+ (asteroids[key].height) + "' r='" + (asteroids[key].width /2 -5) + "' stroke='" + asteroids[key].color + "' stroke-width='2'><text x='20' y='50' fill='" + asteroids[key].color + "'>" + asteroids[key].id + "</text></svg>");
 			$('#rockAnim' + asteroids[key].id)
 				.css('color', asteroids[key].color).css('border-color', asteroids[key].color).css('width', asteroids[key].width).css('height', asteroids[key].height).addClass('rockAnim');
 			//$('#rockAnim'  + asteroids[key].id ).html('<span>' + asteroids[key].id  + '</span>');
 			//console.log(asteroids[key].color);
 		}
 	}

  //Add space ship
  $('body').append("<svg id='spaceship' class=''><path cx='50' cy='50' r='50' stroke='#ffffff' stroke-width='2' d='" + spaceship.shape + "'  id='outerSHip' /></svg>");



 	$('.cntrlButton').click(function() {
 		console.log($(this).data("mode"));

 		mode = $(this).data("mode");

 		if (mode == 'asteroids') {
 			for (var key in asteroids) {
 				if (asteroids[key].xcord <= 0 || asteroids[key].xcord >= (xLimit - asteroids[key].width) || asteroids[key].ycord <= 0 || asteroids[key].ycord >= (yLimit - asteroids[key].height)) {
 					asteroids[key].oob = true;
 				}
 			}
 		}

 		if (mode == 'gravity') {
 			for (var key in asteroids) {
 				asteroids[key].resetGravity();
 			}
 		}

 		if (mode == 'stop') {
    console.log("here");
 			clearInterval('startBubbletron');
 		}

 	});

 	// click on an obj
 	$('.clicker').click(function() {
 		var thisID = $(this).data("id");
 		console.log(asteroids[thisID].id + ": " + asteroids[thisID].xvel + " - " + asteroids[thisID].yvel);

 	});

 	//kick off animation
 	var startBubbletron = setInterval(function() {
 		animateBoxes(asteroids);
 	}, 20);




 });

 $(window).resize(function() {
 	xLimit = resetWindowLimit("x");
 	yLimit = resetWindowLimit("y");
 });