export default class Demo extends Phaser.Scene {
    constructor() {
        super('test');
    }

    create() {
        const cx = this.scale.width / 2;
        const cy = this.scale.height / 2;
        const g = this.add.graphics();

        let flex1, flex2, flex3, text1;
        let ready = true;
        let flexObjects = [];

        let counter = 0;
        const tasks = [];

        // Items
        const item1 = this.add.image(790, 30, 'item20x20');
        const item2 = this.add.image(760, 30, 'item20x40');
        const item3 = this.add.image(720, 30, 'item40x20');
        const item4 = this.add.image(680, 30, 'item20x40');

        // Instructions
        const infoText = this.add.text(cx, 630, 'Click on screen to run command', { fontFamily: 'Roboto', fontSize: 24, color: frontColor })
            .setOrigin(0.5, 1);

        // Very old Command
        const oldCmdText2 = this.add.text(cx, cy - 110, '', { fontFamily: 'monospace', fontSize: 8, color: frontColor })
            .setAlpha(0.2)
            .setOrigin(0.5);

        // Old Command
        const oldCmdText = this.add.text(cx, cy - 90, '', { fontFamily: 'monospace', fontSize: 12, color: frontColor })
            .setAlpha(0.4)
            .setOrigin(0.5);

        // Active Command
        const cmdText = this.add.text(cx, cy - 60, '', { fontFamily: 'monospace', fontSize: 14, color: redColor })
            .setOrigin(0.5);

        // Command tween
        const cmdTw = this.tweens.add({
            targets: cmdText,
            alpha: 0.1,
            duration: 200,
            ease: 'Quad.easeIn',
            yoyo: true,
            paused: true,
            persist: true,
            onYoyo: () => {
                cmdText.setText(tasks[counter].text);
                if (counter > 0) oldCmdText.setText(tasks[counter - 1].text);
                if (counter > 1) oldCmdText2.setText(tasks[counter - 2].text);
            },
            onComplete: () => {
                ready = true;
            }
        });

        tasks.push({
            text: 'let flex1 = new Fbx.Flex({ x: 40, y: centerY, width: 760, height: 280})',
            fn: () => {
                flex1 = new Fbx.Flex({ x: 40, y: cy, width: 760, height: 280 });
                flexObjects.push(flex1);
            }
        });

        tasks.push({
            text: 'let flex2 = new Fbx.Flex({ width: 120 })',
            fn: () => {
                flex2 = new Fbx.Flex({ width: 120 });
                flexObjects.push(flex2);
            }
        });

        tasks.push({
            text: 'let flex3 = new Fbx.Flex({ width: 120 })',
            fn: () => {
                flex3 = new Fbx.Flex({ width: 120 });
                flexObjects.push(flex3);
            }
        });

        tasks.push({
            text: 'flex1.add(flex2, 1)',
            fn: () => {
                flex1.add(flex2, 1);
            }
        });

        tasks.push({
            text: 'flex1.add(flex3, 2)',
            fn: () => {
                flex1.add(flex3, 2);
            }
        });

        tasks.push({
            text: 'flex2.add(item1).add(item2)',
            fn: () => {
                flex2.add(item1).add(item2);
            }
        });

        tasks.push({
            text: 'flex3.add(item3).add(item4)',
            fn: () => {
                flex3.add(item3).add(item4);
            }
        });

        tasks.push({
            text: 'flex2.setJustifyContent(Fbx.JustifyContent.SPACE_AROUND)',
            fn: () => {
                flex2.setJustifyContent(Fbx.JustifyContent.SPACE_AROUND);
            }
        });

        tasks.push({
            text: 'flex3.setJustifyContent(Fbx.JustifyContent.FLEX_END)',
            fn: () => {
                flex3.setJustifyContent(Fbx.JustifyContent.FLEX_END);
            }
        });

        tasks.push({
            text: 'flex1.setAlignItems(Fbx.AlignItems.FLEX_START)',
            fn: () => {
                flex1.setAlignItems(Fbx.AlignItems.FLEX_START);
            }
        });

        tasks.push({
            text: 'flex1.setWidth(500)',
            fn: () => {
                flex1.setWidth(500);
            }
        });

        tasks.push({
            text: 'flex1.destroy()',
            fn: () => {
                flex1.destroy();
                flexObjects = [];
            }
        });

        tasks.push({
            text: 'flex1 = new Fbx.Flex({x:centerX, y:centerY, width:200, flexDirection:Fbx.FlexDirection.COLUMN})',
            fn: () => {
                flex1 = new Fbx.Flex({ x: cx, y: cy, width: 200, flexDirection: Fbx.FlexDirection.COLUMN });
                flexObjects.push(flex1);
            }
        });

        tasks.push({
            text: 'let text1 = this.add.text(0,0,"This is a long line of text, larger than column width")',
            fn: () => {
                text1 = this.add.text(0, 0,
                    "This is a long line of text, larger than column width",
                    { fontFamily: 'Roboto', fontSize: 20, color: frontColor });
            }
        });


        tasks.push({
            text: 'flex1.add(text1)',
            fn: () => {
                flex1.add(text1);
            }
        });

        tasks.push({
            text: 'flex1.setOrigin(0.5, 0)',
            fn: () => {
                flex1.setOrigin(0.5, 0);
            }
        });

        tasks.push({
            text: 'flex1.setWidth(350)',
            fn: () => {
                flex1.setWidth(350);
            }
        });




        cmdText.setText(tasks[counter].text);



        this.input.on('pointerdown', () => {
            if (!ready) {
                return;
            }
            console.log("down");
            ready = false;
            tasks[counter].fn();
            this.drawFlex(g, flexObjects);
            counter++;
            if (counter >= tasks.length) {
                cmdText.setText('--- DEMO COMPLETED ---');
                infoText.setVisible(false);
                return;
            }
            cmdTw.play();
        });
    }

    drawFlex(g, flexObjects) {

        g.clear();
        g.lineStyle(2, xfrontColor);
        flexObjects.forEach(flex => {
            if (flex.destroyed) return;
            g.strokeRect(flex.x - flex.origin.x * flex.width, flex.y - flex.origin.y * flex.height, flex.width, flex.height);
        });

    }
}