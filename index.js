function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function Game() {
    this.field = [];
}

Game.prototype.init = function() {
    for(var i = 0; i < 13; i++) {
        var row = [];
        for(var j = 0; j < 20; j++) {
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
}

Game.prototype.addRoom = function() {
    var width = getRandomInt(3, 9);
    var height = getRandomInt(3, 9);
    var startX = getRandomInt(0, 20 - width - 1);
    var startY = getRandomInt(0, 13 - height - 1);

    for(var i = startY; i < startY + height; i++) {
        for(var j = startX; j < startX + width; j++) {
            this.field[i][j] = 'F';
        }
    }
}

Game.prototype.addCorridor = function(direction) {
    if(direction === 'H') {
        var y = getRandomInt(0, 13);
        for (var j = 0; j < 20; j++) {
            this.field[y][j] = 'F';
        }
    }else {
        var x = getRandomInt(0, 19);
        for (var i = 0; i < 13; i++) {
            this.field[i][x] = 'F';
        }
    }
}

Game.prototype.render = function() {
    var fieldEl = document.querySelector(".field");
    fieldEl.innerHTML = "";
    for(var i = 0; i< 13; i++) {
        for(var j = 0; j< 20; j++) {
            var tile = document.createElement("div");
            tile.classList.add("tile");
            switch(this.field[i][j]) {
                case 'W':
                    tile.classList.add("tileW");
                    break;
                default:
                    break;
            }
            tile.style.top = 50 * i + "px";
            tile.style.left = 50 * j + "px";
            fieldEl.appendChild(tile);
        }
    }
}