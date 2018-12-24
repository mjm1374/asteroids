
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



function clearBullet(idx){
//console.log("index:",idx);
    $('#shot' + shots[idx].id).remove();
    shots.splice(idx,1);


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