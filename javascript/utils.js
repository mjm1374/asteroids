
// Utilities for Asteroids


$(window).resize(function() {
	xLimit = resetWindowLimit("x");
	yLimit = resetWindowLimit("y");
});

function resetWindowLimit(whatDim) {

	var newDim, newDimx, newDimy;
	newDimx = window.innerHeight;
	newDimy = window.innerHeight;


	if (whatDim == "x") {
		newDim = window.innerWidth;
		for (i = 0; i < asteroids.length; i++) {
			if (asteroids[i].x >= (newDimx - asteroids[i].width)) {
				asteroids[i].changePosition((newDimx - asteroids[i].width), (newDimy - asteroids[i].height));
			}
		}

	} else {
		newDim = window.innerHeight;
		for (i = 0; i < asteroids.length; i++) {
			if (asteroids[i].y >= (newDimy - asteroids[i].height)) {
				asteroids[i].changePosition((newDimx - asteroids[i].width), (newDim - asteroids[i].height));
			}

		}
	}

	return newDim;
}


function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}

function getSafeRandomFloat(min, max) {
	var split = min + max / 2;
	var tempCoord = Math.random() * (max - min) + min;
	var finalCoord = 0;

	if (tempCoord >= split){
		finalCoord = max;
	}

	return finalCoord;
}



function clearBullet(team,idx){
//console.log("index:",idx);
	if(team == "ufo"){
		$('#ufoshot' + ufoShots[idx].id).remove();
			ufoShots.splice(idx,1);
		}else{
			$('#shot' + shots[idx].id).remove();
			shots.splice(idx,1);

		}
}

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
				thrustsnd.play()
			}
		} else {
			del_vx = 0;
			del_vy = 0;
			thrustsnd.stop();
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


// Traveling through hyperspace ain't like dusting crops, boy! Without precise calculations we could fly right through a star or bounce too close to a supernova and that'd end your trip real quick, wouldn't it?
function hyperspace() {
 if (lifeCnt > 0 && inPlay == true) {
  if (jumpCnt > 0) {
   $('#sndHyperspace').get(0).currentTime = 0;
   $('#sndHyperspace').get(0).play();
   spaceship.x = getRandomFloat(1, (xLimit - 5));
   spaceship.y = getRandomFloat(1, (yLimit - 5));
	 spaceship.vx = 0;
	 spaceship.vy = 0;
   jumpCnt--;
   $('#HSCnt span').html(jumpCnt);

  } else {
   $('#sndHyperspaceFail').get(0).play();
  }
 }

}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
//Not used yet, want to see if this can be used for collision detection closer than bounding box

function isPointInPoly(poly, pt) {
	for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
		((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) &&
		(pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) &&
		(c = !c);
	return c;
}



function safeSpawn(){
 var a = asteroids;
 var b = spawnBox;

 for (i=0;i < a.length;i++){
 // console.log("iu: ", a[i].exists);
  if((((a[i].y + a[i].height) < (b.y) ) ||
        (a[i].y > (b.y + b.height)) ||
        ((a[i].x + a[i].width) < b.x) ||
        (a[i].x > (b.x + b.width))) == false){

   return true;
  }
 }


}



function resetSpaceship() {
	if (lifeCnt > 0) {
  $('#spaceship').show();
	$('#spaceship').css('opacity','.25');
		spaceship = new Spaceship((xLimit / 2), (yLimit / 2), 0, 0, -90, 0, 0, 0);
		//inPlay = true;
		$('#spawn').css('left',spawnBox.x).css('top',spawnBox.y).css('height', spawnBox.height).css('width',spawnBox.width);
		//console.log(spawnBox.x, spawnBox.y);
		parkUfo();
		//console.log('resetSpaceship');
		clearTimeout(ufoTimer);
		spawnEnemy();

  while (safeSpawn() == true ){
     inPlay = false;
		 //console.log('all clear : ', safeSpawn() );
		 animateScreen();
   }

	 inPlay = true;
		$('#spaceship').css('opacity','1');
		//console.log('all clear : ', safeSpawn() );



	} else {
  inPlay = false;
  //$('*').css('cursor','default'); // clear cursor
		$('#spaceship').hide();
		$('#gameOverBoard').css('display', 'block');
  checkHighScoreCookie();
	}

}








// one AG-2G quad laser cannon - must install more
function pewpew() {
	if (lifeCnt > 0 && resetGun == true && inPlay ==  true) {
  shootsnd.play();
  makeShot();
  resetGun = false;
	}
}




function resetgame(){
 $("#gameOverBoard").hide();
 //$('*').css('cursor','none'); // clear cursor
 $(".asteroid").remove();
 lifeCnt = 3;
 jumpCnt = 3;
 score = 0;
	newLife = newLifeTarget;
	ufoAim = 50;
 asteroids = [];

 regenerateAsteroids();

	//Add space ship
	$('body').append("<svg id='spaceship' class=''><path cx='5' cy='5' r='10' stroke='#ffffff' stroke-width='2' d='M " + spaceship.shape + " Z'  id='outerShip' /></svg>");

 $('#lifeCnt span').html(lifeCnt);
	$('#HSCnt span').html(jumpCnt);

 resetSpaceship();

}


function regenerateAsteroids(){

 for (i = 0; i < rockCnt; i++) {
   rockID++;
   //thisRockSize = Math.floor(getRandomFloat(50, 100));
   thisRockSize = 100;
   asteroids.push(new Asteroid(rockID, 'test', thisRockSize, thisRockSize, getSafeRandomFloat(0, (xLimit - 150)), getSafeRandomFloat(0, (yLimit - 150)), getRandomFloat(-3, 3), getRandomFloat(-3, 3), colors[Math.floor(getRandomFloat(0, 5))], 'generic', false, 20, true));
  }

 for (var key in asteroids) {

   if (asteroids.hasOwnProperty(key)) {
    $('body')
     .append("<svg id='rockAnim" + asteroids[key].id + "' data-id='" + asteroids[key].id + "' class='asteroid rocksize100'><path cx='" + (asteroids[key].width) + "' cy='" + (asteroids[key].height) + "' r='" + (asteroids[key].width / 2 - 5) + "' stroke='" + asteroids[key].color + "' stroke-width='2' d='M " + rocksLrg[Math.floor(getRandomFloat(0, 3))] + " Z'  id='astroPath" + asteroids[key].id + "' /><text x='20' y='55' fill='" + asteroids[key].color + "'></text></svg>");
     //" + asteroids[key].id + "

    $('#rockAnim' + asteroids[key].id)
     .css('color', asteroids[key].color).css('border-color', asteroids[key].color).css('width', asteroids[key].width).css('height', asteroids[key].height).addClass('rockAnim');

   }
  }
}




function blowupAsteroid(obj,idx){
 $('#sndAstroBoom').get(0).pause();
 $('#sndAstroBoom').get(0).currentTime = 0;
 $('#sndAstroBoom').get(0).play();
 var a = obj;
 pointCnt(obj.points);


//make and clean up astroids array and svg's
if(a.height > 25){
 makeAsteroidPieces(a.x,a.y,(a.height / 2),2);
}


 $('#rockAnim' + a.id).remove();
 asteroids.splice(idx,1);

 //console.log("A: ", asteroids.length , idx);
 //console.log(asteroids.length);
 if(asteroids.length == 0){
  regenerateAsteroids();
 }
}


function pointCnt(num){
 score = score + num;
 newLife = newLife - num;
 if(newLife < 0){
  lifeCnt++;
  newLife = newLifeTarget + newLife;
  playExtraLife();
 }
 //console.log(newLife);
}









//you died!
function boom() {
 $('#spaceship').hide();
 inPlay = false;
 ufoActive = false;
 spaceship.x = -1000;
 spaceship.y = -1000;
 spaceship.vx = 0;
 spaceship.vy = 0;

 $('#sndBoom').get(0).play();

	if (lifeCnt > 0) {
		lifeCnt--;
		$('#lifeCnt span').html(lifeCnt);
		jumpCnt = 3;
		$('#HSCnt span').html(jumpCnt);
  setTimeout(function(){ resetSpaceship(); }, 3000);

	}

}


function playExtraLife(){
  setTimeout(function(){ extraLifesnd.play(); }, 1);
	setTimeout(function(){ extraLifesnd.play(); }, 250);
  setTimeout(function(){ extraLifesnd.play(); }, 500);



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


function makeAsteroidPieces(x, y, size, cnt){

 for (i = 0; i < cnt; i++) {
   rockID++;
   thisRockSize = size;
   //which transform scale to implement
   switch (size) {
    case 100: //large
     scale = '1';
     maxVel = 3;
     rockPnt = 20;
     break;
    case 50: //medium
     scale = '.5';
     maxVel = 4;
     rockPnt = 50;
     break;
    case 25: //small
     scale = '.25';
     maxVel = 5;
     rockPnt = 100;
     break;
   }

   asteroids.push(new Asteroid(rockID, 'test', thisRockSize, thisRockSize, x, y, getRandomFloat(-Math.abs(maxVel), maxVel), getRandomFloat(-Math.abs(maxVel), maxVel), colors[Math.floor(getRandomFloat(0, 5))], 'generic', false, rockPnt, true));


 $('body')
     .append("<svg id='rockAnim" + asteroids[asteroids.length - 1].id + "' data-id='" + asteroids[asteroids.length - 1].id + "' class='asteroid rocksize" + size + "'><path cx='" + (asteroids[asteroids.length - 1].width) + "' cy='" + (asteroids[asteroids.length - 1].height) + "' r='" + (asteroids[asteroids.length - 1].width / 2 - 5) + "' stroke='" + asteroids[asteroids.length - 1].color + "' stroke-width='2' d='M " + rocksLrg[Math.floor(getRandomFloat(0, 3))] + " Z'  id='astroPath" + asteroids[asteroids.length - 1].id + "' transform='scale(" + scale + ", " + scale + ")' /><text x='20' y='55' fill='" + asteroids[asteroids.length - 1].color + "' transform='scale(" + scale + ", " + scale + ")></text></svg>");
     //" + asteroids[asteroids.length - 1].id + " -  debugger id that goes int he text

    $('#rockAnim' + asteroids[asteroids.length - 1].id)
     .css('color', asteroids[asteroids.length - 1].color).css('border-color', asteroids[asteroids.length - 1].color).css('width', asteroids[asteroids.length - 1].width).css('height', asteroids[asteroids.length - 1].height).addClass('rockAnim');

   }


}




// Input controls  ---------------------------------------------------------------------//

if (lifeCnt > 0) {
	document.onkeydown = function(e) {

  $("#spaceship").css("opacity","1");
		var key = e.keyCode;
		switch (key) {
			case 68: //d = yaw left
				turn = 2;
				break;
			case 65: //a = yaw right
				turn = -2;
				break;
			case 87: //w = forward
				thrust = 1;
				break;
			case 83: //s = backward
				thrust = -1;
				break;
			case 32: //s = shoot
				pewpew();
        resetGun = false;
				break;
			case 13: // enter = hyperspace
				hyperspace();
				break;
			case 8:
				boom();
				break;
			case 46:
				boom();
				break;
		}
	};

	document.onkeyup = function(e) {
		var key = e.keyCode;
		switch (key) {
			case 65: //a = yaw left
				turn = 0;
				break;
			case 68: //d = yaw right
				turn = 0;
				break;
			case 87: //w = forward
				thrust = 0;
				break;
			case 83: //s = backward
				thrust = 0;
				break;
			case 32:
				//endpew();
        resetGun = true;
				break;

		}
	};

	// mobile controls   --------------->

	$(document).on('touchstart', ' .gameBtn', function(e) {

  $("#spaceship").css("opacity","1");
		//e.preventDefault();
		var key = e.target.id;
		console.log(key);
		switch (key) {
			case 'btnLeft': //d = yaw left
				turn = -1;
				break;
			case 'btnRight': //a = yaw right
				turn = 1;
				break;
			case 'btnUp': //w = forward
				thrust = 1;
				break;
			case 'btnDown': //s = backward
				thrust = -1;
				break;
			case 'btnShoot': //s = shoot
				pewpew();
				break;
			case 'btnHS': // enter = hyperspace
				hyperspace();
				break;

		}
	});

	$(document).on('touchend', '.gameBtn', function(e) {

		var key = e.target.id;
		switch (key) {
			case 'btnLeft': //d = yaw left
				turn = 0;
				break;
			case 'btnRight': //a = yaw right
				turn = 0;
				break;
			case 'btnUp': //w = forward
				thrust = 0;
				break;
			case 'btnDown': //s = backward
				thrust = 0;

				break;
			case 'glyphLeft': //d = yaw left
				turn = 0;
				break;
			case 'btnShoot': //space = shoot
				//endpew();
        resetGun = true;
				break;
		}
	});

}

// End Input controls ---------------------------------------------------------------------------




// Cookie ---------------------------------------------------------------------------------------

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
  var expires = "expires="+d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var ca = document.cookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function checkHighScoreCookie() {
  var hs = getCookie("highScore");
  if (hs != "") {
    setCookie('highScore',score,1000);
  } else {
    if (hs <= score) {
      setCookie('highScore',score,1000);
    }
  }
}