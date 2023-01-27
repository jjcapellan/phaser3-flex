import Phaser from 'phaser';

export default class Test extends Phaser.Scene {
    constructor() {
        super('test');
    }

    create() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const g = this.add.graphics();
        

        this.add.text(cx, cy - 80, 'Demo', { fontFamily: 'Roboto', fontSize: 24, color: '#555568' })
            .setOrigin(0.5);
        const item = this.add.image(0, 0, 'item20x20');

        let flex = new Fbx.Flex({ x: cx - 200, y: cy - 20, width: 400 });
        flex.add(item);
        this.drawFlex(g, flex);
    }

    drawFlex(g, flex) {
        g.clear();
        g.lineStyle(2, 0x555568);
        g.strokeRect(flex.x, flex.y, flex.width, flex.height);
    }
}