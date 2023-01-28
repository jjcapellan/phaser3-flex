import { Alignment, AlignItems, FlexDirection, JustifyContent } from './constants.js';
import { h } from './helpers.js';
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
        this._scrollFactorX = 0;
        this._scrollFactorY = 0;
        this.items = [];
        this._heights = [];
        this._widths = [];
        this._growSum = 0;
        this._shrinkSum = 0;
        this._bounds = {};

        if ((this.flexDirection == FlexDirection.ROW && !this.width) ||
            (this.flexDirection == FlexDirection.COLUMN && !this.height)) {
            // Size changes if new items are added or removed
            this.fitContent = true;
        }

        return this;
    }

    /**
     * 
     * @param {object} item 
     * @param {number} flexGrow 
     * @param {number} flexShrink 
     */
    add(item, flexGrow = 0, flexShrink = 0) {
        item.setOrigin(0, 0);
        item.setScrollFactor(this._scrollFactorX, this._scrollFactorY);
        item.flexGrow = flexGrow;
        item.flexShrink = flexShrink;
        this.items.push(item);
        this._heights.push(item.height);
        this._widths.push(item.width);
        this._growSum += item.flexGrow;
        this._shrinkSum += item.flexShrink;

        if (this.flexDirection == FlexDirection.ROW) {
            h.checkHeight(this, item.height);
            if (this.fitContent) {
                h.checkWidth(this, h.getItemsWidth(this));
            }
        }

        if (this.flexDirection == FlexDirection.COLUMN) {
            h.checkWidth(this, item.width);
            if (this.fitContent) {
                h.checkHeight(this, h.getItemsHeight(this));
            }
        }

        h.setItems(this);

        return this;

    }

    remove() {

    }

    destroy() {

    }

    setAlignItems(alignItems) {

        if (this.alignItems == AlignItems.STRETCH && alignItems != AlignItems.STRETCH) {
            if (this.flexDirection == FlexDirection.ROW) {
                h.resetHeights(this);
            } else {
                h.resetWidths(this);
            }
        }

        this.alignItems = alignItems;

        switch (alignItems) {
            case AlignItems.CENTER:
                if (this.flexDirection == FlexDirection.ROW) {
                    h.setAlignV(this, Alignment.CENTER);
                } else {
                    h.setAlignH(this, Alignment.CENTER);
                }
                break;

            case AlignItems.FLEX_START:
                if (this.flexDirection == FlexDirection.ROW) {
                    h.setAlignV(this, Alignment.TOP);
                } else {
                    h.setAlignH(this, Alignment.LEFT);
                }
                break;

            case AlignItems.FLEX_END:
                if (this.flexDirection == FlexDirection.ROW) {
                    h.setAlignV(this, Alignment.BOTTOM);
                } else {
                    h.setAlignH(this, Alignment.RIGHT);
                }
                break;

            case AlignItems.STRETCH:
                if (this.flexDirection == FlexDirection.ROW) {
                    h.setAlignV(this, Alignment.STRETCH);
                } else {
                    h.setAlignH(this, Alignment.STRETCH);
                }
                break;

            default:
                break;
        }

        return this;
    }

    setFitContent() {

    }

    setHeight() {

    }

    setWidth(width) {
        this.width = width;
        h.updateBounds(this);
        h.setItems(this);
        return this;
    }

    setJustifyContent(justifyContent) {
        this.justifyContent = justifyContent;

        switch (justifyContent) {
            case JustifyContent.CENTER:
                if (this.flexDirection == FlexDirection.ROW) {
                    h.setAlignH(this, Alignment.CENTER);
                } else {
                    h.setAlignV(this, Alignment.CENTER);
                }
                break;

            case JustifyContent.FLEX_START:
                if (this.flexDirection == FlexDirection.ROW) {
                    h.setAlignH(this, Alignment.LEFT);
                } else {
                    h.setAlignV(this, Alignment.TOP);
                }
                break;

            case JustifyContent.FLEX_END:
                if (this.flexDirection == FlexDirection.ROW) {
                    h.setAlignH(this, Alignment.RIGHT);
                } else {
                    h.setAlignV(this, Alignment.BOTTOM);
                }
                break;

            case JustifyContent.SPACE_AROUND:
                if (this.flexDirection == FlexDirection.ROW) {
                    h.setJustifyH(this);
                } else {
                    h.setJustifyV(this);
                }
                break;

            case JustifyContent.SPACE_BETWEEN:
                if (this.flexDirection == FlexDirection.ROW) {
                    h.setJustifyH(this);
                } else {
                    h.setJustifyV(this);
                }
                break;

            default:
                break;
        }

        return this;
    }

    setOrigin(x, y) {
        if (y == undefined) {
            y = x;
        }

        this.origin.x = x;
        this.origin.y = y;

        if (x > 1) {
            this.origin.x = 1;
        };
        if (x < 0) {
            this.origin.x = 0;
        };
        if (y > 1) {
            this.origin.y = 1;
        };
        if (y < 0) {
            this.origin.y = 0;
        };

        return this;
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

    _updateBounds() {

    }
}

export { Flex };