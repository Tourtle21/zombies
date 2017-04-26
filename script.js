var keyState = [];
document.addEventListener("keydown", (e) => {keyState[e.code] = true})
document.addEventListener("keyup", (e) => {keyState[e.code] = false})
var game;
var character;
var characterLeft = 0
var characterTop = 0
var gameWidth = 800;
var gameHeight = 800;
var characterWidth = 50;
var characterHeight = 50;
var speed = 5;
var started = false;
var health = 100;
var zombieCount = 1;
var waitingTime = 11;

var zombieSize = 50;
var zombiesLeft = [];
var zombiesTop = [];
var zombiesDirectionX = [];
var zombiesDirectionY = [];
var zombieSpeed = 3;
var alive = true;

var ranged = false;

spawnerPositionsX = [gameWidth / 2];
spawnerPositionsY = [-50];

var backgroundLeft = window.innerWidth / 2 - characterWidth/2;
var backgroundTop = window.innerHeight / 2 - characterHeight/2;

document.getElementById("character").style.width = characterWidth + "px";
document.getElementById("character").style.height = characterHeight + "px";
document.getElementById("game").style.width = gameWidth + "px";
document.getElementById("game").style.height = gameHeight + "px";
document.getElementsByClassName("healthBar")[0].style.width = health + "%";
for (var i = 0; i < 6; i++) {
  spawner = document.getElementsByClassName("spawner")[i];
  spawner.style.left = "-50px";
  spawner.style.top = "-50px";
}

setInterval(function() {
  game = document.getElementById("game");
  character = document.getElementById("character");
  if (keyState["KeyA"] && characterLeft > 0) { //left
    backgroundLeft += speed;
    characterLeft -= speed;
  }
  if (keyState["KeyD"] && characterLeft < gameWidth - characterWidth) { //right
    backgroundLeft -= speed;
    characterLeft += speed;
  }
  if (keyState["KeyW"] && characterTop > 0) { //up
    backgroundTop += speed;
    characterTop -= speed;
  }
  if (keyState["KeyS"] && characterTop < gameHeight - characterHeight) { //down
    backgroundTop -= speed;
    characterTop += speed;
  }
  if (characterLeft < 0) {
    characterLeft = 0;
    backgroundLeft = window.innerWidth / 2 - characterWidth/2
  }
  if (characterLeft > gameWidth - characterWidth) {
    characterLeft = gameWidth - characterWidth;
    backgroundLeft = window.innerWidth / 2 - characterWidth/2 - gameWidth;
  }
  if (characterTop < 0) {
    characterTop = 0;
    backgroundTop = window.innerHeight / 2 - characterHeight/2;
  }
  if (characterTop > gameHeight - characterHeight) {
    characterTop = gameHeight - characterHeight;
    backgroundTop = window.innerHeight / 2 - characterHeight/2 - gameHeight;
  }
  if (!checkCollision([0, 0, 500, 500]) && !started) {
    started = true;
    document.getElementsByClassName("health")[0].style.display = "block";
    document.getElementById("score").style.display = "block";
    document.getElementById("game").removeChild(document.getElementById("starting"));
    countDown();
  }
  document.getElementsByClassName("healthBar")[0].style.width = health + "%";
  if (health <= 30) {
    document.getElementsByClassName("healthBar")[0].style.background = "red";
  } else if (health <= 50) {
    document.getElementsByClassName("healthBar")[0].style.background = "#FFDC04";
  } else {
    document.getElementsByClassName("healthBar")[0].style.background = "#0DBF00";
  }

  if (document.getElementsByClassName("zombie").length > 0 && alive) {
    moveZombies();
    zombieCollision();
  }
  if (health == 0) {
    zombie = document.createElement("div");
    zombie.className = "zombie";
    zombie.style.height = zombieSize + "px";
    zombie.style.width = zombieSize + "px";
    zombie.style.background = "#1B7F00";
    zombie.style.borderRadius = "50%";
    zombie.style.position = "absolute";
    zombie.style.left = characterLeft + "px";
    zombie.style.top = characterTop + "px";
    zombie.innerHTML = "<div class='health'><div class='healthBar zombieType'></div></div>"
    zombiesLeft.push(-zombieSize);
    zombiesTop.push(-zombieSize);
    zombiesDirectionX.push(0);
    zombiesDirectionY.push(0);
    document.getElementById("game").append(zombie);
    document.getElementById("game").removeChild(document.getElementById("character"));
    alive = false;
    health = 100;
    speed = 20;
  }
  if (ranged) {
    document.getElementsByClassName("arrow")[0].style.left = characterLeft + characterWidth/2 - 2 + "px";
    document.getElementsByClassName("arrow")[0].style.top = characterTop + characterWidth/2 + "px";
  }
  game.style.left = backgroundLeft + "px";
  game.style.top = backgroundTop + "px";
  character.style.left = characterLeft + "px";
  character.style.top = characterTop + "px";
}, 50)

window.addEventListener("resize", function(e) {
  movedLeft = characterLeft - (window.innerWidth / 2 - characterWidth/2 - backgroundLeft)
  movedTop = characterTop - (window.innerHeight / 2 - characterHeight/2 - backgroundTop)
  backgroundLeft -= movedLeft;
  backgroundTop -= movedTop;
})

function checkCollision(list) {
  itemLeft = list[0];
  itemRight = list[2];
  itemTop = list[1];
  itemBottom = list[3];
  characterRight = characterLeft + characterWidth;
  characterBottom = characterTop + characterHeight;
  if (characterRight >= itemLeft && characterLeft <= itemRight && characterTop <= itemBottom && characterBottom >= itemTop) {
    return true;
  }
}

function countDown() {
  amount = 0;
  document.getElementById("countDown").style.display = "block";
  count = setInterval(function() {
    if (amount == 0) {
      document.getElementById("countDown").innerHTML = "Zombies spawn in ..."
      amount += 1;
    } else {
      document.getElementById("countDown").innerHTML = waitingTime - amount
      amount += 1;
      if (waitingTime - amount == -2) {
        document.getElementById("countDown").style.display = "none";
        clearInterval(count);
        spawnZombies();
      }
    }
  }, 1000);
}

function spawnZombies() {
  for (var i = 0; i < zombieCount; i++) {
    zombie = document.createElement("div");
    zombie.className = "zombie";
    zombie.style.height = zombieSize + "px";
    zombie.style.width = zombieSize + "px";
    zombie.style.background = "#1B7F00";
    zombie.style.borderRadius = "50%";
    zombie.style.position = "absolute";
    zombie.style.left = -zombieSize + "px";
    zombie.style.top = -zombieSize + "px";
    zombie.innerHTML = "<div class='health'><div class='healthBar zombieType'></div></div>"
    zombiesLeft.push(-zombieSize);
    zombiesTop.push(-zombieSize);
    zombiesDirectionX.push(0);
    zombiesDirectionY.push(0);
    document.getElementById("game").append(zombie);
  }
}
function moveZombies() {
  for (var i = 0; i < document.getElementsByClassName("zombie").length; i++) {
    newZombie = document.getElementsByClassName("zombie")[i];
    var x1 = zombiesLeft[i] + zombieSize/2;
    var y1 = zombiesTop[i] + zombieSize/2;
    var x2 = characterLeft + characterWidth/2;
    var y2 = characterTop + characterWidth/2;

    moveLeft = x2 - x1;
    moveTop = y2 - y1;

    distance = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
    zombiesDirectionX[i] = moveLeft / distance * zombieSpeed
    zombiesDirectionY[i] = moveTop / distance * zombieSpeed;
    zombiesLeft[i] += zombiesDirectionX[i];
    zombiesTop[i] += zombiesDirectionY[i];

    newZombie.style.left = zombiesLeft[i] + "px";
    newZombie.style.top = zombiesTop[i] + "px";
  }
}
function zombieCollision() {
  for (var i = 0; i < document.getElementsByClassName("zombie").length; i++) {
    newZombie = document.getElementsByClassName("zombie")[i];
    var r1 = zombieSize / 2;
    var r2 = characterWidth / 2;
    var x1 = zombiesLeft[i] + r1;
    var y1 = zombiesTop[i] + r1;
    var x2 = characterLeft + r2;
    var y2 = characterTop + r2;

    if ((x2-x1)**2 + (y1-y2)**2 <= (r1+r2)**2) {
      characterLeft += Math.floor(zombiesDirectionX[i] * 10);
      characterTop += Math.floor(zombiesDirectionY[i] * 10);
      backgroundLeft -= Math.floor(zombiesDirectionX[i] * 10);
      backgroundTop -= Math.floor(zombiesDirectionY[i] * 10);
      if (characterLeft < 0) {
        characterLeft = 0;
        backgroundLeft = window.innerWidth / 2 - characterWidth/2;
      }
      if (characterLeft > gameWidth - characterWidth) {
        characterLeft = gameWidth - characterWidth;
        backgroundLeft = window.innerWidth / 2 - characterWidth/2 - gameWidth
      }
      if (characterTop < 0) {
        characterTop = 0;
        backgroundTop = window.innerHeight / 2 - characterHeight/2;
      }
      if (characterTop > gameHeight - characterHeight) {
        characterTop = gameHeight - characterHeight;
        backgroundTop = window.innerHeight / 2 - characterHeight/2 - gameHeight;
      }
      health -= 5;
    }
  }
}
// document.addEventListener("click", function(e) {
//   if (alive) {
//     shoot();
//   }
// })
function shoot() {
  bullet = document.createElement("div");
  bullet.className = "bullet";
  bullet.style.height = "3px";
  bullet.style.width = "3px";
  bullet.style.background = "black";
  bullet.style.borderRadius = "50%";
  bullet.style.position = "absolute";
  bullet.style.left = characterLeft + characterWidth/2 + "px";
  bullet.style.top = characterTop + characterWidth/2 + "px";
  document.getElementById("game").append(bullet);
}
document.getElementById("ranged").addEventListener("click", function() {
  arrow = document.createElement("div");
  arrow.className = "arrow";
  arrow.style.height = "40px";
  arrow.style.width = "4px";
  arrow.style.background = "saddleBrown";
  arrow.style.position = "absolute";
  arrow.style.zIndex = "-1";
  arrow.style.transformOrigin = "top";
  document.getElementById("game").append(arrow);
  degrees = 0;
  ranged = true;
  document.body.removeChild(document.getElementById("chooseClass"))
  document.addEventListener("mousemove", function(e) {
    mouseX = e.clientX - window.innerWidth / 2 + characterWidth/2;
    mouseY = e.clientY - window.innerHeight / 2 + characterWidth/2;
    newX = mouseX - (characterLeft + characterWidth/2);
    newY = (characterTop + characterWidth / 2) - mouseY;
    if (newX > 0 && newY >= 0) {
      angle = newY/newX
      console.log(Math.atan(angle) * (180 / Math.PI))
      // console.log(angle);
    }

  })
})
document.getElementById("warrior").addEventListener("click", function() {
  setInterval(function() {
  })
  document.body.removeChild(document.getElementById("chooseClass"))
})
document.getElementById("builder").addEventListener("click", function() {
  setInterval(function() {
  })
  document.body.removeChild(document.getElementById("chooseClass"))
})
