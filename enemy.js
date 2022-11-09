// Реализация класса врага

//Конструктор
function Enemy(game) {
    this.maxHP = 20;
    this.hp = 20;
    this.minAtk = 1;
    this.maxAtk = 3;
    this.x = 0;
    this.y = 0;
    this.game = game;
}

//Метод атаки игрока врагом
Enemy.prototype.attack = function() {
    if(!this.game.player) return;
    var attack = getRandomInt(this.minAtk, this.maxAtk + 1);
    this.game.player.hp -= attack;
    if(this.game.player.hp <= 0) this.game.player = null;
}

//Метод перемещения врага
Enemy.prototype.move = function() {
    if(this.game.player && Math.abs(this.x - this.game.player.x) <= 1 && Math.abs(this.y - this.game.player.y) <= 1) {
        this.attack();
    }else {
        var hasMoved = false;
        while(!hasMoved) {
            var direction = getRandomInt(0, 4);
            switch(direction) {
                case 0:
                    if(this.y > 0 && this.game.field[this.y - 1][this.x] === 'F') {
                        this.y--;
                        hasMoved = true;
                    }
                    break;
                case 1:
                    if(this.y <= 25 && this.game.field[this.y + 1][this.x] === 'F') {
                        this.y++;
                        hasMoved = true;
                    }
                    break;
                case 2:
                    if(this.x > 0 && this.game.field[this.y][this.x - 1] === 'F') {
                        this.x--;
                        hasMoved = true;
                    }
                    break;
                case 3:
                    if(this.x <= 39 && this.game.field[this.y][this.x + 1] === 'F') {
                        this.x++;
                        hasMoved = true;
                    }
            }
        }
    }
}