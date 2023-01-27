import Phaser from 'phaser';

export default class Test extends Phaser.Scene {
    constructor() {
        super('test');
    }

    create() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;

        this.add.text(cx, cy - 60, 'Demo', { fontFamily: 'Roboto', fontSize: 24, color: '#555568' })
            .setOrigin(0.5);
        this.add.image(cx, cy, 'item20x20');

        let flex = new Fbx.Flex({ x: 10, y: 20 });
        console.log(flex.x, flex.y);
    }
}