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
var waitingTime = 1;

var zombieSize = 50;
var zombiesLeft = [];
var zombiesTop = [];
var zombiesDirectionX = [];
var zombiesDirectionY = [];
var zombieSpeed = 3;

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
  spawner.style.left = spawnerPositionsX[i];
  spawner.style.top = spawnerPositionsY[i];
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
  if (!checkCollision([0, 0, 50, 50]) && !started) {
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

  if (document.getElementsByClassName("zombie").length > 0) {
    moveZombies();
    zombieCollision();
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
    var x1 = zombiesLeft[i];
    var y1 = zombiesTop[i];
    var x2 = characterLeft;
    var y2 = characterTop;

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
    var x1 = zombiesLeft[i];
    var y1 = zombiesTop[i];
    var x2 = characterLeft;
    var y2 = characterTop;
    var r1 = zombieSize / 2;
    var r2 = characterWidth / 2;

    if ((x2-x1)**2 + (y1-y2)**2 <= (r1+r2)**2) {
      characterLeft += zombiesDirectionX[i] * 10;
      characterTop += zombiesDirectionY[i] * 10;
      backgroundLeft -= zombiesDirectionX[i] * 10;
      backgroundTop -= zombiesDirectionY[i] * 10;
      health -= 5;
    }
  }
}
