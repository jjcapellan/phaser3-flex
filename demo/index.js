import Phaser from 'phaser';
import Load from './scenes/load.js';
import Test from './scenes/test.js';

function runGame() {
    var config = {
        type: Phaser.AUTO,
        width: 800,
        height: 600,
        parent: 'demo',
        backgroundColor: 0xe9efec,
        roundPixels: true,
        scene: [Load, Test]
    };

    new Phaser.Game(config);
}

window.onload = function () {
    runGame();
};