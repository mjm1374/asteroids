// one AG-2G quad laser cannon - must install more
/**
 * start the creation of the shot
 */
function pewpew() {
    if (lifeCnt > 0 && resetGun == true && inPlay == true) {
        shootSnd.play();
        makeShot();
        resetGun = false;
    }
}

/**
 * Create the shot
 */
function makeShot() {
    shotCnt++;
    shots.push(new Shot(shotCnt, spaceship.x + (spaceship.width / 2), spaceship.y + (spaceship.height / 2), spaceship.vx, spaceship.vy, spaceship.theta, spaceship.yaw, 1800, 0, 0));
    makeshotSVG(shotCnt, 'spaceshipShot', '#f00');
}

/**
 * 
 * @param {*} id - int - the id of the shot to map to 
 * @param {*} indenity - string -  the team of the shot, options: shot or ufoShot
 * @param {*} color - string -  a hex or css color
 */
function makeshotSVG(id, indenity, color) {
    var newShot = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    newShot.setAttribute('id', `${indenity}${id}`);
    newShot.setAttribute('data-id', id);
    newShot.setAttribute('class', `${indenity}`);
    newShot.setAttribute('height', 6);
    newShot.setAttribute('width', 6);

    let shotPath = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    shotPath.setAttribute("cx", 3);
    shotPath.setAttribute("cy", 3);
    shotPath.setAttribute("r", 10);
    shotPath.setAttribute("stroke", '#fff');
    shotPath.setAttribute("stroke-width", 1);
    shotPath.setAttribute("fill", color);

    newShot.appendChild(shotPath);
    document.body.appendChild(newShot);
}

/**
 *
 * @param {*} team - string
 * @param {*} idx - int
 */
function clearBullet(team, idx) {
    if (team == "ufo") {
        clearDomItem(`ufoShip${ufoShots[idx].id}`);
        ufoShots.splice(idx, 1);
    } else {
        clearDomItem(`spaceshipShot${shots[idx].id}`);
        shots.splice(idx, 1);
    }
}