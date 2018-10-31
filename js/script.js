//init
var daddy = document.querySelector('.scene');
var bigdaddy = document.querySelector('#tridiv');

bigdaddy.addEventListener("click", checkTarget);
bigdaddy.addEventListener("click", gameStart)
bigdaddy.addEventListener("mousemove", rotate);

//BGM
var BGM = new Audio('sound/Loopster.mp3');

//Rotate vars
var angleX = 0;
var angleY = 0;

//Game vars
var score = 0;
var currentTarget = 0;

var timerDecrease = 250;
var TimeToBop = 5000;
var timer = TimeToBop;

var runGame = false;
const intervaltime = 100;

//countdown circle
var bar = new ProgressBar.Circle(".loader", {
    duration: 200,
    strokeWidth: 6,
    color: '#000000',
    trailColor: '#eee',
    trailWidth: 1,
    svgStyle: null
  });

  bar.set(1);

function rotate(event) {
    var w = window.innerWidth;
    var h = window.innerHeight;

    var mouseX = event.pageX;
    var mouseY = event.pageY;

    var ratioH = mouseX / w;
    var ratioV = mouseY / h;

    angleX = -ratioV * 360 - 180;
    angleY = ratioH * 360 - 180;

    daddy.setAttribute("style", "transform: rotateX( " + angleX + "deg ) rotateY( " + angleY + "deg );");
}


var tolerance = 30 / 2;
class target {
    constructor(name, selector, X, Y,) 
    {
        this.name = name;
        this.selector = selector;

        //Calc bounds from tolerance
        this.xmin = X - tolerance;
        this.xmax = X + tolerance;
        this.ymin = Y - tolerance;
        this.ymax = Y + tolerance;

        this.audio = new Audio('sound/' + name + '.wav'); //init audio
    }
}

var titles = 
[
    'bork it',
    'hit it', 
    'doot it',
    'play it',
]

var targets =
[
    new target("bork",".cub-2 .rt", 90, -360),  //Red 
    new target("oof",".cub-3 .lt", -90, -360),  //Blue
    new target("doot",".cub-4 .tp", 0, -450),   //Yellow
    new target("bop",".cub-4 .bm", 0, -270,),   //Green
]

function checkTarget(event) 
{
    if(!runGame) return;

    if(currentTarget == -1) return;

    //lol
    var y = angleX;
    var x = angleY;

    var t = targets[currentTarget];

    if (x > t.xmin && x < t.xmax && y > t.ymin && y < t.ymax) //target check
    {
        score++; 
        document.querySelector(".score").innerHTML = score;

        timer = 99999999; //Let player relax until next target is called
        setTimeout(newTarget, getRandomInt(5000));
        currentTarget = -1;

        //Turn off instruction
        document.querySelector(".instruction").innerHTML = "";

        //Sound
        t.audio.play();

        //Set face image to smasked and back again
        smack(t, true);
        setTimeout(() => {
           smack(t, false) 
        }, 1000);
    }
}

function smack(target, on)
{
    folder = on ? "on" : "off";
    var s = "url('img/"+ folder +"/"+ target.name + ".jpg')";
    document.querySelector(target.selector).style.backgroundImage  = s;
}

function newTarget()
{
    if(!runGame) return;

    currentTarget = getRandomInt(targets.length);

    //call out sound here

    document.querySelector(".instruction").innerHTML = titles[currentTarget];

    if(TimeToBop > 1) TimeToBop -= timerDecrease;
    timer = TimeToBop;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function gameStart()
{
    if(runGame) return;

    BGM.play();
    runGame = true;
    newTarget();
    setTimeout(gameLoop, intervaltime);
    document.querySelector(".score").innerHTML = 0;

    //Get high score
    var hs = window.localStorage.getItem('score')
    document.querySelector(".highscore").innerHTML = hs;

    score = 0;
    timer = 9999;
    TimeToBop = 5000;

    bar.stop();
    bar.set(1);
}

function gameOver()
{
    runGame = false;

    document.querySelector(".instruction").innerHTML = "Game over!";

    var hs = window.localStorage.getItem('score')
    if(score > hs)
    {
        window.localStorage.setItem('score',score);
        document.querySelector(".highscore").innerHTML = hs;
    }
    
}

function gameLoop()
{
    timer -= intervaltime;

    if(timer < 10000)
        bar.animate(timer/TimeToBop);
    else
        bar.animate(1);

    if(timer <= 0)
        gameOver();

    if(runGame)
        setTimeout(gameLoop, intervaltime);
}

