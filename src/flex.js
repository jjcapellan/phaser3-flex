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
        this._basisSum = 0;
        this._heights = [];
        this._widths = [];
        this._growSum = 0;
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
    add(item, flexGrow = 0, flexShrink = 1) {
        item.setOrigin(0, 0);
        item.setScrollFactor(this._scrollFactorX, this._scrollFactorY);
        item.flexGrow = flexGrow;
        item.flexShrink = flexShrink;
        item.basis = this.flexDirection == FlexDirection.ROW ? item.width : item.height;
        this._basisSum += item.basis;
        this.items.push(item);
        this._heights.push(item.height);
        this._widths.push(item.width);
        this._growSum += item.flexGrow;

        if (this.flexDirection == FlexDirection.ROW) {
            h.checkHeight(this, item.height);
            if (this.fitContent) {
                h.checkWidth(this, h.getItemsSize(this));
            }
        }

        if (this.flexDirection == FlexDirection.COLUMN) {
            h.checkWidth(this, item.width);
            if (this.fitContent) {
                h.checkHeight(this, h.getItemsSize(this));
            }
        }

        h.setItems(this);

        return this;

    }

    remove(index, destroy) {
        if (this.items[index] == undefined) {
            return;
        }
        let item = this.items[index];
        this._basisSum -= item.basis;
        this.items.splice(index, 1);
        this._heights.splice(index, 1);
        this._widths.splice(index, 1);

        if (destroy) {
            item.destroy();
        }

        if (this.flexDirection == FlexDirection.ROW) {
            h.fitHeight(this);
        }

        if (this.flexDirection == FlexDirection.COLUMN) {
            h.fitWidth(this);
        }

        h.setItems(this);
        return this;
    }

    destroy() {
        let items = this.items;
        for (let i = 0; i < items.length; i++) {
            items[i].destroy();
        }
        this.items = null;
        this._widths = null;
        this._heights = null;
        this._bounds = null;
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

    setFitContent(fitToContent) {
        this.fitContent = fitToContent;
        if (fitToContent) {
            if (this.flexDirection == FlexDirection.ROW) {
                let newWidth = h.getItemsSize(this) + 2 * this.padding;
                this.setWidth(newWidth);
            } else {
                let newHeight = h.getItemsSize(this) + 2 * this.padding;
                this.setHeight(newHeight);
            }
        }
        return this;
    }

    setHeight(height) {
        this.height = height;
        h.resetHeights(this);
        h.setItems(this);
        return this;
    }

    setWidth(width) {
        this.width = width;
        h.resetWidths(this);
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

        h.setItems(this);

        return this;
    }

    // Items shouldn't move
    setScrollFactor(x, y) {
        if (x > 1) {
            x = 1;
        }
        if (x < 0) {
            x = 0;
        }
        if (!y) {
            y = x;
        }
        this._scrollFactorX = x;
        this._scrollFactorY = y;
        for (let i = 0; i < this.items.length; i++) {
            this.items[i].setScrollFactor(x, y);
        }

        return this;
    }

    setX(x) {
        this.x = x;
        h.setItems(this);
        return this;
    }

    setY(y) {
        this.y = y;
        h.setItems(this);
        return this;
    }
}

export { Flex };