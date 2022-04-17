window.addEventListener('resize', () => {
	xLimit = resetWindowLimit('x');
	yLimit = resetWindowLimit('y');
});

/**
 * Reset the window paramameters when resized
 * @param {*} whatDim  - string, X or Y
 */
function resetWindowLimit(whatDim) {
	let newDim, newDimx, newDimy;
	newDimx = window.innerHeight;
	newDimy = window.innerHeight;
	if (whatDim == 'x') {
		newDim = window.innerWidth;
		for (let i = 0; i < asteroids.length; i++) {
			if (asteroids[i].x >= newDimx - asteroids[i].width) {
				asteroids[i].changePosition(
					newDimx - asteroids[i].width,
					newDimy - asteroids[i].height
				);
			}
		}
	} else {
		newDim = window.innerHeight;
		for (let i = 0; i < asteroids.length; i++) {
			if (asteroids[i].y >= newDimy - asteroids[i].height) {
				asteroids[i].changePosition(
					newDimx - asteroids[i].width,
					newDim - asteroids[i].height
				);
			}
		}
	}
	return newDim;
}

/**
 * Get a randome float between 2 values
 * @param {*} min - int
 * @param {*} max - int
 */
function getRandomFloat(min, max) {
	return Math.random() * (max - min) + min;
}
/**
 * set a safe randome float inside coordinates
 * @param {*} min - int
 * @param {*} max - int
 */
function getSafeRandomFloat(min, max) {
	let split = min + max / 2;
	let tempCoord = Math.random() * (max - min) + min;
	let finalCoord = 0;
	if (tempCoord >= split) {
		finalCoord = max;
	}
	return finalCoord;
}
/**
 * check for no asteroids in a radius of the spawn sight
 */
function safeSpawn() {
	let a = asteroids;
	let b = spawnBox;
	for (let i = 0; i < a.length; i++) {
		if (
			(a[i].y + a[i].height < b.y ||
				a[i].y > b.y + b.height ||
				a[i].x + a[i].width < b.x ||
				a[i].x > b.x + b.width) == false
		) {
			return true;
		}
	}
}

/**
 * Reset the game to default games start values
 */
function resetGame() {
	gameOverBoard.classList.remove('open');
	generateBG();
	startOver.blur();
	clearDomClass('asteroid');
	lifeCnt = lifeStart;
	jumpCnt = jumpStart;
	score = 0;
	newLife = newLifeTarget;
	ufoAim = ufoAimStart;
	asteroids = [];
	beatCnt = 1000;

	regenerateAsteroids();
	addSpaceShip();
	resetSpaceShip();

	if (heartBeat != null) clearInterval(heartBeat);

	if (inPlay == true && firstRun == false) {
		heartBeatSnd(beatCnt);
	}
}

/**
 * generates a random background if turned on in main.js
 */
function generateBG() {
	if (randomBG == true) {
		gameWrapper.style.cssText = `background-image:url(../img/space${Math.floor(
			getRandomFloat(1, 7)
		)}.jpg)`;
	}
}

/**
 *
 * @param {*} thisClass -  string -  what class to remove from the DOM
 */
function clearDomClass(thisClass) {
	let objectToClear = document.querySelectorAll(`.${thisClass}`);
	objectToClear.forEach((el) => document.querySelector(`#${el.id}`).remove());
}

/**
 *
 * @param {*} thisId - string -  ID of the element tp remove from the DOM
 */
function clearDomItem(thisId) {
	let el = document.getElementById(thisId);
	if (el != null) {
		el.remove();
	}
}

/**
 * update the score
 * @param {*} num  - int
 */
function pointCnt(num) {
	score = score + num;
	newLife = newLife - num;
	if (newLife < 0) {
		lifeCnt++;
		newLife = newLifeTarget + newLife;
		playExtraLife();
	}
}

/**
 * play sound for extra life
 */
function playExtraLife() {
	let extraLifesnd = new Sound('snd/extraShip.ogg');
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

/**
 *
 * @param {*} obj Object - the item to move
 * @param {*} x int -  the x value
 * @param {*} y int - the y value
 * @param {*} t int - theta , the rotational value
 */
function moveItem(obj, x, y, t) {
	if (t === undefined) t = 0;

	try {
		if (obj != null) {
			obj.style.left = `${x}px`;
			obj.style.top = `${y}px`;
			obj.style.transform = `rotate(${t}deg)`;
		}
	} catch (e) {
		console.error(e.name); // logs 'Error'
		console.error(e.message); // logs 'The message', or a JavaScript error message
		console.trace();
	}
}

/**
 * Hide the cursor when game play is happening
 */
function hideCursor() {
	if (inPlay == true && lifeCnt > 0) {
		gameWrapper.classList.add('cursorHide');
	} else {
		gameWrapper.classList.remove('cursorHide');
	}
}

/**
 * Set up the reuseable sounds
 */
function setUpSounds() {
	shootSnd = new Sound('snd/fire.mp3');
	thrustSnd = new Sound('snd/thrust.mp3');
	extraLifeSnd = new Sound('snd/extraShip.ogg');
	ufoSnd = new Sound('snd/saucerBig.mp3');
	ufoBulletSnd = new Sound('snd/laser.mp3');
	ufoBoomSnd = new Sound('snd/bangMedium.mp3');
	turnSnd = new Sound('snd/hiss.mp3');
	hyperpaceSnd = new Sound('snd/hyperspace.mp3');
	hyperSpaceFailSnd = new Sound('snd/Power-failure.mp3');
	boomSnd = new Sound('snd/boom2.mp3');
	astroBoom100Snd = new Sound('snd/bangLarge.mp3');
	astroBoom50Snd = new Sound('snd/bangMedium.mp3');
	astroBoom25Snd = new Sound('snd/bangSmall.mp3');
	saucerBigSnd = new Sound('snd/saucerBig.mp3', true);
	saucerSmallSnd = new Sound('snd/saucerSmall.ogg', true);
	beat1Snd = new Sound('snd/beat1.ogg');
	beat2Snd = new Sound('snd/beat2.ogg');
}

/**
 *
 * @param {*} dir - string -  open will enable the modal on game launch
 *
 * TODO: should pass in the modal you want to enable and seperate the display from the modal background.
 */
function modalHandler(dir) {
	if (dir === 'open') {
		modal.classList.add('open');
		modalDialog.classList.add('open');
	} else {
		modal.classList.remove('open');
		modalDialog.classList.remove('open');
		inPlay = true;
		firstRun = false;
		dialogCloseBtn.blur();
		resetGame();
	}
}

/**
 *
 * @param {*} beatCnt - int - the timing on the beat. BTW, it must go on....
 */
function heartBeatSnd(beatCnt) {
	if (soundless == false) {
		clearInterval(heartBeat);
		heartBeat = setInterval(() => {
			beat1Snd.play();
			setTimeout(() => {
				beat2Snd.play();
			}, beatCnt);
		}, beatCnt * 2);
	}
}

// localStorage ---------------------------------------------------------------------------------------

/**
 * looks to see if the highscore is set and if not sets the current score as high score on local storage.
 */
function checkHighScoreCookie() {
	let hs = localStorage.getItem('highScore-asteroids');
	let highscore = document.querySelector('#highScore').children;

	if (hs == '' || hs == undefined) {
		localStorage.setItem('highScore-asteroids', score);
		highscore[0].innerHTML = score;
	} else {
		if (hs <= score) {
			localStorage.setItem('highScore-asteroids', score);
			highscore[0].innerHTML = score;
		} else {
			highscore[0].innerHTML = hs;
		}
	}
}
