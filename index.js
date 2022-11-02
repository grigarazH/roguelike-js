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