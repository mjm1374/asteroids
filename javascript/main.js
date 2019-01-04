//initialize the environment
var asteroids = [],
  shots = [],
  shotCnt = 0,
  xLimit = resetWindowLimit("x") - 1,
  yLimit = resetWindowLimit("y") - 1,
  spaceship = new Spaceship((xLimit / 2), (yLimit / 2), 0, 0, 0, 0, 0, 0),
  colors = ['#edc951', '#eb6841', '#cc2a36', '#4f372d', '#00a0b0'],
  rocksLrg = ["26.087899,1.0434852 49.503787,26.009091 74.220561,2.6541843 96.335572,25.203747 85.278067,50.974686 98.286898,75.940275 62.512619,99.295186 26.087905,100.10053 0.7206885,77.55096 1.3711312,27.619771", "27.46638,2.6445482 66.467442,0.98983643 99.048213,24.999426 V 35.822504 L 65.202598,51.325844 98.421452,73.55696 76.484471,97.835645 H 72.723845 L 60.501821,85.842551 27.596351,98.713169 0.95859607,63.02645 1.8987487,25.29194 H 36.997914", "14.670645,48.844427 1.9670478,25.614646 27.37424,2.3848478 48.335078,12.875719 73.107033,1.6354928 97.878992,24.865291 75.012591,39.102909 97.878992,60.834007 75.012591,97.552066 39.442599,87.061197 26.739004,99.050766 1.3318868,75.820971"],
  spawnBox = new SpawnBox(((xLimit / 2) - 50), ((yLimit / 2) - 50)),
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
  screenScale = 1;

if (xLimit <= 414) {
  screenScale = 2;
}
//alert(screenScale);


//Asteroid( id, title, x, y, xv, yv, color, type, oob)
//Make me some asteroids


// MAIN ANIMATION LOOP -----------------------------------------------------------------------------------------

function animateScreen(obj, shots) {
  //console.log("play: ",inPlay);
  //console.log('ufoActive: ',ufoActive);
  //console.log('all clear : ', safeSpawn() );
  $('#scoreCnt span').html(score);
  $('#lifeCnt span').html(lifeCnt);

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
      if (inPlay == true) {
        if (inCollision(asteroids[key])) {
          boom();
          //checkPathTouch(asteroids[key]);

        }
      }

    }



    $('#rockAnim' + asteroids[key].id).css('left', asteroids[key].x).css('top', asteroids[key].y); // paint the rocks


  } //end asteroids

  if (ufo != null && ufo != undefined && ufoActive == true) {
    //console.log('move ufo', ufo.x);
    ufo.changePosition(ufo.x + ufo.vx, ufo.y + ufo.vy);
    if ((ufo.x) > (xLimit + 100)) {
      //ufo.x = 0;
      //console.log('right');
      parkUfo();
      spawnEnemy();
      //console.log('ext right');
    }
    if (ufo.x < -60 && ufo.x > -199) {
      //console.log('left',ufo.x );
      parkUfo();
      spawnEnemy();
      //console.log('ext left');
    }
    $('#ufoShip').css('left', ufo.x).css('top', ufo.y); // paint the ufo


  }


  for (var idx in shots) {
    var thisVX = (Math.cos(shots[idx].theta * Math.PI / 180) * 10 + shots[idx].x);
    var thisVY = (Math.sin(shots[idx].theta * Math.PI / 180) * 10 + shots[idx].y);
    var thisLife = shots[idx].life - 5;

    shots[idx].changeLife(thisLife);
    if (shots[idx].life < 0) {
      clearBullet('sp', idx);
    } else {
      shots[idx].changePosition(thisVX, thisVY);
      //console.log(idx, shots[idx].vx, shots[idx].vy
      $('#shot' + shots[idx].id).css('left', shots[idx].x).css('top', shots[idx].y); // paint the shot

      if (isHit(shots[idx])) {
        clearBullet('sp', idx);
      } else {
        if (isUfoHit(shots[idx])) {
          clearBullet('sp', idx);
        }

      }

    }

  }

  for (var ind in ufoShots) {
    thisUfoVX = (Math.cos(ufoShots[ind].theta * Math.PI / 180) * 10 + ufoShots[ind].x);
    thisUfoVY = (Math.sin(ufoShots[ind].theta * Math.PI / 180) * 10 + ufoShots[ind].y);
    thisUfoLife = ufoShots[ind].life - 5;

    ufoShots[ind].changeLife(thisUfoLife);

    if (ufoShots[ind].life < 0) {
      clearBullet('ufo', ind);
    } else {
      ufoShots[ind].changePosition(thisUfoVX, thisUfoVY);
      //console.log(ind, ufoShots[ind].id);
      $('#ufoshot' + ufoShots[ind].id).css('left', ufoShots[ind].x).css('top', ufoShots[ind].y); // paint the shot

      if (isSpaceshipHit(ufoShots[ind])) {
        clearBullet('ufo', ind);
        //console.log('hit');
      }

    }

  }

  moveSpaceship(delta_time);
  updateSpaceship(delta_time);

}


// Kick it off!


$(document).ready(function () {

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
      //$('*').css('cursor','none'); // clear cursor
      //spawnEnemy();
    });

  }



  //kick off animation
  var startBubbletron = setInterval(function () {
    animateScreen(asteroids, shots);
  }, delta_time);

});