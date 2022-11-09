//Возвращает случайное целое от min до max включая min, не включая max.
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

var game=new Game();
game.render();