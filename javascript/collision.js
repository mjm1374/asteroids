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
    //var isHit = false;
    //console.log("astro length: ",a.length);

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
    //var isHit = false;
    //console.log("astro length: ",a.length);

    if ((((a.y + a.height) < (b.y)) ||
            (a.y > (b.y + b.height)) ||
            ((a.x + a.width) < b.x) ||
            (a.x > (b.x + b.width))) == false) {
        //console.log("boom");
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
        //console.log("boom");
        blowupUfo(a, i);
        ufoActive = false;
        return true;

    }
}



//this does not work with different svg's
function checkPathTouch(obj) {
    var a = spaceship;
    var b = obj;
    var shape1 = [];
    var shape2 = [];

    for (i = 0; i < a.getTotalLength(); i = i + 1) {
        shape1.push(a.getPointAtLength(i));
        //console.log(myElem1.getPointAtLength(i));
    }

    for (i = 0; i < b.getTotalLength(); i = i + 1) {
        shape2.push(b.getPointAtLength(i));
        //console.log(myElem1.getPointAtLength(i));
    }

    for (i = 0; i < shape1.length; i++) {
        var testx = Math.floor(shape1[i].x);
        var testy = Math.floor(shape1[i].y);
        for (j = 0; j < shape2.length; j++) {
            //console.log("x:" + testx);
            if (testx == Math.floor(shape2[j].x) && testy == Math.floor(shape2[j].y)) {
                console.log(Math.floor(shape2[j].x) + "- " + Math.floor(shape2[j].y));
                boom();
                break;
            }

        }

    }
}


//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/math/is-point-in-poly [rev. #0]
//Not used yet, want to see if this can be used for collision detection closer than bounding box

// function isPointInPoly(poly, pt) {
// 	for (var c = false, i = -1, l = poly.length, j = l - 1; ++i < l; j = i)
// 		((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) &&
// 		(pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) &&
// 		(c = !c);
// 	return c;
// }