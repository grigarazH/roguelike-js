//Реализация класса игрока

var RESTORED_HEALTH = 10;

//Конструктор
function Player(game) {
    this.maxHP = 20;
    this.hp = 20;
    this.swordLevel = 0;
    this.minAtk = [1, 3, 6];
    this.maxAtk = [3, 6, 9];
    this.x = 0;
    this.y = 0;
    this.game = game;
}

//Метод сбора игроком меча или зелья
Player.prototype.collect = function() {
    for(var i = 0; i < this.game.swords.length; i++) {
        if(this.x === this.game.swords[i][0] && this.y === this.game.swords[i][1]) {
            this.swordLevel++;
            this.game.swords.splice(i, 1);
        }
    }
    for(var i = 0; i < this.game.potions.length; i++) {
        if(this.x === this.game.potions[i][0] && this.y === this.game.potions[i][1]) {
            this.hp += RESTORED_HEALTH;
            if(this.hp > this.maxHP) this.hp = this.maxHP;
            this.game.potions.splice(i, 1);
        }
    }
}

//Метод атаки врагов игроком
Player.prototype.attack = function(enemyIndex) {
    var attack = getRandomInt(this.minAtk[this.swordLevel], this.maxAtk[this.swordLevel] - 1);
    this.game.enemies[enemyIndex].hp -= attack;
    if(this.game.enemies[enemyIndex].hp <= 0) {
        this.game.enemies.splice(enemyIndex, 1);
    }
}

//Метод перемещения игрока
Player.prototype.move = function(movement) {
    switch(movement) {
        case 'up':
            if(this.y > 0 && this.game.field[this.y - 1][this.x] === 'F') {
                this.y -= 1;
                this.collect();
            }
            break;
        case 'down':
            if(this.y < 25 && this.game.field[this.game.player.y + 1][this.game.player.x] === 'F') {
                this.y += 1;
                this.collect();
            }
            break;
        case 'right':
            if(this.x < 39 && this.game.field[this.y][this.x + 1] === 'F') {
                this.x += 1;
                this.collect();
            }
            break;
        case 'left':
            if(this.x > 0 && this.game.field[this.y][this.x - 1] === 'F') {
                this.x -= 1;
                this.collect();
            }
            break;
        case 'attack':
            for(var i = 0; i < this.game.enemies.length; i++) {
                if(Math.abs(this.x - this.game.enemies[i].x) <= 1 && Math.abs(this.y - this.game.enemies[i].y) <= 1) {
                    this.attack(i);
                }
            }
            break;
    }
}