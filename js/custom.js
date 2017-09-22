var canvas = document.getElementById('canvas'),
context = canvas.getContext('2d');

var bgImg = document.getElementById('bg');
var ballx = canvas.width/2;
var ballY = canvas.height/2;
var ballySpeed = 8;
var ballxSpeed = 7;
var player1Y = 250;
var player2Y = 250;
var winning_score = 3;
const paddel_thickness = 10;
const Paddle_Height = 100;
var player1score = 0;
var player2score = 0;
var showing_winscreen = false;
var r = 20;
var playAnimate = true;
var stopAnimate = false;

// mouse position calculation
function calculateMousePos(ev){
  var rect = canvas.getBoundingClientRect();
  var root = document.documentElement;
  var mouseX = ev.clientX - rect.left - root.scrollLeft;
  var mouseY = ev.clientY - rect.top - root.scrollTop;
  return {
    x : mouseX,
    y : mouseY
  }
}

// movement of ball
function moveEverything(){


  if(showing_winscreen){
    return;

  }

  ballx = ballx + ballxSpeed;

  if(ballx-r < 0){
    if(ballY+r > player1Y && ballY-r < player1Y + Paddle_Height){
      ballxSpeed = -ballxSpeed;
      var detaY = ballY - (player1Y + Paddle_Height/2);
      ballySpeed = detaY * .12;
      var triggerSound = new sound('sound/tong.mp3');
      triggerSound.play();
    }
    else{
      var boo = new sound('sound/boo.mp3');
      boo.play();
      player2score++;
      ballReset();
    }
  }

  if(ballx+r > canvas.width){
    if(ballY+r > player2Y && ballY < player2Y-r + Paddle_Height){
      ballxSpeed = -ballxSpeed;
      var detaY = ballY - (player2Y+Paddle_Height/2);
      ballySpeed = detaY * .12;
      var triggerSound = new sound('sound/tong.mp3');
      triggerSound.play();
    }
    else{
      var boo = new sound('sound/boo.mp3');
      boo.play();
      player1score++;
      ballxSpeed = -ballxSpeed;
      ballySpeed = -ballySpeed;
      ballReset();
    }
  }

  ballY = ballY + ballySpeed;

  if(ballY-r < 0){
    ballySpeed = -ballySpeed;
  }
  if(ballY+r > canvas.height){
    ballySpeed = -ballySpeed;
  }
}
// add sound
function sound(src) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
    this.play = function(){
        this.sound.play();
    }
    this.stop = function(){
        this.sound.pause();
    }
}

//computer movement
function computerMovement(){
  var paddle2_center = player2Y + (Paddle_Height/2);
  if(paddle2_center < ballY-15){
    player2Y += 6;
  }
  else if(paddle2_center > ballY+15){
    player2Y -= 6;
  }
}

// all drawings
function drawEverything(){

  drawRect(0, 0, canvas.width, canvas.height, 'black');
  // var img = new Image();
  // img.src = "images/bg.jpg";
  context.drawImage(bgImg, 0, 0, canvas.width, canvas.height );

  //draw list
  context.beginPath();
  //context.setLineDash([4, 5]);
  context.moveTo(canvas.width/2, 0);
  context.lineTo(canvas.width/2, canvas.height);
  context.strokeStyle = "#2C96AE";
  context.lineWidth=10;
  context.shadowOffsetX = 4;
  context.shadowOffsetY = 4;
  context.shadowBlur    = 7;
  context.shadowColor   = "black";
  context.closePath();
  context.fill();
  context.stroke();

  // paddle 1
  drawRect(0, player1Y, paddel_thickness, Paddle_Height, 'red');

  // var texture = new Image();
  // texture.src = "images/texture.png";
  // context.drawImage(texture, 0, player1Y, 400, Paddle_Height );

  //paddle 2
  drawRect(canvas.width-paddel_thickness, player2Y, paddel_thickness, Paddle_Height, 'green');

  context.fillStyle = 'white';
  context.beginPath();
  context.arc(ballx, ballY, r, 0, Math.PI*2, true);
  context.fill();

  // var football = new Image();
  // football.src = "images/football.png";
  // context.drawImage(football, ballx, ballY, r, r );
}

// All drawing texts goes here

function drawText(){
  if(showing_winscreen){
    context.fillStyle = 'white';
    if(player1score >= winning_score){
      context.font = "20px Verdana";
      context.fillText('Winner', 200, 50);
      var me = new Image();
      me.src = "images/mum.png";
      context.drawImage(me, 100, 80, 300, 450 );
    }
    else if(player2score >= winning_score){
      context.font = "20px Verdana";
      context.fillText('Winner', 650, 50);
      var me = new Image();
      me.src = "images/computerCharacter.png";
      context.drawImage(me, (canvas.width/2 + 50), 50, 300, 450 );
    }

      context.font = "25px Verdana";
      context.fillText('Click to continue', (canvas.width/2 - 110), 400);
      ballx = canvas.width/2;
      ballY = canvas.height/2;
      return;
    }
    context.font = "20px Verdana";
    context.fillText(player1score, 100, 100);
    context.font = "20px Verdana";
    context.fillText(player2score, canvas.width-100, 100);
}


function drawRect(leftX, topY, width, height, drawColor){
  context.fillStyle = drawColor;
  context.fillRect(leftX, topY, width, height);
}

// function drawEveryImg(imgSrc, leftX, topY, width, height){
//   var img = new Image();
//   img.src = imgSrc;
//   context.drawImage(imgSrc, leftX, topY, width, height);
//   console.log(imgSrc);
// }

function ballReset(){
  if(player1score >= winning_score || player2score >= winning_score){
    showing_winscreen = true;
    var finishSound = new sound('sound/applause.mp3');
    finishSound.play();
    playAnimate = false;
  }
  var ballySpeed = 6;
  var ballxSpeed = 5;

  ballx = canvas.width/2;
  ballY = canvas.height/2;

}

function handleMouseClick(ev){
  if(playAnimate){
    animate();
  }
  if(showing_winscreen){
    player1score = 0;
    player2score = 0;
    showing_winscreen = false;
    ballReset();
  }

}

// animate things.

drawEverything();
function animate(){
      context.clearRect(0, 0, canvas.width, canvas.height);
      drawEverything();
      drawText();
      requestAnimationFrame(animate);
      moveEverything();
      computerMovement();
}



// click event

document.getElementById('canvas').addEventListener('click', function(){
    document.querySelector('.start').style.display = "none";
})

canvas.addEventListener('mousedown', handleMouseClick);

//mouse move event

canvas.addEventListener('mousemove', function(ev){
  var mousePos = calculateMousePos(ev);
  player1Y = mousePos.y - (Paddle_Height/2);
});
