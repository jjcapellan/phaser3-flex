import Phaser from 'phaser';
import Load from './scenes/load.js';
import Demo from './scenes/demo.js';

// Colors
window.xbackColor = 0xe9efec;
window.backColor = '#e9efec';
window.xfrontColor = 0x555568;
window.frontColor = '#555568';
window.xredColor = 0xdd1111;
window.redColor = '#dd1111';

function runGame() {
    var config = {
        type: Phaser.AUTO,
        width: 840,
        height: 640,
        parent: 'demo',
        backgroundColor: xbackColor,
        roundPixels: true,
        scene: [Load, Demo]
    };

    new Phaser.Game(config);
}

window.onload = function () {
    runGame();
};