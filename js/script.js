//init
var daddy = document.querySelector('.scene');
var bigdaddy = document.querySelector('#tridiv');

var ins = document.querySelector(".instruction");

bigdaddy.addEventListener("click", checkTarget);
bigdaddy.addEventListener("click", gameStart)
bigdaddy.addEventListener("mousemove", rotate);

//BGM + loop when ended (https://stackoverflow.com/questions/3273552/html5-audio-looping)
var BGM = new Audio('sound/Loopster.mp3');
BGM.addEventListener('ended', function() {
    this.currentTime = 0;
    this.play();
}, false);

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
    strokeWidth: 10,
    color: '#000000',
    trailColor: '#eee',
    trailWidth: 5,
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


var tolerance = 50 / 2;
class target {
    constructor(name, selector, X, Y, Xstart, YStart, XAnim, YAnim) 
    {
        this.name = name; //name for sound clips + images
        this.selector = selector; //face selector

        //Calc bounds from tolerance
        this.xmin = X - tolerance;
        this.xmax = X + tolerance;
        this.ymin = Y - tolerance;
        this.ymax = Y + tolerance;

        this.audio = new Audio('sound/' + name + '.wav'); //init audio

        this.root = selector.split(" ")[0]; //root shape        

        //For the push anims
        this.Xstart = Xstart;
        this.YStart = YStart;
        this.XAnim = XAnim;
        this.YAnim = YAnim;
    }
}

var callouts =
[
    new Audio('sound/callout/borkit.wav'),
    new Audio('sound/callout/punchit.wav'),   
    new Audio('sound/callout/dootit.wav'),
    new Audio('sound/callout/playit.wav'),
]

var titles = 
[
    'Bork it!',
    'Punch it!', 
    'Doot it!',
    'Play it!',
]

var colors = 
[
    'fc9c7c',
    '7cd9fc',
    'ecd34a',
    '66e870',
]

var targets =
[
    new target("bork",".cub-2 .rt", 90, -360, -8, 0, -7, 0),  //Red 
    new target("oof",".cub-3 .lt", -90, -360,  8, 0, 7, 0),  //Blue
    new target("doot",".cub-4 .tp", 0, -450,   0, 0, 0, 1),   //Yellow
    new target("bop",".cub-4 .bm", 0, -270,    0, 0, 0, -1),   //Green
]

function checkTarget(event) 
{
    if(!runGame) return; //Don't run when game isn't active

    //lol
    var y = angleX;
    var x = angleY;

    //Check for failure
    for(var i = 0; i < targets.length; i++)
        {
            if(i == currentTarget) continue;

            var tc = targets[i];

            if (targetInBounds(tc,x,y))
            {
                gameOver();
                PressButton(tc);
            }
        }

    if(currentTarget == -1) return;

    //Check for target
    var t = targets[currentTarget];
    if (targetInBounds(t,x,y))
    {
        //Add score and update display
        score++; 
        document.querySelector(".score").innerHTML = score;

        //Let player relax until next target is called
        timer = 99999999; 
        setTimeout(newTarget, getRandomInt(5000));
        currentTarget = -1;

        //Turn off instruction
        ins.innerHTML = "";
        ins.classList.remove('shadowLine');        

        //Button anim + face change
        PressButton(t);
    }
}

function targetInBounds(t,x,y)
{
    return x > t.xmin && x < t.xmax && y > t.ymin && y < t.ymax;
}

function PressButton(t)
{
    //Press down anim
    var e = document.querySelector(t.selector.split(" ")[0]); //Get root elem
    e.setAttribute("style",getAnimString(t.XAnim, t.YAnim)) //Pushdown

    setTimeout(() => {
        e.setAttribute("style",getAnimString(t.Xstart, t.YStart)); //Back up
    }, 350);

    //Change face image
    smack(t, true);
    setTimeout(() => 
    {
       smack(t, false) 
    }, 1000);

    //Play Sound
    t.audio.play();
}

function getAnimString(x, y)
{
    return "transform:translate3D(" + x + "em, " + y + "em, 0em); transition: 0.5s";
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

    callouts[currentTarget].play();
    
    ins.innerHTML = titles[currentTarget];
    ins.classList.add('shadowLine');

    var col = score < 7 ? colors[currentTarget] : 'd3d3d3'
    ins.setAttribute("style", "background: #" + col + ";");

    if(TimeToBop > 1000) TimeToBop -= timerDecrease;
    timer = TimeToBop;
}

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
  }

function gameStart()
{
    if(runGame || !canclick) return;

    runGame = true;
    BGM.play(); //Can't auto play audio so play it here
    
    //Get high score
    var hs = window.localStorage.getItem('score')
    document.querySelector(".highscore").innerHTML = hs;

    //Reset game state
    document.querySelector(".score").innerHTML = 0;
    score = 0;
    timer = 9999;
    TimeToBop = 5000;
    setTimeout(gameLoop, intervaltime);
    newTarget();

    //Reset loading bar
    bar.stop();
    bar.animate(1);    
}

var gameover = new Audio('sound/gameover.wav');
var canclick = true;
function gameOver()
{
    runGame = false;
    canclick = false;

    gameover.play();

    document.querySelector(".instruction").innerHTML = "Game over! <br> Click to play again";
    ins.classList.add('shadowLine');

    var hs = window.localStorage.getItem('score')
    if(score > hs)
    {
        window.localStorage.setItem('score',score);
        document.querySelector(".highscore").innerHTML = hs;
    }

    ins.setAttribute("style", "background: #959595;");

    //So we don't click through game over
    setTimeout(() => {
        canclick = true;
    }, 1000);
    
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

