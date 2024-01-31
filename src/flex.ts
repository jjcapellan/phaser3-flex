import {
    AlignItems,
    Alignment,
    FlexDirection,
    Item,
    JustifyContent,
} from "./sharedtypes"

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
} from "./helpers";

class Flex {
    /**
     * X position. (Default = 0)
     */
    x: number;
    /**
     * Y position. (Default = 0)
     */
    y: number;
    /**
     * Width of this object. (Default = 0)
     */
    width: number;
    /**
     * Height of this object. (Default = 0)
     */
    height: number;
    /**
     * Minimum distance between this object content and its border. (Default = 10)
     */
    padding: number;
    /**
     * Minimum distance between items contained inside this object. (Default = 4)
     */
    itemsMargin: number;
    /**
     * Alignment of the items with respect to the cross axis. (Default = AlignItems.CENTER)
     */
    alignItems: number;
    /**
     * Sets how items are placed in the flex object defining the main axis. (Default = FlexDirection.ROW)
     */
    flexDirection: number;
    /**
     * Alignment of the items with respect to the main axis. (Default = JustifyContent.FLEX_START)
     */
    justifyContent: number;
    /**
     * Array of all items managed by this object.
     */
    items: Item[];
    /**
     * Position of this object anchor relative to its width and height. (x and y between 0 and 1).
     * Sets how this object is placed.
     */
    origin: { x: number, y: number };
    /**
     * Original size of this object in the main axis. 
     */
    basis: number;
    /**
     * Should cross axis size fit to content?
     */
    fitContent: boolean;

    _fitContent: boolean;
    _fparent: Flex;
    _scrollFactorX: number;
    _scrollFactorY: number;
    _isFlex: boolean;
    _basisSum: number;
    _heights: number[];
    _widths: number[];
    _growSum: number;
    _bounds: { left: number, right: number, top: number, bottom: number };

    constructor(config: Config) {
        
        this.x = config.x || 0;        
        this.y = config.y || 0;        
        this.width = config.width || 0;        
        this.height = config.height || 0;        
        this.padding = config.padding || 10;        
        this.itemsMargin = config.itemsMargin || 4;        
        this.alignItems = config.alignItems || AlignItems.CENTER;        
        this.flexDirection = config.flexDirection || FlexDirection.ROW;        
        this.justifyContent = config.justifyContent || JustifyContent.FLEX_START;
        
        this.items = [];        
        this.fitContent = false;        
        this.origin = { x: 0, y: 0 };

        this._scrollFactorX = 0;
        this._scrollFactorY = 0;
        this._fparent = null;
        this._isFlex = true;
        this._basisSum = 0;
        this._heights = [];
        this._widths = [];
        this._growSum = 0;
        this._bounds = { left: 0, right: 0, top: 0, bottom: 0 };


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
     * @param item 
     * @param flexGrow 
     * @param flexShrink 
     * @returns This Flex instance.
     */
    add(item: Item, flexGrow: number = 0, flexShrink: number = 1): Flex {
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
     * @returns This Flex instance.
     */
    clear(): Flex {
        this.items.forEach(item => {
            if (item._isFlex) {
                item.clear();
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
     * @param index Index of the item to be removed in the items array of this instance. 
     * @param destroy The item should be destroyed?.
     * @returns This Flex instance.
     */
    remove(index: number, destroy: boolean): Flex {
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
     * @param width 
     * @param height 
     * @returns This Flex instance. 
     */
    setDisplaySize(width: number, height: number): Flex {
        this.setWidth(width);
        this.setHeight(height);

        return this;
    }

    /**
     * Disposes all resources used by this object.
     * 
     */
    destroy() {
        this.clear();
        this.items = null;
        this._widths = null;
        this._heights = null;
        this._bounds = null;
        this.origin = null;
        this._fparent = null;
    }

    /**
     * Sets the *alignItems* property of this object.
     * 
     * @param alignItems 
     * @returns This Flex instance. 
     */
    setAlignItems(alignItems: AlignItems): Flex {

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
     * @param fitToContent 
     * @returns This Flex instance.
     */
    setFitContent(fitToContent: boolean): Flex {
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
     * @param height 
     * @returns This Flex instance.
     */
    setHeight(height: number): Flex {
        this.height = height;
        resetHeights(this);
        setItems(this);
        return this;
    }

    /**
     * Sets the *width* of this object.
     * 
     * @param height 
     * @returns This Flex instance.
     */
    setWidth(width: number): Flex {
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
     * @param justifyContent 
     * @returns This Flex instance.
     */
    setJustifyContent(justifyContent: JustifyContent): Flex {
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
     * @param x 
     * @param y 
     * @returns This Flex instance.
     */
    setOrigin(x: number, y: number): Flex {
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
     * @param x 
     * @param y 
     * @returns This Flex instance.
     */
    setScrollFactor(x: number, y: number | undefined): Flex {
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
     * @param x 
     * @returns This Flex instance.
     */
    setX(x: number): Flex {
        this.x = x;
        setItems(this);
        return this;
    }

    /**
     * Sets the y position of this object.
     * 
     * @param y 
     * @returns This Flex instance.
     */
    setY(y: number): Flex {
        this.y = y;
        setItems(this);
        return this;
    }
}

interface Config {
    x: number,
    y: number,
    width: number,
    height: number,
    padding: number,
    itemsMargin: number,
    alignItems: number,
    flexDirection: number,
    justifyContent: number
}

export { Flex };