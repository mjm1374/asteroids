//initialize the environment
var asteroids = [],
 shots = [],
 shotCnt = 0,
 xLimit = resetWindowLimit("x") - 1,
	yLimit = resetWindowLimit("y") - 1,
	spaceship = new Spaceship((xLimit / 2), (yLimit / 2), 0, 0, 0, 0, 0, 0),
	colors = ['#edc951', '#eb6841', '#cc2a36', '#4f372d', '#00a0b0'],
	rocksLrg = ["26.087899,1.0434852 49.503787,26.009091 74.220561,2.6541843 96.335572,25.203747 85.278067,50.974686 98.286898,75.940275 62.512619,99.295186 26.087905,100.10053 0.7206885,77.55096 1.3711312,27.619771", "27.46638,2.6445482 66.467442,0.98983643 99.048213,24.999426 V 35.822504 L 65.202598,51.325844 98.421452,73.55696 76.484471,97.835645 H 72.723845 L 60.501821,85.842551 27.596351,98.713169 0.95859607,63.02645 1.8987487,25.29194 H 36.997914", "14.670645,48.844427 1.9670478,25.614646 27.37424,2.3848478 48.335078,12.875719 73.107033,1.6354928 97.878992,24.865291 75.012591,39.102909 97.878992,60.834007 75.012591,97.552066 39.442599,87.061197 26.739004,99.050766 1.3318868,75.820971"],
 spawnBox = new SpawnBox(((xLimit / 2) - 50) , ((yLimit / 2) - 50)),
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
 rockID = 0,//for debugging only
 ufo = new Ufo(-100,-100,0,0,0,0,200),
 nextEnemy = Math.floor(getRandomFloat(10,30) * 1000),
 enemyDelay = 2000,
 enemyUFO = [],
 ufoShots = [],
 ufoShotCnt = 0,
 ufoActive = false,
	delta_time = 20,
	turn = 0,
	thrust = 0,
	turn_per_milli = .1,
	thrust_per_milli = .00015,
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
 ufoScale = .1,
 ufoMaxSpeed = 3,
 ufoMinSpeed = 1,
 ufoSizeVar = 10,
 ufoTimer = null,
 screenScale = 1;

if (xLimit <= 414) { screenScale = 2;}
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
   if(inPlay == true){
    if(inCollision(asteroids[key])){

     boom();
     //checkPathTouch(asteroids[key]);

   }
   }

		}



 $('#rockAnim' + asteroids[key].id).css('left', asteroids[key].x).css('top', asteroids[key].y); // paint the rocks


	} //end asteroids

 if (ufo != null && ufo != undefined && ufoActive ==true) {
  //console.log('move ufo', ufo.x);
   ufo.changePosition(ufo.x + ufo.vx, ufo.y + ufo.vy);
    if((ufo.x) > (xLimit + 100) ){
     //ufo.x = 0;
     //console.log('right');
     parkUfo();
     spawnEnemy();
     //console.log('ext right');
    }
    if(ufo.x < -60 && ufo.x > -199 ){
     //console.log('left',ufo.x );
     parkUfo();
     spawnEnemy();
     //console.log('ext left');
    }
   $('#ufoShip').css('left', ufo.x).css('top', ufo.y); // paint the ufo


 }


 for (var idx in shots) {
  var thisVX = (Math.cos(shots[idx].theta * Math.PI/180) * 10 + shots[idx].x);
  var thisVY = (Math.sin(shots[idx].theta * Math.PI/180) * 10 + shots[idx].y);
  var thisLife = shots[idx].life - 5;

  shots[idx].changeLife(thisLife);
   if(shots[idx].life < 0){
    clearBullet('sp',idx);
   } else{
    shots[idx].changePosition(thisVX,thisVY);
    //console.log(idx, shots[idx].vx, shots[idx].vy
    $('#shot' + shots[idx].id).css('left', shots[idx].x).css('top', shots[idx].y); // paint the shot

    if(isHit(shots[idx])){
     clearBullet('sp',idx);
    } else {
     if(isUfoHit(shots[idx])){
     clearBullet('sp',idx);
    }

    }

   }

  }

  for (var ind in ufoShots) {
  var thisVX = (Math.cos(ufoShots[ind].theta * Math.PI/180) * 10 + ufoShots[ind].x);
  var thisVY = (Math.sin(ufoShots[ind].theta * Math.PI/180) * 10 + ufoShots[ind].y);
  var thisLife = ufoShots[ind].life - 5;

  ufoShots[ind].changeLife(thisLife);

   if(ufoShots[ind].life < 0){
    clearBullet('ufo',ind);
   } else{
    ufoShots[ind].changePosition(thisVX,thisVY);
    //console.log(ind, ufoShots[ind].id);
    $('#ufoshot' + ufoShots[ind].id).css('left', ufoShots[ind].x).css('top',ufoShots[ind].y); // paint the shot

    if(isSpaceshipHit(ufoShots[ind])){
     clearBullet('ufo',ind);
     console.log('hit');
    }

    }

   }




	moveSpaceship(delta_time);
	updateSpaceship(delta_time);

}



// Utility functions  ----------------------------------------------------------------------------


function inCollision(obj){
 var a = spaceship;
 var b = obj;

   return !(
         ((a.y + a.height) < (b.y)) ||
         (a.y > (b.y + b.height)) ||
         ((a.x + a.width) < b.x) ||
         (a.x > (b.x + b.width)  )
     );



}

function isHit(obj){
 var a = asteroids;
 var b = obj;
 //var isHit = false;
 //console.log("astro length: ",a.length);

 for (i=0;i < a.length;i++){
 // console.log("iu: ", a[i].exists);
  if((((a[i].y + a[i].height) < (b.y)) ||
        (a[i].y > (b.y + b.height)) ||
        ((a[i].x + a[i].width) < b.x) ||
        (a[i].x > (b.x + b.width))) == false){
   //console.log("boom");
   blowupAsteroid(a[i],i);
   return true;
  }
 }
}


function isSpaceshipHit(obj){
 var a = spaceship;
 var b = obj;
 //var isHit = false;
 //console.log("astro length: ",a.length);

 if((((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))) == false){
   //console.log("boom");
   boom();
   ufoActive = false;
   return true;
  }
}

function isUfoHit(obj){
 var a = ufo;
 var b = obj;

  if((((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))) == false){
   //console.log("boom");
   blowupUfo(a,i);
   ufoActive = false;
   return true;

 }
}

function blowupUfo(obj,idx){
 var a = obj;
 $('#sndAstroBoom').get(0).pause();
 $('#sndAstroBoom').get(0).currentTime = 0;
 $('#sndAstroBoom').get(0).play();
 $('#ufoShip').remove();
 ufoBoom.play();
 pointCnt(obj.points);
 parkUfo();

 //console.log('blowupUfo');
 spawnEnemy();

}





function spawnEnemy(){
 //console.log("called");
 $('#ufoShip').remove();
 var timer  = Math.floor(getRandomFloat(15,40) * 1000);
 ufoTimer = setTimeout(function(){ makeUFO(true,.1); }, timer);
}


// the Alien UF0 -  call Mulder and Scully
function makeUFO(active,scale){

  ufoActive = active;

  var direction = Math.random() < 0.5 ? -1 : 1;
  if(direction > 0){
    ufo.x = 0 - ufo.width;
   }else{
     ufo.x = xLimit + ufo.width;
   }

   ufoSizeVar = Math.pow(Math.floor(Math.random()*10), 2);

   //ufoShotCnt = 0;
   ufoAim--; //every ship aims better
   if(ufoAim < 0) ufoAim = 0;
   var ufoScale = scale;

   ufo.y = getRandomFloat(0,yLimit);
   ufo.vx = getRandomFloat(1,ufoMaxSpeed) * direction;
   ufoMaxSpeed =  ufoMaxSpeed + .25;
   if(ufoMaxSpeed > 10) ufoMaxSpeed = 10;
   ufo.points = 200;

   // little ship
   if(ufoSizeVar > 75 || score >=  100000){
    ufoScale = .06;
    ufo.vx = getRandomFloat(3,10) * direction;
    ufoAim = 0;
    ufo.points = 1000;

   }

   //console.log('enemy ship');


    //ufo = new Ufo(ufoX,ufoY,ufoSpeed,0,0,0,200);
    $('body').append("<svg id='ufoShip' class='ufo'><polygon transform='scale(" + ufoScale + ", " + ufoScale + ")'  id='myPolygon' stroke='#ffffff'   stroke-width='15' points='466.697 275.189, 350.500 226.628, 329.099 170.984, 294.919 147.509, 242.500 147.509, 242.500 112.989, 235.000 105.489, 227.500 112.989, 227.500 147.509, 175.081 147.509, 140.901 170.984, 119.500 226.628, 3.303 275.189, 0.000 281.405, 3.303 287.621, 106.027 332.782, 143.504 364.510, 326.496 364.510, 363.973 332.782, 466.697 287.621, 470.000 281.405, 466.697 275.189'></svg>");

    $('#ufoShip').css('width', ufo.width).css('height', ufo.height);
    var startFiring = setInterval(enemyShooter, ufoShootingSpeed);

    function enemyShooter() {


     if(ufoActive == true && inPlay == true){
      ufoShotCnt++;
      var angleDeg = (Math.atan2(spaceship.y - ufo.y, spaceship.x - ufo.x) * 180 / Math.PI) + getRandomFloat((ufoAim * -1),ufoAim);
      //console.log('shooting: ',angleDeg);
      ufoShots.push(new Shot(ufoShotCnt,ufo.x,ufo.y,ufo.vx,ufo.vy,angleDeg,ufo.yaw,1800,0,0));
      ufoBulletsnd.play();
      if(ufoScale == .1){
       $('#sndSaucerBig').get(0).play();
      }else{
       $('#sndSaucerSmall').get(0).play();
      }

      //var newShot = shots.lastIndexOf();
      $('body')
          .append("<svg id='ufoshot" + ufoShotCnt + "' data-id='" + ufoShotCnt + "' class='ufoshot' height='8' width='8'><circle cx='3' cy='3' r='3' stroke='white' stroke-width='2' fill='blue' /></svg>");
     } else {
      //console.log('clearing');
      clearInterval(startFiring);
      if(ufoScale == .1){
       $('#sndSaucerBig').get(0).pause();
       $('#sndSaucerBig').get(0).currentTime = 0;
      }else{
       $('#sndSaucerSmall').get(0).pause();
       $('#sndSaucerSmall').get(0).currentTime = 0;
      }
     }
    }

}


 function parkUfo(){
   $('#ufoShip').remove();
   ufoActive = false;
   ufo.x = -200;
   ufo.y = -200;
   ufo.vx = 0;
   ufo.vy = 0;
  }


function makeShot(){
 shotCnt++;

 shots.push(new Shot(shotCnt,spaceship.x,spaceship.y,spaceship.vx,spaceship.vy,spaceship.theta,spaceship.yaw,1800,0,0));
 //var newShot = shots.lastIndexOf();
 $('body')
     .append("<svg id='shot" + shotCnt + "' data-id='" + shotCnt + "' class='shot' height='6' width='6'><circle cx='3' cy='3' r='3' stroke='white' stroke-width='2' fill='red' /></svg>");
}








// Kick it off!


$(document).ready(function() {

//establish reusable sounds
 shootsnd = new Sound('snd/fire.mp3');
 thrustsnd = new Sound('snd/thrust.mp3');
 extraLifesnd = new Sound('snd/extraShip.ogg');
 ufosnd = new Sound('snd/saucerBig.mp3');
 ufoBulletsnd = new Sound('snd/laser.mp3');
 ufoBoom = new Sound('snd/bangMedium.mp3');

 resetgame();





// show instructions for desktop
if(xLimit > 768){
 inPlay = false;
	$('#welcomeModel').modal('show');

 $('#welcomeModel').on('hidden.bs.modal', function (e) {
inPlay = true;
//$('*').css('cursor','none'); // clear cursor
 //spawnEnemy();
});

}



	//kick off animation
	var startBubbletron = setInterval(function() {
		animateScreen(asteroids, shots);
	}, delta_time);

});
