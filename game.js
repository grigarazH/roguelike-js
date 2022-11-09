//Реализация класса игры

//Конструктор
function Game() {
    this.field = [];
    this.player = new Player(this);
    this.swords = [];
    this.potions = [];
    this.enemies = [];

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
    //Добавление комнат
    var roomCount = getRandomInt(5, 11);
    var k = 0;
    while(k < roomCount) {
        if(this.addRoom()) {
            k++;
        }
    }

    //Определение свободных клеток
    var freeSpaces = [];
    for(var i = 0; i < 26; i++) {
        for(var j = 0; j < 40; j++) {
            if(this.field[i][j] === 'F') freeSpaces.push([i, j]);
        }
    }

    //Помещение игрока в свободную клетку
    var playerPosI = getRandomInt(0, freeSpaces.length);
    this.player.x = freeSpaces[playerPosI][1];
    this.player.y = freeSpaces[playerPosI][0];
    freeSpaces.splice(playerPosI, 1);

    //Помещение мечей в свободные клетки
    this.swords = [];

    for(var i = 0; i < 2; i++) {
        var swordPosI = getRandomInt(0, freeSpaces.length);
        this.swords.push([freeSpaces[swordPosI][1], freeSpaces[swordPosI][0]]);
        freeSpaces.splice(swordPosI, 1);
    }

    //Помещение зелий в свободные клетки
    this.potions = [];

    for(var i = 0; i < 10; i++) {
        var potionPosI = getRandomInt(0, freeSpaces.length);
        this.potions.push([freeSpaces[potionPosI][1], freeSpaces[potionPosI][0]]);
        freeSpaces.splice(potionPosI, 1);
    }


    //Добавление и размещение врагов в свободные клетки
    for(var i = 0; i < 10; i++) {
        var enemyPosI = getRandomInt(0, freeSpaces.length);
        var enemy = new Enemy(this);
        enemy.x = freeSpaces[enemyPosI][1];
        enemy.y = freeSpaces[enemyPosI][0];
        this.enemies.push(enemy);
        freeSpaces.splice(enemyPosI, 1);
    }

    //Активация AI врагов
    setInterval(function() {
        for(var i = 0; i < this.enemies.length; i++) {
            this.enemies[i].move();
        }
        this.render();
    }.bind(this), 500);

    //Реализация управления героем
    document.addEventListener("keypress", function (e){
        if(!this.player) return;
        var controls = {
            'W': 'up',
            'S': 'down',
            'A': 'left',
            'D': 'right',
            ' ': 'attack'
        };
        this.player.move(controls[e.key.toUpperCase()]);
        this.render();
    }.bind(this));
}

//Добавляет комнату, пересекающуюся с одним из коридоров. Если комнату можно добавить возвращает true. В противном случае возвращает false.
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

//Добавляет горизонтальный или вертикальный коридор
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

//Функция отрисовки
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
            if(this.player && this.player.x === j && this.player.y === i) {
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
                    tile.classList.remove("tileSW");
                    tile.classList.remove("tileHP");
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