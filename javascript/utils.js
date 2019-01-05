// Utilities for Asteroids


$(window).resize(function () {
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

	if (tempCoord >= split) {
		finalCoord = max;
	}

	return finalCoord;
}



function clearBullet(team, idx) {
	//console.log("index:",idx);
	if (team == "ufo") {
		$('#ufoshot' + ufoShots[idx].id).remove();
		ufoShots.splice(idx, 1);
	} else {
		$('#shot' + shots[idx].id).remove();
		shots.splice(idx, 1);

	}
}



function safeSpawn() {
	var a = asteroids;
	var b = spawnBox;

	for (i = 0; i < a.length; i++) {
		// console.log("iu: ", a[i].exists);
		if ((((a[i].y + a[i].height) < (b.y)) ||
				(a[i].y > (b.y + b.height)) ||
				((a[i].x + a[i].width) < b.x) ||
				(a[i].x > (b.x + b.width))) == false) {

			return true;
		}
	}


}





function resetgame() {
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




function pointCnt(num) {
	score = score + num;
	newLife = newLife - num;
	if (newLife < 0) {
		lifeCnt++;
		newLife = newLifeTarget + newLife;
		playExtraLife();
	}
	//console.log(newLife);
}




function playExtraLife() {
	setTimeout(function () {
		extraLifesnd.play();
	}, 1);
	setTimeout(function () {
		extraLifesnd.play();
	}, 250);
	setTimeout(function () {
		extraLifesnd.play();
	}, 500);



}








// Cookie ---------------------------------------------------------------------------------------

function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
	var name = cname + "=";
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
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
	//console.log("hs", hs);
	if (hs == "") {
		setCookie('highScore', score, 1000);
		$('#highScore span').text(score);
	} else {
		if (hs <= score) {
			setCookie('highScore', score, 1000);
			$('#highScore span').text(score);
		} else {
			$('#highScore span').text(hs);
		}
	}
}