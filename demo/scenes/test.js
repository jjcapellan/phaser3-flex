import Phaser from 'phaser';

export default class Test extends Phaser.Scene {
    constructor() {
        super('test');
    }

    create() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const g = this.add.graphics();

        let flex;
        let ready = true;

        let counter = 0;
        const tasks = [];

        // Items
        const item1 = this.add.image(300, 50, 'item20x20');
        const item2 = this.add.image(400, 100, 'item20x40');
        const item3 = this.add.image(500, 50, 'item40x20');

        // Instructions
        this.add.text(cx, 590, 'Click on screen to run command', { fontFamily: 'Roboto', fontSize: 24, color: '#555568' })
            .setOrigin(0.5, 1);

        // Active Command
        const cmdText = this.add.text(cx, cy - 60, '', { fontFamily: 'monospace', fontSize: 18, color: '#555568' })
            .setOrigin(0.5);

        // Command tween
        const cmdTw = this.tweens.add({
            targets: cmdText,
            alpha: 0.1,
            duration: 400,
            ease: 'Quad.easeIn',
            yoyo: true,
            paused: true,
            onYoyo: () => {
                cmdText.setText(tasks[counter].text);
            },
            onComplete: () => {
                ready = true;
            }
        });

        // Tasks
        tasks.push({
            text: 'let flex = new Fbx.Flex({ x: centerX, y: centerY, width: 400 })',
            fn: () => {
                flex = new Fbx.Flex({ x: cx, y: cy, width: 400 });
            }
        });

        tasks.push({
            text: 'flex.setOrigin(0.5)',
            fn: () => {
                flex.setOrigin(0.5);
            }
        });

        tasks.push({
            text: 'flex.add(item1)',
            fn: () => {
                flex.add(item1);
            }
        });

        tasks.push({
            text: 'flex.add(item2)',
            fn: () => {
                flex.add(item2);
            }
        });

        tasks.push({
            text: 'flex.add(item3)',
            fn: () => {
                flex.add(item3);
            }
        });

        tasks.push({
            text: 'flex.setJustifyContent(Fbx.JustifyContent.CENTER)',
            fn: () => {
                flex.setJustifyContent(Fbx.JustifyContent.CENTER);
            }
        });

        cmdText.setText(tasks[counter].text);



        this.input.on('pointerdown', () => {
            if (!ready) {
                return;
            }
            ready = false;
            tasks[counter].fn();
            this.drawFlex(g, flex);
            counter++;
            if (counter >= tasks.length) return;
            cmdTw.play();
        });
    }

    drawFlex(g, flex) {
        g.clear();
        g.lineStyle(2, 0x555568);
        g.strokeRect(flex.x - flex.origin.x * flex.width, flex.y - flex.origin.y * flex.height, flex.width, flex.height);
    }
}