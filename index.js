function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function Hero() {
    this.maxHP = 20;
    this.hp = 20;
    this.swordLevel = 0;
    this.minAtk = [1, 3, 6];
    this.maxAtk = [3, 6, 9];
    this.x = 0;
    this.y = 0;
}


function Game() {
    this.field = [];
    this.player = new Hero();
}

Game.prototype.init = function() {
    for(var i = 0; i < 26; i++) {
        var row = [];
        for(var j = 0; j < 40; j++) {
            row[j] = 'W';
        }
        this.field[i] = row;
    }
    var roomCount = getRandomInt(5, 11);
    for(var i = 0; i < roomCount; i++) {
        this.addRoom();
    }

    var hCorridorCount = getRandomInt(3, 6);
    for(var i = 0; i < hCorridorCount; i++) {
        this.addCorridor('H');
    }
    var vCorridorCount = getRandomInt(3, 6);
    for(var i = 0; i < vCorridorCount; i++) {
        this.addCorridor('V');
    }
    var freeSpaces = [];
    for(var i = 0; i < 26; i++) {
        for(var j = 0; j < 40; j++) {
            if(this.field[i][j] === 'F') freeSpaces.push([i, j]);
        }
    }

    var playerPosI = getRandomInt(0, freeSpaces.length);
    this.player.x = freeSpaces[playerPosI][1];
    this.player.y = freeSpaces[playerPosI][0];
    freeSpaces.splice(playerPosI, 1);
}

Game.prototype.addRoom = function() {
    var width = getRandomInt(3, 9);
    var height = getRandomInt(3, 9);
    var startX = getRandomInt(0, 40 - width - 1);
    var startY = getRandomInt(0, 26 - height - 1);

    for(var i = startY; i < startY + height; i++) {
        for(var j = startX; j < startX + width; j++) {
            this.field[i][j] = 'F';
        }
    }
}

Game.prototype.addCorridor = function(direction) {
    if(direction === 'H') {
        var y = getRandomInt(0, 26);
        for (var j = 0; j < 40; j++) {
            this.field[y][j] = 'F';
        }
    }else {
        var x = getRandomInt(0, 40);
        for (var i = 0; i < 26; i++) {
            this.field[i][x] = 'F';
        }
    }
}

Game.prototype.render = function() {
    var fieldEl = document.querySelector(".field");
    fieldEl.innerHTML = "";
    for(var i = 0; i< 26; i++) {
        for(var j = 0; j< 40; j++) {
            var tile = document.createElement("div");
            tile.classList.add("tile");
            switch(this.field[i][j]) {
                case 'W':
                    tile.classList.add("tileW");
                    break;
                default:
                    break;
            }
            if(this.player.x === j && this.player.y === i) {
                tile.classList.add("tileP");
                var playerHpEl = document.createElement("div");
                playerHpEl.classList.add("health");
                playerHpEl.style.width = this.player.hp * 5 + "%";
                tile.appendChild(playerHpEl);
            }
            tile.style.top = 25 * i + "px";
            tile.style.left = 25 * j + "px";
            fieldEl.appendChild(tile);
        }
    }
}

document.addEventListener("keydown", function (e){
    switch(e.key.toUpperCase()) {
        case 'W':
            if(game.player.y > 0 && game.field[game.player.y - 1][game.player.x] === 'F') {
                game.player.y -= 1;
            }
            break;
        case 'S':
            if(game.player.y < 25 && game.field[game.player.y + 1][game.player.x] === 'F') {
                game.player.y += 1;
            }
            break;
        case 'D':
            if(game.player.x < 39 && game.field[game.player.y][game.player.x + 1] === 'F') {
                game.player.x += 1;
            }
            break;
        case 'A':
            if(game.player.x > 0 && game.field[game.player.y][game.player.x - 1] === 'F') {
                game.player.x -= 1;
            }
            break;
    }
    game.render();
});