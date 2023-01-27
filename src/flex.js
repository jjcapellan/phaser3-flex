import { AlignItems, FlexDirection, JustifyContent } from './constants.js';
class Flex {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.width = config.width || 0;
        this.height = config.height || 0;
        this.padding = config.padding || 10;
        this.itemsMargin = config.itemsMargin || 4;
        this.alignItems = config.alignItems || AlignItems.CENTER;
        this.flexDirection = config.flexDirection || FlexDirection.ROW;
        this.justifyContent = config.justifyContent || JustifyContent.FLEX_START;
        this.origin = { x: 0, y: 0 };

        if ((this.flexDirection == FlexDirection.ROW && !this.width) ||
            (this.flexDirection == FlexDirection.COLUMN && !this.height)) {
            // Size changes if new items are added or removed
            this.fitContent = true;
        }

        return this;
    }

    add() {

    }

    remove() {

    }

    destroy() {

    }

    setAlignItems() {

    }

    setFitContent() {

    }

    setHeight() {

    }

    setWidth() {

    }

    setJustifyContent() {

    }

    setOrigin() {

    }

    // Items shouldn't move
    setScrollFactor() {

    }

    setX() {

    }

    setY() {

    }

    setVisible() {

    }
}

export { Flex };