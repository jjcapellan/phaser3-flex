export default class Load extends Phaser.Scene {
    constructor() {
        super('load');
    }

    preload() {
        this.load.script('webfont', 'https://ajax.googleapis.com/ajax/libs/webfont/1.6.26/webfont.js');
    }

    create() {
        this.generateTextures();
        WebFont.load({
            custom: {
                families: ['Roboto']
            },
            active: () => {
                this.scene.start('test');
            }
        });
    }

    generateTextures() {
        let g = this.add.graphics();
        g.fillStyle(xfrontColor, 1);
        g.fillRect(0, 0, 20, 20);
        g.generateTexture('item20x20', 20, 20);

        g.clear();
        g.fillStyle(xfrontColor, 1);
        g.fillRect(0, 0, 20, 40);
        g.generateTexture('item20x40', 20, 40);

        g.clear();
        g.fillStyle(xfrontColor, 1);
        g.fillRect(0, 0, 40, 20);
        g.generateTexture('item40x20', 40, 20);
        g.setVisible(false);
    }
}