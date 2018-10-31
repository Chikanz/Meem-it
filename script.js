//init
var daddy = document.querySelector('.scene');
var bigdaddy = document.querySelector('#tridiv');

bigdaddy.addEventListener("click", checkTarget);
bigdaddy.addEventListener("mousemove", rotate);

//Rotate vars
var angleX = 0;
var angleY = 0;

//Game vars
var score = 0;
var currentTarget = 0;

var timerDecrease = 250;
var TimeToBop = 5000;
var timer = TimeToBop;

function rotate(event) {
    var w = window.innerWidth;
    var h = window.innerHeight;

    var mouseX = event.pageX;
    var mouseY = event.pageY;

    var ratioH = mouseX / w;
    var ratioV = mouseY / h;

    angleX = -ratioV * 360 - 180;
    angleY = ratioH * 360 - 180;

    document.querySelectorAll(".debug")[0].innerHTML = angleX;
    document.querySelectorAll(".debug")[1].innerHTML = angleY;

    daddy.setAttribute("style", "transform: rotateX( " + angleX + "deg ) rotateY( " + angleY + "deg );");
}


var tolerance = 30 / 2;
class target {
    constructor(X, Y, sound, callSound) {
        this.xmin = X - tolerance;
        this.xmax = X + tolerance;
        this.ymin = Y - tolerance;
        this.ymax = Y + tolerance;
        this.sound = sound;
        this.callSound = callSound;
    }
}

titles = 
[
    'red', //'spook it',
    'blue', //'play it',
    'yellow', //'meme it',
    'green', //'yellow it',
]

var targets =
    [
        new target(90, -360, "oof.wav"),     //Red
        new target(-90, -360, "bop.wav"),   //Blue
        new target(0, -450, "bop.wav"),     //yellow (top)
        new target(0, -270, "bop.wav"),     //green (bottom)
    ]

function checkTarget(event) 
{
    if(currentTarget == -1) return;

    //lol
    var y = angleX;
    var x = angleY;

    var t = targets[currentTarget];

    if (x > t.xmin && x < t.xmax && y > t.ymin && y < t.ymax) //target check
    {
        score++; 
        document.querySelectorAll(".debug")[2].innerHTML = score;

        timer = 99999999; //Let player relax until next target is called
        setTimeout(newTarget, getRandomInt(5000));
        currentTarget = -1;
    }
}



function newTarget()
{
    currentTarget = getRandomInt(targets.length);

    //call out sound here

    document.querySelector(".instruction").innerHTML = titles[currentTarget];

    if(TimeToBop > 1) TimeToBop -= timerDecrease;
    timer = TimeToBop;

}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

var runGame = true;
const intervaltime = 100;

gameStart();
function gameStart()
{
    runGame = true;
    newTarget();
    setTimeout(gameLoop, intervaltime);
}

function gameLoop()
{
    timer -= intervaltime;
    document.querySelectorAll(".debug")[3].innerHTML = timer;

    if(timer <= 0)
        runGame = false;

    if(runGame)
        setTimeout(gameLoop, intervaltime);
}

