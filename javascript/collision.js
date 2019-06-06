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

function isHit(obj) {
    var a = asteroids;
    var b = obj;

    for (i = 0; i < a.length; i++) {
        // console.log("iu: ", a[i].exists);
        if ((((a[i].y + a[i].height) < (b.y)) ||
                (a[i].y > (b.y + b.height)) ||
                ((a[i].x + a[i].width) < b.x) ||
                (a[i].x > (b.x + b.width))) == false) {
            //console.log("boom");
            blowupAsteroid(a[i], i);
            return true;
        }
    }
}


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

function isUfoHit(obj) {
    var a = ufo;
    var b = obj;

    if ((((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))) == false) {
        blowupUfo(a, i);
        ufoActive = false;
        return true;
    }
}