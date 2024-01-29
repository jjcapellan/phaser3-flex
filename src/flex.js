import {
    Alignment,
    AlignItems,
    FlexDirection,
    JustifyContent
} from "./constants.js";

import {
    checkHeight,
    checkWidth,
    fitHeight,
    fitTextToColumn,
    fitWidth,
    getItemsSize,
    resetHeights,
    resetWidths,
    restoreFitContent,
    setAlignH,
    setAlignV,
    setItems,
    setJustify
} from "./helpers.js";

class Flex {
    /**
     * Creates an instances of an object of class Flex.
     * @param {object} config 
     * @param {number} [config.x = 0] X position.
     * @param {number} [config.y = 0] Y position
     * @param {number} [config.width = 0] Width of this object.
     * @param {number} [config.height = 0] Height of this object.
     * @param {number} [config.padding = 10] Minimum distance between this object content and its border.
     * @param {number} [config.itemsMargin = 4] Minimum distance between items contained inside this object.
     * @param {number} [config.alignItems = 1] Alignment of the items with respect to the cross axis.
     * @param {number} [config.flexDirection = 2] Sets how items are placed in the flex object defining the main axis.
     * @param {number} [config.justifyContent = 3] Alignment of the items with respect to the main axis.
     * @returns {object} This Flex instance.
     */
    constructor(config) {
        /**
         * X position. Use *setX* to change this value.
         * @type {number}
         */
        this.x = config.x || 0;

        /**
         * Y position. Use *setY* to change this value.
         * @type {number}
         */
        this.y = config.y || 0;

        /**
         * Width of this object. Use *setWidth* to change this value.
         * @type {number}
         */
        this.width = config.width || 0;

        /**
         * Height of this object. Use *setHeight* to change this value.
         * @type {number}
         */
        this.height = config.height || 0;

        /**
         * Minimum distance between this object content and its border.
         * @type {number}
         */
        this.padding = config.padding || 10;

        /**
         * Minimum distance between items contained inside this object.
         * @type {number}
         */
        this.itemsMargin = config.itemsMargin || 4;

        /**
         * Alignment of the items with respect to the cross axis.  
         * Values: 1 (center), 2(flex-end), 3(flex-start), 4(stretch).  
         * The stretch alignment is only applicable to other flex objects.  
         * Use *setAlignItems* to change this property. For convenience you can use the enum *AlignItems*.
         * @type {number}
         */
        this.alignItems = config.alignItems || AlignItems.CENTER;

        /**
         * This property sets how items are placed in the flex object defining the main axis.  
         * Values: 1 (column), 2(row).  
         * Use *setFlexDirection* to change this property. For convenience you can use the enum *FlexDirection*.
         * @type {number}
         */
        this.flexDirection = config.flexDirection || FlexDirection.ROW;

        /**
         * Alignment of the items with respect to the main axis.  
         * Values: 1 (center), 2(flex-end), 3(flex-start), 4(space-around), 5(space-between).  
         * Use *setJustifyContent* to change this property. For convenience you can use the enum *JustifyContent*.
         * @type {number}
         */
        this.justifyContent = config.justifyContent || JustifyContent.FLEX_START;


        /**
         * Array of items managed by this object.
         * @readonly
         * @type {Array.<Object>}
         */
        this.items = [];

        /**
         * Should cross axis size fit to content?
         * @type {boolean}
         */
        this.fitContent = false;

        /**
         * 2D vector defining the anchor point of this object. (Type: { x: number, y: number }).  
         * X and Y values are a number between 0 and 1.
         * @type {object}
         */
        this.origin = { x: 0, y: 0 };

        this._scrollFactorX = 0;
        this._scrollFactorY = 0;
        this._fparent = null;
        this._isFlex = true;
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
        // Used to restore value of fitContent after stretch alignment in cross axis
        this._fitContent = this.fitContent;

        return this;
    }

    /**
     * Adds an item to the items list of this object. The position and size of this items
     * are managed by this object.
     * 
     * @param {object} item 
     * @param {number} flexGrow 
     * @param {number} flexShrink 
     * @returns {object} This Flex instance.
     */
    add(item, flexGrow = 0, flexShrink = 1) {
        item.setOrigin(0, 0);
        item.setScrollFactor(this._scrollFactorX, this._scrollFactorY);

        if (item._isFlex) {
            item.flexGrow = flexGrow;
            item.flexShrink = flexShrink;
            item._fparent = this;
        } else {
            item.flexGrow = 0;
            item.flexShrink = 0;
        }

        if (this.width && item.type == "Text" && this.flexDirection == FlexDirection.COLUMN) {
            fitTextToColumn(this, item);
        }

        item.basis = this.flexDirection == FlexDirection.ROW ? item.width : item.height;
        this._basisSum += item.basis;
        this.items.push(item);
        this._heights.push(item.height);
        this._widths.push(item.width);
        this._growSum += item.flexGrow;

        if (this.flexDirection == FlexDirection.ROW) {
            checkHeight(this, item.height);
            if (this.fitContent) {
                checkWidth(this, getItemsSize(this));
            }
        }

        if (this.flexDirection == FlexDirection.COLUMN) {
            checkWidth(this, item.width);
            if (this.fitContent) {
                checkHeight(this, getItemsSize(this));
            }
        }

        setItems(this);

        // This line forces items update in parent
        if (this._fparent) this._fparent.setX(this._fparent.x);

        return this;

    }

    /**
     * Each item managed by this object are destroyed.
     * 
     * @returns {object} This Flex instance.
     */
    clear() {
        this.items.forEach(item => {
            if (item._isFlex) {
                item.clear(true);
            }
        });
        this.items.forEach(item => item.destroy());
        this.items = [];
        this._heights = [];
        this._widths = [];
        this._basisSum = 0;

        return this;
    }

    /**
     * An item is removed from the items list managed by this flex object.
     * 
     * @param {number} index Index of the item to be removed in the items array of this instance. 
     * @param {boolean} destroy The item should be destroyed?.
     * @returns {object} This Flex instance.
     */
    remove(index, destroy) {
        if (this.items[index] == undefined) {
            return;
        }
        let item = this.items[index];
        item._fparent = null;
        this._basisSum -= item.basis;
        this.items.splice(index, 1);
        this._heights.splice(index, 1);
        this._widths.splice(index, 1);

        if (destroy) {
            item.destroy();
        }

        if (this.flexDirection == FlexDirection.ROW) {
            fitHeight(this);
        }

        if (this.flexDirection == FlexDirection.COLUMN) {
            fitWidth(this);
        }

        setItems(this);
        return this;
    }

    /**
     * Sets the size of this object.
     * 
     * @param {number} width 
     * @param {number} height 
     */
    setDisplaySize(width, height) {
        this.setWidth(width);
        this.setHeight(height);
    }

    /**
     * Disposes all resources used by this object.
     * 
     */
    destroy() {
        this.clear(true);
        this.items = null;
        this._widths = null;
        this._heights = null;
        this._bounds = null;
        this.origin = null;
        this._fparent = null;
        this.destroyed = true;
    }

    /**
     * Sets the *alignItems* property of this object.
     * 
     * @param {AlignItems} alignItems 
     * @returns {object} This Flex instance. 
     */
    setAlignItems(alignItems) {

        if (this.alignItems == AlignItems.STRETCH && alignItems != AlignItems.STRETCH) {
            if (this.flexDirection == FlexDirection.ROW) {
                resetHeights(this);
            } else {
                resetWidths(this);
            }
            restoreFitContent(this);
        }

        this.alignItems = alignItems;

        switch (alignItems) {
            case AlignItems.CENTER:
                if (this.flexDirection == FlexDirection.ROW) {
                    setAlignV(this, Alignment.CENTER);
                } else {
                    setAlignH(this, Alignment.CENTER);
                }
                break;

            case AlignItems.FLEX_START:
                if (this.flexDirection == FlexDirection.ROW) {
                    setAlignV(this, Alignment.TOP);
                } else {
                    setAlignH(this, Alignment.LEFT);
                }
                break;

            case AlignItems.FLEX_END:
                if (this.flexDirection == FlexDirection.ROW) {
                    setAlignV(this, Alignment.BOTTOM);
                } else {
                    setAlignH(this, Alignment.RIGHT);
                }
                break;

            case AlignItems.STRETCH:
                if (this.flexDirection == FlexDirection.ROW) {
                    setAlignV(this, Alignment.STRETCH);
                } else {
                    setAlignH(this, Alignment.STRETCH);
                }
                break;

            default:
                break;
        }

        return this;
    }

    /**
     * Sets the *fitContent* of this object.
     * 
     * @param {boolean} fitToContent 
     * @returns {object} This Flex instance.
     */
    setFitContent(fitToContent) {
        this.fitContent = fitToContent;
        if (fitToContent) {
            if (this.flexDirection == FlexDirection.ROW) {
                let newWidth = getItemsSize(this) + 2 * this.padding;
                this.setWidth(newWidth);
            } else {
                let newHeight = getItemsSize(this) + 2 * this.padding;
                this.setHeight(newHeight);
            }
        }
        return this;
    }

    /**
     * Sets the *height* of this object.
     * 
     * @param {number} height 
     * @returns {object} This Flex instance.
     */
    setHeight(height) {
        this.height = height;
        resetHeights(this);
        setItems(this);
        return this;
    }

    /**
     * Sets the *width* of this object.
     * 
     * @param {number} height 
     * @returns {object} This Flex instance.
     */
    setWidth(width) {
        this.width = width;
        resetWidths(this);
        if (this.flexDirection == FlexDirection.COLUMN) {
            for (let i = 0; i < this.items.length; i++) {
                let item = this.items[i];
                if (item.type == "Text") {
                    fitTextToColumn(this, item);
                }
            }
        }
        setItems(this);
        return this;
    }

    /**
     * Sets the *justifyContent* property of this object.
     * 
     * @param {JustifyContent} justifyContent 
     * @returns {object} This Flex instance.
     */
    setJustifyContent(justifyContent) {
        this.justifyContent = justifyContent;

        switch (justifyContent) {
            case JustifyContent.CENTER:
                if (this.flexDirection == FlexDirection.ROW) {
                    setAlignH(this, Alignment.CENTER);
                } else {
                    setAlignV(this, Alignment.CENTER);
                }
                break;

            case JustifyContent.FLEX_START:
                if (this.flexDirection == FlexDirection.ROW) {
                    setAlignH(this, Alignment.LEFT);
                } else {
                    setAlignV(this, Alignment.TOP);
                }
                break;

            case JustifyContent.FLEX_END:
                if (this.flexDirection == FlexDirection.ROW) {
                    setAlignH(this, Alignment.RIGHT);
                } else {
                    setAlignV(this, Alignment.BOTTOM);
                }
                break;

            case JustifyContent.SPACE_AROUND:
                setJustify(this);
                break;

            case JustifyContent.SPACE_BETWEEN:
                setJustify(this);
                break;

            default:
                break;
        }

        return this;
    }

    /**
     * Sets the *origin* property of this object.
     * 
     * @param {number} x 
     * @param {number} y 
     * @returns {object} This Flex instance.
     */
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

        setItems(this);

        return this;
    }

    /**
     * Sets the *scrollFactor* property of this object.
     * 
     * @param {number} x 
     * @param {number} [y = x] 
     * @returns {object} This Flex instance.
     */
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

    /**
     * Sets the x position of this object.
     * 
     * @param {number} x 
     * @returns {object} This Flex instance.
     */
    setX(x) {
        this.x = x;
        setItems(this);
        return this;
    }

    /**
     * Sets the y position of this object.
     * 
     * @param {number} y 
     * @returns {object} This Flex instance.
     */
    setY(y) {
        this.y = y;
        setItems(this);
        return this;
    }
}

export { Flex };