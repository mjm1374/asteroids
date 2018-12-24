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
 newLifeTarget = 10000,
 newLife = newLifeTarget,
 resetGun = true,
	inPlay = false,
	mode = 'asteroids',
	rockCnt = 10,
 scale = 1,
 rockID = 0,//for debugging only
 nextEnemy = 20000,
 enemyDelay = 2000,
 enemyUFO = [],
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
 thrustsnd = null
 extraLifesnd = null;



//Asteroid( id, title, x, y, xv, yv, color, type, oob)
//Make me some asteroids


// MAIN ANIMATION LOOP -----------------------------------------------------------------------------------------

function animateScreen(obj, shots) {
 console.log("play: ",inPlay);
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


 for (var idx in shots) {
  var thisVX = (Math.cos(shots[idx].theta * Math.PI/180) * 10 + shots[idx].x);
  var thisVY = (Math.sin(shots[idx].theta * Math.PI/180) * 10 + shots[idx].y);
  var thisLife = shots[idx].life - 5;

  shots[idx].changeLife(thisLife);
   if(shots[idx].life < 0){
    clearBullet(idx);
   } else{
    shots[idx].changePosition(thisVX,thisVY);
    //console.log(idx, shots[idx].vx, shots[idx].vy
    $('#shot' + shots[idx].id).css('left', shots[idx].x).css('top', shots[idx].y); // paint the shot

    if(isHit(shots[idx])){
     clearBullet(idx);
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

function playExtraLife(){
 for (i=0; i < 9; i++){
  setTimeout(function(){ extraLifesnd.play(); }, 500);

 }
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
		spaceship = new Spaceship((xLimit / 2), (yLimit / 2), 0, 0, -90, 0, 0, 0);
  inPlay = true;

   //while (safeSpawn() == false || safeSpawn() == null){
   //  inPlay = true;
   //}



	} else {
  inPlay = false;
  //$('*').css('cursor','default'); // clear cursor
		$('#spaceship').hide();
		$('#gameOverBoard').css('display', 'block');
  checkHighScoreCookie();
	}

}

function safeSpawn(){
 var a = asteroids;
 var b = spaceship;

 for (i=0;i < a.length;i++){
 // console.log("iu: ", a[i].exists);
  if((((a[i].y + a[i].height) < (b.y) -50) ||
        (a[i].y > (b.y + b.height + 50)) ||
        ((a[i].x + a[i].width) < b.x + 50) ||
        (a[i].x > (b.x + b.width) + 50)) == false){

   return true;
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
	if (lifeCnt > 0 && resetGun == true && inPlay ==  true) {
  shootsnd.play();
  makeShot();
  resetGun = false;
	}
}


 function spawnEnemy(){
  ufo = new Ufo(-100,-100,0,0,0,0,200);
  var startX = (Math.random() - 0.5) * xLimit;
  var endX = (Math.random() - 0.5) * xLimit;
  var startY = -yLimit / 2 - ufo.y / 2;
  var endY = -startY;
  console.log('enemy ship');
 }



function resetgame(){
 $("#gameOverBoard").hide();
 //$('*').css('cursor','none'); // clear cursor
 $(".asteroid").remove();
 lifeCnt = 3;
 jumpCnt = 3;
 score = 0;
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






// Kick it off!


$(document).ready(function() {
$('*').css('cursor','default'); // clear cursor
shootsnd = new Sound('snd/fire.mp3');
thrustsnd = new Sound('snd/thrust.mp3');
extraLifesnd = new Sound('snd/extraShip.ogg');

 resetgame();





// show instructions for desktop
if(xLimit > 768){
 inPlay = false;
	$('#welcomeModel').modal('show');

 $('#welcomeModel').on('hidden.bs.modal', function (e) {
inPlay = true;
$('*').css('cursor','none'); // clear cursor
});

}



	//kick off animation
	var startBubbletron = setInterval(function() {
		animateScreen(asteroids, shots);
  nextEnemy = setTimeout(spawnEnemy(), enemyDelay);
	}, delta_time);

});
