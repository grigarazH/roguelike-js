var RESTORED_HEALTH = 10;

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

function Enemy() {
    this.maxHP = 20;
    this.hp = 20;
    this.minAtk = 1;
    this.maxAtk = 3;
    this.x = 0;
    this.y = 0;
    setInterval(function() {
        if(Math.abs(this.x - game.player.x) <= 1 && Math.abs(this.y - game.player.y) <= 1) {
            this.attack();
        }else {

        }
        game.render();
    }.bind(this), 500);
}

Enemy.prototype.attack = function() {
    var attack = getRandomInt(this.minAtk, this.maxAtk + 1);
    game.player.hp -= attack;
}

Hero.prototype.collect = function(potions, swords) {
    for(var i = 0; i < swords.length; i++) {
        if(this.x === swords[i][0] && this.y === swords[i][1]) {
            this.swordLevel++;
            swords.splice(i, 1);
        }
    }
    for(var i = 0; i < potions.length; i++) {
        if(this.x === potions[i][0] && this.y === potions[i][1]) {
            this.hp += RESTORED_HEALTH;
            if(this.hp > this.maxHP) this.hp = this.maxHP;
            potions.splice(i, 1);
        }
    }
}


function Game() {
    this.field = [];
    this.hCorridors = [];
    this.vCorridors = [];
    this.player = new Hero();
    this.swords = [];
    this.potions = [];
    this.enemies = [];
}

Game.prototype.init = function() {
    for(var i = 0; i < 26; i++) {
        var row = [];
        for(var j = 0; j < 40; j++) {
            row[j] = 'W';
        }
        this.field[i] = row;
    }
    this.hCorridors = [];
    this.vCorridors = [];
    //Добавление коридоров
    var hCorridorCount = getRandomInt(3, 6);
    for(var i = 0; i < hCorridorCount; i++) {
        this.hCorridors.push(this.addCorridor('H'));
    }
    var vCorridorCount = getRandomInt(3, 6);
    for(var i = 0; i < vCorridorCount; i++) {
        this.vCorridors.push(this.addCorridor('V'));
    }

    var roomCount = getRandomInt(5, 11);
    var k = 0;
    while(k < roomCount) {
        if(this.addRoom()) {
            k++;
        }
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

    this.swords = [];

    for(var i = 0; i < 2; i++) {
        var swordPosI = getRandomInt(0, freeSpaces.length);
        this.swords.push([freeSpaces[swordPosI][1], freeSpaces[swordPosI][0]]);
        freeSpaces.splice(swordPosI, 1);
    }

    this.potions = [];

    for(var i = 0; i < 10; i++) {
        var potionPosI = getRandomInt(0, freeSpaces.length);
        this.potions.push([freeSpaces[potionPosI][1], freeSpaces[potionPosI][0]]);
        freeSpaces.splice(potionPosI, 1);
    }

    for(var i = 0; i < 10; i++) {
        var enemyPosI = getRandomInt(0, freeSpaces.length);
        var enemy = new Enemy();
        enemy.x = freeSpaces[enemyPosI][1];
        enemy.y = freeSpaces[enemyPosI][0];
        this.enemies.push(enemy);
        freeSpaces.splice(enemyPosI, 1);
    }

}

Game.prototype.addRoom = function() {
    var width = getRandomInt(3, 9);
    var height = getRandomInt(3, 9);
    var startX = getRandomInt(0, 40 - width - 1);
    var startY = getRandomInt(0, 26 - height - 1);
    var endX = startX + width;
    var endY = startY + height;
    var isValidRoom = false;
    for(var i = 0; i < this.vCorridors.length; i++) {
        if(this.vCorridors[i] >= startX && this.vCorridors[i] < endX) {
            isValidRoom = true;
            break;
        }
    }

    for(var i = 0; i< this.hCorridors.length; i++) {
        if(this.hCorridors[i] >= startY && this.hCorridors[i] < endY) {
            isValidRoom = true;
            break;
        }
    }

    if(!isValidRoom) {
        return false;
    }
    for(var i = startY; i < endY; i++) {
        for(var j = startX; j < endX; j++) {
            this.field[i][j] = 'F';
        }
    }

    return true;
}

Game.prototype.addCorridor = function(direction) {
    if(direction === 'H') {
        var y = getRandomInt(0, 26);
        for (var j = 0; j < 40; j++) {
            this.field[y][j] = 'F';
        }
        return y;
    }else {
        var x = getRandomInt(0, 40);
        for (var i = 0; i < 26; i++) {
            this.field[i][x] = 'F';
        }
        return x;
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

            for(var k = 0; k < this.swords.length; k++) {
                if(this.swords[k][0] === j && this.swords[k][1] === i) {
                    tile.classList.add("tileSW");
                }
            }

            for(var k = 0; k < this.potions.length; k++) {
                if(this.potions[k][0] === j && this.potions[k][1] === i) {
                    tile.classList.add("tileHP");
                }
            }

            for(var k = 0; k < this.enemies.length; k++) {
               if(this.enemies[k].x === j && this.enemies[k].y === i) {
                   tile.classList.add("tileE");
                   var enemyHpEl = document.createElement("div");
                   enemyHpEl.classList.add("health");
                   enemyHpEl.style.width = this.enemies[k].hp * 5 + "%";
                   tile.appendChild(enemyHpEl);
               }
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
                game.player.collect(game.potions, game.swords);
            }
            break;
        case 'S':
            if(game.player.y < 25 && game.field[game.player.y + 1][game.player.x] === 'F') {
                game.player.y += 1;
                game.player.collect(game.potions, game.swords);
            }
            break;
        case 'D':
            if(game.player.x < 39 && game.field[game.player.y][game.player.x + 1] === 'F') {
                game.player.x += 1;
                game.player.collect(game.potions, game.swords);
            }
            break;
        case 'A':
            if(game.player.x > 0 && game.field[game.player.y][game.player.x - 1] === 'F') {
                game.player.x -= 1;
                game.player.collect(game.potions, game.swords);
            }
            break;
    }
    game.render();
});