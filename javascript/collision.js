/**
 * Check to see if Obj is in contact with Spaceship
 * @param {*} obj -  the current object under inspection 
 */
function inCollision(obj) {
    var a = spaceship;
    var b = obj;
    return !(
        ((a.y + a.height) < (b.y)) ||
        (a.y > (b.y + b.height)) ||
        ((a.x + a.width) < b.x) ||
        (a.x > (b.x + b.width))
    );
}

/**
 * when an object is confirmed thats its in contact with another object (spaceship, ufo or bullet)
 * @param {*} obj - the current object under inspection
 */
function isHit(obj) {
    var a = asteroids;
    var b = obj;

    for (let i = 0; i < a.length; i++) {
        // console.log("iu: ", a[i].exists);
        if ((((a[i].y + a[i].height) < (b.y)) ||
                (a[i].y > (b.y + b.height)) ||
                ((a[i].x + a[i].width) < b.x) ||
                (a[i].x > (b.x + b.width))) == false) {
            //console.log("boom");
            console.log(b);
            blowupAsteroid(a[i], i, b.id);
            return true;
        }
    }
}

/**
 * Spaceship is hit
 * @param {*} obj - the current object in contact with spaceship
 */
function isSpaceshipHit(obj) {
    var a = spaceship;
    var b = obj;

    if ((((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))) == false) {
        boom();
        ufoActive = false;
        return true;
    }
}
/**
 * The UFO is hit
 * @param {*} obj - the object in contact with teh UFO
 */
function isUfoHit(obj) {
    var a = ufo;
    var b = obj;

    if ((((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))) == false) {
        blowupUfo(a);
        ufoActive = false;
        return true;
    }
}