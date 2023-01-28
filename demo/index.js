import Phaser from 'phaser';
import Load from './scenes/load.js';
import Test from './scenes/test.js';

// Colors
window.xbackColor = 0xe9efec;
window.backColor = '#e9efec';
window.xfrontColor = 0x555568;
window.frontColor = '#555568';

function runGame() {
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'demo',
        backgroundColor: xbackColor,
        roundPixels: true,
        scene: [Load, Test]
    };

    new Phaser.Game(config);
}

window.onload = function () {
    runGame();
};