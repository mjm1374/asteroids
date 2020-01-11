// ----- Spaceship ---------------------------------------------------------------

function resetSpaceship() {
	if (lifeCnt > 0) {
		$('#spaceship').show();
		$('#spaceship').css('opacity', '.25');
		spaceship = new Spaceship((xLimit / 2), (yLimit / 2), 0, 0, -90, 0, 0, 0);
		$('#spawn').css('left', spawnBox.x).css('top', spawnBox.y).css('height', spawnBox.height).css('width', spawnBox.width);
		parkUfo();
		clearTimeout(ufoTimer);
		spawnEnemy();

		while (safeSpawn() == true) {
			inPlay = false;
			animateScreen();
		}

		inPlay = true;
		$('#spaceship').css('opacity', '1');
	} else {
		inPlay = false;
		//$('*').css('cursor','default'); // clear cursor
		$('#spaceship').hide();
		$('#gameOverBoard').css('display', 'flex');
		checkHighScoreCookie();
	}
}

//spaceship controls || Speed & thrust

function moveSpaceship(delta_time) {
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
    del_v = thrust * thrust_per_milli * delta_time;
    del_vx = del_v * Math.cos(spaceship.theta * deg2rad);
    del_vy = del_v * Math.sin(spaceship.theta * deg2rad);

    if (lifeCnt > 0) {
      thrustsnd.play();
    }
  } else {
    del_vx = 0;
    del_vy = 0;
    thrustsnd.stop();
  }
  spaceship.vx = spaceship.vx + del_vx;
  spaceship.vy = spaceship.vy + del_vy;
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

  $('#spaceship').css('left', spaceship.x).css('top', spaceship.y).css({
    'transform': 'rotate(' + spaceship.theta + 'deg)'
  }); // Paint the spaceship

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

// Create the shot
function makeShot() {
  shotCnt++;
  shots.push(new Shot(shotCnt, spaceship.x, spaceship.y, spaceship.vx, spaceship.vy, spaceship.theta, spaceship.yaw, 1800, 0, 0));
  //var newShot = shots.lastIndexOf();
  $('body')
    .append("<svg id='shot" + shotCnt + "' data-id='" + shotCnt + "' class='shot' height='6' width='6'><circle cx='3' cy='3' r='3' stroke='white' stroke-width='2' fill='red' /></svg>");
}

//you died!
function boom() {
  $('#spaceship').hide();
  spaceship.destroy();
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
		setTimeout(function () {
			resetSpaceship();
		}, 3000);
	}
}

// one AG-2G quad laser cannon - must install more
function pewpew() {
  if (lifeCnt > 0 && resetGun == true && inPlay == true) {
    shootsnd.play();
    makeShot();
    resetGun = false;
  }
}


// ----- UFO's ---------------------------------------------------------------
function spawnEnemy() {
  $('#ufoShip').remove();
  var timer = Math.floor(getRandomFloat(25, 60) * 1000);
  ufoTimer = setTimeout(function () {
    makeUFO(true, 0.1);
  }, timer);
}


// the Alien UF0 -  call Mulder and Scully
function makeUFO(active, scale) {
  ufoActive = active;
  var direction = Math.random() < 0.5 ? -1 : 1;
  if (direction > 0) {
    ufo.x = 0 - ufo.width;
  } else {
    ufo.x = xLimit + ufo.width;
  }

  ufoSizeVar = Math.pow(Math.floor(Math.random() * 10), 2);
  ufoAim--; //every ship aims better
  if (ufoAim < 0) ufoAim = 0;
  var ufoScale = scale;
  ufo.y = getRandomFloat(0, yLimit);
  ufo.vx = getRandomFloat(1, ufoMaxSpeed) * direction;
  ufoMaxSpeed = ufoMaxSpeed + 0.25;
  if (ufoMaxSpeed > 10) ufoMaxSpeed = 10;
  ufo.points = 200;

  // little ship
  if (ufoSizeVar > 75 || score >= 100000) {
    ufoScale = 0.06;
    ufo.vx = getRandomFloat(3, 10) * direction;
    ufoAim = 0;
    ufo.points = 1000;

  }

  $('body').append("<svg id='ufoShip' class='ufo'><polygon transform='scale(" + ufoScale + ", " + ufoScale + ")'  id='myPolygon' stroke='#ffffff'   stroke-width='15' points='466.697 275.189, 350.500 226.628, 329.099 170.984, 294.919 147.509, 242.500 147.509, 242.500 112.989, 235.000 105.489, 227.500 112.989, 227.500 147.509, 175.081 147.509, 140.901 170.984, 119.500 226.628, 3.303 275.189, 0.000 281.405, 3.303 287.621, 106.027 332.782, 143.504 364.510, 326.496 364.510, 363.973 332.782, 466.697 287.621, 470.000 281.405, 466.697 275.189'></svg>");

  $('#ufoShip').css('width', ufo.width).css('height', ufo.height);
  var startFiring = setInterval(enemyShooter, ufoShootingSpeed);

  function enemyShooter() {
    if (ufoActive == true && inPlay == true) {
      ufoShotCnt++;
      var angleDeg = (Math.atan2(spaceship.y - ufo.y, spaceship.x - ufo.x) * 180 / Math.PI) + getRandomFloat((ufoAim * -1), ufoAim);
      ufoShots.push(new Shot(ufoShotCnt, ufo.x, ufo.y, ufo.vx, ufo.vy, angleDeg, ufo.yaw, 1800, 0, 0));
      ufoBulletsnd.play();
      if (ufoScale == 0.1) {
        $('#sndSaucerBig').get(0).play();
      } else {
        $('#sndSaucerSmall').get(0).play();
      }
      $('body')
        .append("<svg id='ufoshot" + ufoShotCnt + "' data-id='" + ufoShotCnt + "' class='ufoshot' height='8' width='8'><circle cx='3' cy='3' r='3' stroke='white' stroke-width='2' fill='blue' /></svg>");
    } else {
      //console.log('clearing');
      clearInterval(startFiring);
      if (ufoScale == 0.1) {
        $('#sndSaucerBig').get(0).pause();
        $('#sndSaucerBig').get(0).currentTime = 0;
      } else {
        $('#sndSaucerSmall').get(0).pause();
        $('#sndSaucerSmall').get(0).currentTime = 0;
      }
    }
  }
}

function blowupUfo(obj, idx) {
  var a = obj;
  $('#sndAstroBoom').get(0).pause();
  $('#sndAstroBoom').get(0).currentTime = 0;
  $('#sndAstroBoom').get(0).play();
  $('#ufoShip').remove();
  ufoBoom.play();
  pointCnt(obj.points);
  parkUfo();
  clearTimeout(ufoTimer);  
  spawnEnemy();
}

function parkUfo() {
  $('#ufoShip').remove();
  ufoActive = false;
  ufo.x = -200;
  ufo.y = -200;
  ufo.vx = 0;
  ufo.vy = 0;
}