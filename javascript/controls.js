// Input controls  ---------------------------------------------------------------------//

if (lifeCnt > 0) {
	document.onkeydown = (evt) => {
		if (inPlay == true) {
			spaceShipSvg.style.opacity = 1;
			switch (evt.code) {
				case 'KeyD': //d = yaw left
					turn = 1.5;
					break;
				case 'KeyA': //a = yaw right
					turn = -1.5;
					break;
				case 'KeyW': //w = forward
					thrust = 1;
					break;
				case 'KeyS': //s = backward
					thrust = -1;
					break;
				case 'Enter': //s = shoot
					startOver.blur();
					pewpew();
					resetGun = false;
					break;
				case 'Space': // enter = hyperspace
					hyperspace();
					break;
				case 'KeyP': // swamp a UFO
					if (evt.ctrlKey) {
						makeUFO(true, 0.1);
					}
					break;
				case 'Backspace':
					if (evt.ctrlKey) {
						lifeCnt = 1;
						boom();
					}
					break;
				case 'Delete':
					if (evt.ctrlKey) {
						lifeCnt = 1;
						boom();
					}
					break;
			}
		}
	};

	document.onkeyup = (evt) => {
		switch (evt.code) {
			case 'KeyA': //a = yaw left
				turn = 0;
				resetSound(turnSnd);
				break;
			case 'KeyD': //d = yaw right
				turn = 0;
				resetSound(turnSnd);
				break;
			case 'KeyW': //w = forward
				thrust = 0;
				break;
			case 'KeyS': //s = backward
				thrust = 0;
				break;
			case 'Enter':
				//endpew();
				resetGun = true;
				break;
		}
	};

	// mobile controls   --------------->

	document.addEventListener('touchstart', (evt) => {
		spaceShipSvg.style.opacity = 1;
		switch (evt.target.id) {
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

	document.addEventListener('touchend', (evt) => {
		switch (evt.target.id) {
			case 'btnLeft': //d = yaw left
				turn = 0;
				turnSnd.reset();
				break;
			case 'btnRight': //a = yaw right
				turn = 0;
				turnSnd.reset();
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
