/**
 * Created by ### on 11/4/14.
 */
var boardWidth = 500;
var boardHeight = 400;
var moveSize = 50;
var highestScore = 0;
var currentScore = 0;
var livesCount = 3;
var fallingRocks = [];
var maxFallingRocks = 5;
var newRockIntervalCount = 0;

document.addEventListener('keydown', function (event) {
    if (event.keyCode == 37) {
        movePlayerLeft();
    }
    else if (event.keyCode == 39) {
        movePlayerRight();
    }
});

function initialiseGame() {
    currentScore = 0;
    livesCount = 3;
    fallingRocks = [];
    newRockIntervalCount = 0;
    updateLivesAndScore();
    var rocks = document.getElementsByClassName('rock');
    for (var i = 0; i < rocks.length; i++) {
        rocks[i].style.left = 0;
        rocks[i].style.top = 0;
        rocks[i].style.visibility = 'hidden';
    }
    var player = document.getElementById('me');
    var style = getComputedStyle(player);
    var left = style.getPropertyValue("left");
    left = left.substring(0, left.length - 2);
    var newLeft = parseInt(left) - moveSize;
    player .style.left = (boardWidth / 2 - moveSize) + 'px';
}


//this is the main function. Everything starts from here and loops until all 3 lives are lost...
function gameLoop() {
    initialiseGame();
    var gameStatus = document.getElementById('game-status');
    gameStatus.innerHTML = 'Game is playing...';
    function frame() {
        newRockIntervalCount++;
        //here we check to see if a new rock needs to be added to the board. If yes, than we call the
        //respective function to add it and show it on the board (set its visibility to visible)
        if (newRockIntervalCount == 50) { //the smaller the number, the more frequently new rocks are added (game is more difficult). 100 = 100*10 milliseconds = 1 sec
            newRockIntervalCount = 0;
            if (fallingRocks.length < maxFallingRocks) {
                addNewRock();
            }
        }
        //here if call the function that goes through all visible rocks and increments
        //their top property, making them look like they are falling
        fallRocks();
        // check finish condition
        if (livesCount < 1) {
            gameStatus.innerHTML = 'Game Over! You scored ' + currentScore + ' pts';
            if (currentScore > highestScore) {
                highestScore = currentScore;
                document.getElementById('highest-score').innerHTML = 'Current highest score: ' + highestScore + ' pts';
            }
            clearInterval(id);
        }
    }

    var id = setInterval(frame, 10) // draw every 10ms
}

function addNewRock() {
    var rocks = document.getElementsByClassName('rock');
    for (var i = 0; i < rocks.length; i++) {
        var style = getComputedStyle(rocks[i]).visibility;
        if (style == 'hidden') {
            var left = randomNumber(boardWidth - (moveSize));
            rocks[i].style.left = left + 'px';
            rocks[i].style.top = '0px';
            rocks[i].style.backgroundColor = randomColor();
            rocks[i].style.borderRadius = randomBorderRadius();
            fallingRocks.push(rocks[i]);
            rocks[i].style.visibility = 'visible';
            return;
        }
    }
}

function fallRocks() {
    for (var i = 0; i < fallingRocks.length; i++) {
        var style = getComputedStyle(fallingRocks[i]);
        var top = style.getPropertyValue('top');
        top = top.substring(0, top.length - 2);
        var newTop = parseInt(top) + 3; //the bigger the increment, the faster the fall

        if (newTop > (boardHeight - (moveSize))) {
            if (checkCollision(fallingRocks[i])) {
                livesCount = livesCount - 1;
            } else {
                currentScore += 5;
            }
            updateLivesAndScore();
            fallingRocks[i].style.visibility = 'hidden';
            fallingRocks[i].style.top = '0px';
            fallingRocks.splice(i, 1);
        } else {
            fallingRocks[i].style.top = newTop + 'px';
        }
    }
}

function checkCollision(rock) {
    var player = document.getElementById('me');
    var playerLeft = getComputedStyle(player).left;
    playerLeft = playerLeft.substr(0, playerLeft.length - 2);
    var rockLeft = getComputedStyle(rock).left;
    rockLeft = rockLeft.substr(0, rockLeft.length - 2);
    if (Math.abs(playerLeft - rockLeft) < 50) {
        return true;
    }
    return false;
}

function updateLivesAndScore() {
    document.getElementById('lives').innerHTML = 'Lives: ' + livesCount;
    document.getElementById('score').innerHTML = 'Score: ' + currentScore + ' pts';
}

function movePlayerRight() {
    var player = document.getElementById('me');
    var style = getComputedStyle(player);
    var left = style.getPropertyValue("left");
    left = left.substring(0, left.length - 2);
    var newLeft = parseInt(left) + moveSize;
    if (newLeft > (boardWidth - (moveSize / 2))) {
        return;
    }
    player.style.left = newLeft + 'px';
}

function movePlayerLeft() {
    var player = document.getElementById('me');
    var style = getComputedStyle(player);
    var left = style.getPropertyValue("left");
    left = left.substring(0, left.length - 2);
    var newLeft = parseInt(left) - moveSize;
    if (newLeft < 0) {
        return;
    }
    player.style.left = newLeft + 'px';
}

function randomNumber(max) {
    var result = Math.random();
    result = Math.floor(result * max);
    return result;
}

//this will generate a random color, but limited to a value of 200 for each RGB component.
//this will produce darker colours - rocks need a good contrast with the background.
function randomColor() {
    var red = randomNumber(200);
    //red = red.toString(16);
    var green = randomNumber(200);
    //green = green.toString(16);
    var blue = randomNumber(200);
    //blue = blue.toString(16);
    var result = 'RGB(' + red + ',' + green + ',' + blue + ')';
    return result;
}

function randomBorderRadius() {
    var radius = randomNumber(moveSize);
    return radius + 'px';
}