
// Utilities for Asteroids


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
				turn = 1;
				break;
			case 65: //a = yaw right
				turn = -1;
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
				endpew();
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
			case 'glyphShoot': //s = shoot
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
				endpew();
                resetGun = true;
				break;
		}
	});

}

// End Input CONTROLS ---------------------------------------------------------------------------



