//initialize the environment
var asteroids = [],
 shots = [],
 shotCnt = 0,
	spaceship = new Spaceship((xLimit / 2), (yLimit / 2), 0, 0, 0, 0, 0, 0), //Spaceship(x,y,vx,vy,theta,yaw, x_points,y_points)
	colors = ['#edc951', '#eb6841', '#cc2a36', '#4f372d', '#00a0b0'],
	rocksLrg = ["26.087899,1.0434852 49.503787,26.009091 74.220561,2.6541843 96.335572,25.203747 85.278067,50.974686 98.286898,75.940275 62.512619,99.295186 26.087905,100.10053 0.7206885,77.55096 1.3711312,27.619771", "27.46638,2.6445482 66.467442,0.98983643 99.048213,24.999426 V 35.822504 L 65.202598,51.325844 98.421452,73.55696 76.484471,97.835645 H 72.723845 L 60.501821,85.842551 27.596351,98.713169 0.95859607,63.02645 1.8987487,25.29194 H 36.997914", "14.670645,48.844427 1.9670478,25.614646 27.37424,2.3848478 48.335078,12.875719 73.107033,1.6354928 97.878992,24.865291 75.012591,39.102909 97.878992,60.834007 75.012591,97.552066 39.442599,87.061197 26.739004,99.050766 1.3318868,75.820971"],
 xLimit = resetWindowLimit("x") - 1,
	yLimit = resetWindowLimit("y") - 1,
	lifeCnt = 3,
	jumpCnt = 3,
	score = 0,
 resetGun = true,
	inPlay = false,
	mode = 'asteroids',
	rockCnt = 1,
	delta_time = 20,
	turn = 0,
	thrust = 0,
	turn_per_milli = .1,
	thrust_per_milli = .00015,
	key_delay = 50,
	del_v = 0,
	del_vx = 0,
	del_vy = 0;



//Asteroid( id, title, x, y, xv, yv, color, type, oob)
//Make me some asteroids




// MAIN ANIMATION LOOP -----------------------------------------------------------------------------------------

function animateScreen(obj, shots) {
	var asteroids = obj;
 var shots = shots;
console.log("inplay", inPlay);
//console.log($("#welcomeModel").data('bs.modal'));
	//need to move when we build scoring functions
	$('#scoreCnt span').html(score);

	for (var key in asteroids) {

  if (asteroids.hasOwnProperty(key)) {
			var newVel;

			asteroids[key].changePosition((asteroids[key].x + asteroids[key].xv), (asteroids[key].y + asteroids[key].yv));

			if (mode == "asteroids") {
				if (asteroids[key].x <= (0 - asteroids[key].width) || asteroids[key].x >= ((xLimit + asteroids[key].width))) {
					if (asteroids[key].x >= (xLimit + asteroids[key].width)) {
						asteroids[key].x = -Math.abs((0 - asteroids[key].width));
					} else {
						asteroids[key].x = xLimit + asteroids[key].width;
					}
				}

				if (asteroids[key].y <= (0 - asteroids[key].width) || asteroids[key].y >= ((yLimit + asteroids[key].height))) {
					if (asteroids[key].y >= (yLimit + asteroids[key].height)) {
						asteroids[key].y = -Math.abs((0 - asteroids[key].height));
					} else {
						asteroids[key].y = yLimit + asteroids[key].height;
					}
				}
			}

   // cheeck for collision
   if(inPlay == true){
    if(inCollision(asteroids[key])){

     boom();
     //checkPathTouch(asteroids[key]);

   }
   }

		}

  for (var idx in shots) {
  var thisVX = (Math.cos(shots[idx].theta * Math.PI/180) * 10 + shots[idx].x);
  var thisVY = (Math.sin(shots[idx].theta * Math.PI/180) * 10 + shots[idx].y);
// console.log(shots[idx].theta,thisVX,thisVY);
 var thisLife = shots[idx].life - 20;

 shots[idx].changeLife(thisLife);
 if(shots[idx].life < 0){
  $('#shot' + shots[idx].id).remove();
  shots.splice(0,1);
 }



   //shots[idx].changePosition((shots[idx].x + (shots[idx].vx )), (shots[idx].y + (shots[idx].vy)));
   shots[idx].changePosition(thisVX,thisVY);
   //console.log(idx, shots[idx].vx, shots[idx].vy);
   $('#shot' + shots[idx].id).css('left', shots[idx].x).css('top', shots[idx].y); // paint the shot

  }

		$('#rockAnim' + asteroids[key].id).css('left', asteroids[key].x).css('top', asteroids[key].y); // paint the rocks


	} //end asteroids


	//spaceship controls || Speed & thrust
	function moveSpaceship(delta_time) {
  //console.log("theata:" + spaceship.theta + " - Yaw: " + spaceship.yaw );

		var deg2rad = Math.PI / 180;
		if (turn != 0 && turn != undefined) {
			spaceship.theta = spaceship.theta + turn * turn_per_milli * delta_time;
			if (lifeCnt > 0) {
				$('#sndTurn').get(0).play();
			}

		} else {
			$('#sndTurn').get(0).pause();
			$('#sndTurn').get(0).currentTime = 0;
		}
		if (thrust != 0 && thrust != undefined) {
			//console.log("thrusting");
			del_v = thrust * thrust_per_milli * delta_time;
			del_vx = del_v * Math.cos(spaceship.theta * deg2rad);
			del_vy = del_v * Math.sin(spaceship.theta * deg2rad);

			if (lifeCnt > 0) {
				$('#sndPlayer').get(0).play();
			}
		} else {
			del_vx = 0;
			del_vy = 0;

			$('#sndPlayer').get(0).pause();
			$('#sndPlayer').get(0).currentTime = 0;
		}
		spaceship.vx = spaceship.vx + del_vx;
		spaceship.vy = spaceship.vy + del_vy;
		//console.log(spaceship.vx, spaceship.vy); - this is the speed issue, need to limit


	}

	//this will turn and adjust the spaceship
	function updateSpaceship(delta_time) {

		if (spaceship.x >= xLimit) {
			spaceship.x = 0;
		}
		if (spaceship.x < 0) {
			spaceship.x = xLimit;
		}
		if (spaceship.y >= yLimit) {
			spaceship.y = 0;
		}
		if (spaceship.y < 0) {
			spaceship.y = yLimit;
		}

		spaceship.theta += spaceship.yaw * delta_time;
		spaceship.x += spaceship.vx * delta_time;
		spaceship.y += spaceship.vy * delta_time;

		$('#spaceship').css('left', spaceship.x).css('top', spaceship.y).css({'transform': 'rotate(' + spaceship.theta + 'deg)'}); // Paint the spaceship

	}


	moveSpaceship(delta_time);
	updateSpaceship(delta_time);

}



// Utility functions  ----------------------------------------------------------------------------


function inCollision(obj){
 var a = spaceship;
 var b = obj;


// console.log(
//    document.getElementById( 'astroPath' + b.id).getTotalLength()
//    //getPointAtLength(distance)
//);

 return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );

}
//this does not work with different svg's
function checkPathTouch(obj){
 var a = spaceship;
 var b = obj;
 var shape1 = [];
 var shape2 = [];

 for (i=0; i < a.getTotalLength(); i = i + 1){
    shape1.push(a.getPointAtLength(i));
     //console.log(myElem1.getPointAtLength(i));
 }

 for (i=0; i < b.getTotalLength(); i = i + 1){
     shape2.push(b.getPointAtLength(i));
     //console.log(myElem1.getPointAtLength(i));
 }

 for (i=0; i < shape1.length; i++){
    var testx = Math.floor(shape1[i].x);
    var testy = Math.floor(shape1[i].y);
    for (j=0; j < shape2.length; j++){
        //console.log("x:" + testx);
        if(testx == Math.floor(shape2[j].x) && testy  == Math.floor(shape2[j].y) ){
            console.log( Math.floor(shape2[j].x) + "- " +  Math.floor(shape2[j].y));
            boom();
            break;
        }

    }

 }
}



//you died!
function boom() {
 $('#spaceship').hide();
 inPlay = false;

 $('#sndBoom').get(0).play();

	if (lifeCnt > 0) {
		lifeCnt--;
		$('#lifeCnt span').html(lifeCnt);
		jumpCnt = 3;
		$('#HSCnt span').html(jumpCnt);
  setTimeout(function(){ resetSpaceship(); }, 3000);

	}

}

function resetSpaceship() {
	if (lifeCnt > 0) {
  $('#spaceship').show();
		spaceship = new Spaceship((xLimit / 2), (yLimit / 2), 0, 0, 0, 0, 0, 0);
  inPlay = true;
	} else {
  inPlay = false;
		$('#spaceship').hide();
		$('#gameOverBoard').css('display', 'block');
	}

}

// Traveling through hyperspace ain't like dusting crops, boy! Without precise calculations we could fly right through a star or bounce too close to a supernova and that'd end your trip real quick, wouldn't it?
function hyperspace() {
 if (lifeCnt > 0) {
  if (jumpCnt > 0) {
   $('#sndHyperspace').get(0).currentTime = 0;
   $('#sndHyperspace').get(0).play();
   spaceship.x = getRandomFloat(1, (xLimit - 5));
   spaceship.y = getRandomFloat(1, (yLimit - 5));
   jumpCnt--;
   $('#HSCnt span').html(jumpCnt);

  } else {
   $('#sndHyperspaceFail').get(0).play();
  }
 }

}

function makeShot(){
 shotCnt++;


 shots.push(new Shot(shotCnt,spaceship.x,spaceship.y,spaceship.vx,spaceship.vy,spaceship.theta,spaceship.yaw,1800,0,0));
 //var newShot = shots.lastIndexOf();
 $('body')
     .append("<svg id='shot" + shotCnt + "' data-id='" + shotCnt + "' class='shot' height='6' width='6'><circle cx='3' cy='3' r='3' stroke='white' stroke-width='2' fill='red' /></svg>");
}

// one AG-2G quad laser cannon - must install more
function pewpew() {
	if (lifeCnt > 0 && resetGun == true) {
		$('#sndLaser').get(0).play();
  makeShot();
	}
}

function endpew() {
	$('#sndLaser').get(0).pause();
	$('#sndLaser').get(0).currentTime = 0;
}


$(window).resize(function() {
	xLimit = resetWindowLimit("x");
	yLimit = resetWindowLimit("y");
});

function resetgame(){
 $("#gameOverBoard").hide();
 $(".asteroid").remove();
 lifeCnt = 3;
 jumpCnt = 3;
 score = 0;
 asteroids = [];

 RegeneratgeAsteroids();

	//Add space ship
	$('body').append("<svg id='spaceship' class=''><path cx='5' cy='5' r='10' stroke='#ffffff' stroke-width='2' d='M " + spaceship.shape + " Z'  id='outerShip' /></svg>");

 $('#lifeCnt span').html(lifeCnt);
	$('#HSCnt span').html(jumpCnt);

 resetSpaceship();

}


function RegeneratgeAsteroids(){
 for (i = 0; i < rockCnt; i++) {
   thisRockSize = Math.floor(getRandomFloat(50, 100));
   thisRockSize = 100;
   asteroids.push(new Asteroid(i, 'test', thisRockSize, thisRockSize, getRandomFloat(0, (xLimit - 150)), getRandomFloat(0, (yLimit - 150)), getRandomFloat(-3, 3), getRandomFloat(-3, 3), colors[Math.floor(getRandomFloat(0, 5))], 'generic', false));
  }

 for (var key in asteroids) {

   if (asteroids.hasOwnProperty(key)) {
    $('body')
     .append("<svg id='rockAnim" + asteroids[key].id + "' data-id='" + asteroids[key].id + "' class='asteroid'><path cx='" + (asteroids[key].width) + "' cy='" + (asteroids[key].height) + "' r='" + (asteroids[key].width / 2 - 5) + "' stroke='" + asteroids[key].color + "' stroke-width='2' d='M " + rocksLrg[Math.floor(getRandomFloat(0, 3))] + " Z'  id='astroPath" + asteroids[key].id + "' /><text x='20' y='55' fill='" + asteroids[key].color + "'>" + asteroids[key].id + "</text></svg>");

    $('#rockAnim' + asteroids[key].id)
     .css('color', asteroids[key].color).css('border-color', asteroids[key].color).css('width', asteroids[key].width).css('height', asteroids[key].height).addClass('rockAnim');

   }
  }
}






// Kick it off!


$(document).ready(function() {
 resetgame();





// show instructions for desktop
if(xLimit > 768){
 inPlay = false;
	$('#welcomeModel').modal('show');

 $('#welcomeModel').on('hidden.bs.modal', function (e) {
inPlay = true;
});

}



	//kick off animation
	var startBubbletron = setInterval(function() {
		animateScreen(asteroids, shots);
	}, delta_time);

});
