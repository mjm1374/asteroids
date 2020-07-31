//initialize the environment
const version = 1.3;

let asteroids = [],
  shots = [],
  shotCnt = 0,
  xLimit = resetWindowLimit('x') - 1,
  yLimit = resetWindowLimit('y') - 1,
  spaceship = new Spaceship(xLimit / 2, yLimit / 2, 0, 0, 0, 0, 0, 0),
  spawnBox = new SpawnBox(xLimit / 2 - 50, yLimit / 2 - 50),
  lifeCnt = 3,
  jumpCnt = 3,
  score = 0,
  newLifeTarget = 10000,
  newLife = newLifeTarget,
  resetGun = true,
  inPlay = false,
  mode = 'asteroids',
  rockCnt = 10,
  scale = 1,
  rockID = 0, //for debugging only
  ufo = new Ufo(-100, -100, 0, 0, 0, 0, 200),
  nextEnemy = Math.floor(getRandomFloat(10, 30) * 1000),
  enemyDelay = 2000,
  enemyUFO = [],
  ufoShots = [],
  ufoShotCnt = 0,
  ufoActive = false,
  delta_time = 20,
  turn = 0,
  thrust = 0,
  turn_per_milli = 0.1,
  thrust_per_milli = 0.00015,
  key_delay = 50,
  del_v = 0,
  del_vx = 0,
  del_vy = 0,
  rock_max_v = 1.5,
  shootsnd = null,
  thrustsnd = null,
  ufosnd = null,
  ufoBulletsnd = null,
  ufoShootingSpeed = 1000,
  ufoAim = 50,
  ufoScale = 0.1,
  ufoMaxSpeed = 3,
  ufoMinSpeed = 1,
  ufoSizeVar = 10,
  ufoTimer = null,
  screenScale = 1,
  scoreNum = null,
  versionNum = null,
  lifeNum = null,
  HSNum = null,
  extraLifesnd = null,
  ufoBoom = null,
  spaceshipSvg = null,
  gameWrapper = null,
  gameOverBoard = null;

//conditional mobile vars
if (xLimit <= 414) {
  screenScale = 2;
  rockCnt = 5;
}

// MAIN ANIMATION LOOP -----------------------------------------------------------------------------------------

/**
 * The main animation loop
 */
function animateScreen() {
  //console.log("play: ",inPlay);
  hideCursor();
  updateAsteroids();
  checkUFO();
  updateShots();
  updateUFOShot();
  moveSpaceship(delta_time);
  updateSpaceship(delta_time);
  updateScoreCard();

}

// END animation Loop -------------------------------------------------------------------------------------------

/**
 * Controls to update the score, life and Hyperspace count
 */
function updateScoreCard() {
  scoreNum.innerText = score;
  lifeNum.innerText = lifeCnt;
  HSNum.innerText = jumpCnt;
}



/**
 * update the asteroids position
 */
function updateAsteroids() {
  for (var key in asteroids) {
    if (asteroids.hasOwnProperty(key)) {
      var newVel;
      asteroids[key].changePosition(
        asteroids[key].x + asteroids[key].xv,
        asteroids[key].y + asteroids[key].yv
      );

      if (mode == 'asteroids') {
        if (
          asteroids[key].x <= 0 - asteroids[key].width ||
          asteroids[key].x >= xLimit + asteroids[key].width
        ) {
          if (asteroids[key].x >= xLimit + asteroids[key].width) {
            asteroids[key].x = -Math.abs(0 - asteroids[key].width);
          } else {
            asteroids[key].x = xLimit + asteroids[key].width;
          }
        }

        if (
          asteroids[key].y <= 0 - asteroids[key].width ||
          asteroids[key].y >= yLimit + asteroids[key].height
        ) {
          if (asteroids[key].y >= yLimit + asteroids[key].height) {
            asteroids[key].y = -Math.abs(0 - asteroids[key].height);
          } else {
            asteroids[key].y = yLimit + asteroids[key].height;
          }
        }
      }

      // cheeck for collision
      if (inPlay == true) {
        if (inCollision(asteroids[key])) {
          boom();
        }
      }
    }

    let thisRock = document.getElementById('rockAnim' + asteroids[key].id);
    moveItem(thisRock, asteroids[key].x, asteroids[key].y);
  } //end asteroids
}

/**
 * Check on the status of the UFO
 */
function checkUFO() {
  if (ufo != null && ufo != undefined && ufoActive == true) {
    ufo.changePosition(ufo.x + ufo.vx, ufo.y + ufo.vy);
    if (ufo.x > xLimit + 100) {
      parkUfo();
      spawnEnemy();
    }
    if (ufo.x < -60 && ufo.x > -199) {
      parkUfo();
      spawnEnemy();
    }
    let thisUfo = document.getElementById('ufoShip');
    moveItem(thisUfo, ufo.x, ufo.y);
    // paint the ufo
  }
}

/**
 * Update the bullets
 */
function updateShots() {
  for (var idx in shots) {
    var thisVX =
      Math.cos((shots[idx].theta * Math.PI) / 180) * 10 + shots[idx].x;
    var thisVY =
      Math.sin((shots[idx].theta * Math.PI) / 180) * 10 + shots[idx].y;
    var thisLife = shots[idx].life - 5;
    shots[idx].changeLife(thisLife);

    if (shots[idx].life < 0) {
      clearBullet('sp', idx);
    } else {
      shots[idx].changePosition(thisVX, thisVY);
      let thisShot = document.getElementById('shot' + shots[idx].id);
      moveItem(thisShot, shots[idx].x, shots[idx].y);
      // paint the shot

      if (isHit(shots[idx])) {
        clearBullet('sp', idx);
      } else {
        if (isUfoHit(shots[idx])) {
          clearBullet('sp', idx);
        }
      }
    }
  }
}

/**
 * update the UFO bullters
 */
function updateUFOShot() {
  for (var ind in ufoShots) {
    let thisUfoVX =
      Math.cos((ufoShots[ind].theta * Math.PI) / 180) * 10 +
      ufoShots[ind].x;
    let thisUfoVY =
      Math.sin((ufoShots[ind].theta * Math.PI) / 180) * 10 +
      ufoShots[ind].y;
    let thisUfoLife = ufoShots[ind].life - 5;
    ufoShots[ind].changeLife(thisUfoLife);

    if (ufoShots[ind].life < 0) {
      clearBullet('ufo', ind);
    } else {
      ufoShots[ind].changePosition(thisUfoVX, thisUfoVY);

      let thisUfoShot = document.getElementById('ufoshot' + ufoShots[ind].id);

      moveItem(thisUfoShot, ufoShots[ind].x, ufoShots[ind].y);
      // paint the shot

      if (isSpaceshipHit(ufoShots[ind])) {
        clearBullet('ufo', ind);
      }
    }
  }
}

// Kick it off!
document.addEventListener('DOMContentLoaded', function () {
  scoreNum = document.getElementById('scoreNum');
  versionNum = document.getElementsByClassName('versionNum');
  lifeNum = document.getElementById('lifeNum');
  HSNum = document.getElementById('HSNum');
  gameWrapper = document.getElementById('game__wrapper');
  gameOverBoard = document.getElementById('gameOverBoard');

  for (let i = 0; i < versionNum.length; i++) {
    versionNum[i].innerText = version;
  }

  //establish reusable sounds
  shootsnd = new Sound('snd/fire.mp3');
  thrustsnd = new Sound('snd/thrust.mp3');
  extraLifesnd = new Sound('snd/extraShip.ogg');
  ufosnd = new Sound('snd/saucerBig.mp3');
  ufoBulletsnd = new Sound('snd/laser.mp3');
  ufoBoom = new Sound('snd/bangMedium.mp3');

  resetgame();

  // show instructions for desktop
  if (xLimit > 768) {
    inPlay = false;
    $('#welcomeModel').modal('show');
    $('#welcomeModel').on('hidden.bs.modal', function (e) {
      inPlay = true;
    });
  }

  //kick off animation
  let startAstroStorm = setInterval(function () {
    animateScreen();
  }, delta_time);
});