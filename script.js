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
var waitingTime = 5;

var zombieSize = 50;
var zombiesLeft = [];
var zombiesTop = [];
var zombiesDirectionX = [];
var zombiesDirectionY = [];
var zombieHealths = [];
var zombieSpeed = 3;
var alive = true;

var mouseDown = false;
var ranged = false;
var reloaded = false;
var reloadTime = 100;
var arrowDistance = 10;
var amountReloaded = 0;
var arrowSpeed = 20;
var arrowAngle = 0;
var addedAmount = 0;
var arrowDX = 0;
var arrowDY = 0;
var arrowLeft = 0;
var arrowTop = 0;
var arrowsDX = [0];
var arrowsDY = [0];
var arrowsLeft = [0];
var arrowsTop =  [0];
var addedAmounts = [0];
var arrowsDistance = [0];


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
    if (mouseDown && amountReloaded != reloadTime) {
      amountReloaded += 1;
      arrowSpeed += 1;
      document.getElementById("loadAmount").style.width = Math.round(amountReloaded/ reloadTime * 100) + "%";
    }
    document.getElementsByClassName("arrow")[0].style.left = characterLeft + characterWidth/2 - 2 + "px";
    document.getElementsByClassName("arrow")[0].style.top = characterTop + characterWidth/2 + "px";
    arrowLeft = characterLeft + characterWidth/2;
    arrowTop = characterTop + characterWidth/2;
  }
  if (document.getElementsByClassName("arrow").length > 1) {
    allArrows = document.getElementsByClassName("arrow");
    allPointers = document.getElementsByClassName("pointer");
    for (var i = 1; i < allArrows.length; i++) {
      arrowsDistance[i] += 1;
      arrowsLeft[i] += arrowsDX[i];
      arrowsTop[i] += arrowsDY[i];
      allArrows[i].style.left = arrowsLeft[i] + "px";
      allArrows[i].style.top = arrowsTop[i] + "px";
      if (arrowsDX[i] > 0) {
        allPointers[i].style.left = (arrowsDX[i]) * 2 + (arrowsLeft[i] - 2) + addedAmounts[i] + "px";
      } else {
        allPointers[i].style.left = (arrowsDX[i]) * 2 + (arrowsLeft[i] - 2) - addedAmounts[i] + "px";
      }
      if (arrowsDY[i] > 0) {
        allPointers[i].style.top = (arrowsDY[i]) * 2 + (arrowsTop[i] - 2) + addedAmounts[i] + "px";
      } else {
        allPointers[i].style.top = (arrowsDY[i]) * 2 + (arrowsTop[i] - 2) - addedAmounts[i] + "px";
      }
      checkArrowCollision(allPointers[i], i);
      if (arrowsDistance[i] >= arrowDistance) {
        arrowsDX.splice(i, 1);
        arrowsDY.splice(i, 1)
        arrowsLeft.splice(i, 1)
        arrowsTop.splice(i, 1);
        addedAmounts.splice(i, 1)
        arrowsDistance.splice(i, 1);
        document.getElementById("game").removeChild(document.getElementsByClassName("arrow")[i])
      }
    }
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
    zombieHealths.push(100);
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
function checkArrowCollision(item, index) {
  for (var i = 0; i < document.getElementsByClassName("zombie").length; i++) {
    newZombie = document.getElementsByClassName("zombie")[i];
    var r1 = zombieSize / 2;
    var r2 = 2;
    var x1 = zombiesLeft[i] + r1;
    var y1 = zombiesTop[i] + r1;
    var x2 = parseInt(item.style.left.slice(0, -2)) + r2;
    var y2 = parseInt(item.style.top.slice(0, -2)) + r2;

    if ((x2-x1)**2 + (y1-y2)**2 <= (r1+r2)**2) {
      zombiesLeft[i] += arrowsDX[index] * 5;
      zombiesTop[i] += arrowsDY[index] * 5;
      arrowsDX.splice(index, 1);
      arrowsDY.splice(index, 1)
      arrowsLeft.splice(index, 1)
      arrowsTop.splice(index, 1);
      addedAmounts.splice(index, 1)
      arrowsDistance.splice(index, 1);
      zombieHealths[i] -= 10;
      document.getElementsByClassName("zombieType")[i].style.width = zombieHealths[i] + "%";
      document.getElementById("game").removeChild(document.getElementsByClassName("arrow")[index])
      document.getElementById("game").removeChild(document.getElementsByClassName("pointer")[index])
      if (zombieHealths[i] <= 0) {
        zombiesLeft.splice(i, 1);
        zombiesTop.splice(i, 1);
        zombiesDirectionX.splice(i, 1);
        zombiesDirectionY.splice(i, 1);
        zombieHealths.splice(i, 1);
        document.getElementById("game").removeChild(document.getElementsByClassName("zombie")[i]);
      }
    }
  }
}
function shoot() {
  arrowsLeft.push(arrowLeft);
  arrowsTop.push(arrowTop);
  arrowsDX.push(arrowDX);
  arrowsDY.push(arrowDY);
  arrowsDistance.push(0);
  addedAmounts.push(addedAmount);
  arrow = document.createElement("div");
  arrow.className = "arrow";
  arrow.style.height = "40px";
  arrow.style.width = "4px";
  arrow.style.background = "saddleBrown";
  arrow.style.position = "absolute";
  arrow.style.zIndex = "-1";
  arrow.style.transformOrigin = "top";
  arrow.style.transform = "rotate("+ arrowAngle + "deg)"
  arrow.style.left = characterLeft + characterWidth/2 - 2 + "px";
  arrow.style.top = characterTop + characterWidth/2 + "px";
  document.getElementById("game").append(arrow);
  pointer = document.createElement("div");
  pointer.className = "pointer";
  pointer.style.height = "4px";
  pointer.style.width = "4px";
  pointer.style.background = "transparent";
  pointer.style.position = "absolute";
  pointer.style.borderRadius = "50%";
  pointer.style.zIndex = "5";
  pointer.style.transformOrigin = "top";
  document.getElementById("game").append(pointer);
}
document.getElementById("ranged").addEventListener("click", function() {
  document.getElementById("loadBar").style.display = "block";
  arrow = document.createElement("div");
  arrow.className = "arrow";
  arrow.style.height = "40px";
  arrow.style.width = "4px";
  arrow.style.background = "saddleBrown";
  arrow.style.position = "absolute";
  arrow.style.zIndex = "-1";
  arrow.style.transformOrigin = "top";
  pointer = document.createElement("div");
  pointer.className = "pointer";
  pointer.style.height = "4px";
  pointer.style.width = "4px";
  pointer.style.background = "transparent";
  pointer.style.position = "absolute";
  pointer.style.borderRadius = "50%";
  pointer.style.zIndex = "5";
  pointer.style.transformOrigin = "top";
  document.getElementById("game").append(pointer);
  document.getElementById("game").append(arrow);
  degrees = 0;
  ranged = true;
  document.body.removeChild(document.getElementById("chooseClass"))
  document.addEventListener("mousemove", function(e) {
    mouseX = e.clientX - window.innerWidth / 2;
    mouseY = e.clientY - window.innerHeight / 2;

    angle = mouseY/mouseX
    newAngle = Math.atan(angle) / Math.PI * 180 + 90

    if (mouseX >= 0) {
      newAngle -= 180;
    }
    arrowAngle = newAngle;
    document.getElementsByClassName("arrow")[0].style.transform = "rotate("+ newAngle + "deg)"
      reloaded = true;


      var x = mouseX;
      var y = mouseY;
      distance = Math.abs(x) + Math.abs(y);
      arrowDX = x / distance * arrowSpeed;
      arrowDY = y / distance * arrowSpeed;
      addedAmount = (20 - Math.sqrt(arrowDX ** 2 + arrowDY ** 2))
      arrowLeft = characterLeft + characterWidth/2;
      arrowTop = characterTop + characterWidth/2;
  })
  document.addEventListener("mousedown", function() {
    mouseDown = true;
  })
  document.addEventListener("mouseup", function() {
    mouseDown = false;
    shoot();
    amountReloaded = 0;
    document.getElementById("loadAmount").style.width = amountReloaded + "%";
    arrowSpeed = 0;
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
