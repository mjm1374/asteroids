// Input controls  ---------------------------------------------------------------------//

if (lifeCnt > 0) {
	document.onkeydown = function (e) {
		if (inPlay == true) {
			spaceshipSvg.style.opacity = 1;
			var key = e.key;
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
				case 13: //s = shoot
					startover.blur();
					pewpew();
					resetGun = false;
					break;
				case 32: // enter = hyperspace
					hyperspace();
					break;
				case 8:
					boom();
					break;
				case 46:
					boom();
					break;
			}
		}
	};

	document.onkeyup = function (e) {
		var key = e.key;
		switch (key) {
			case 65: //a = yaw left
				turn = 0;
				turnSnd.reset();
				break;
			case 68: //d = yaw right
				turn = 0;
				turnSnd.reset();
				break;
			case 87: //w = forward
				thrust = 0;
				break;
			case 83: //s = backward
				thrust = 0;
				break;
			case 13:
				//endpew();
				resetGun = true;
				break;
		}
	};

	// mobile controls   --------------->

	document.addEventListener('touchstart', (e) => {
		spaceshipSvg.style.opacity = 1;
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

	document.addEventListener('touchend', (e) => {
		var key = e.target.id;
		switch (key) {
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
