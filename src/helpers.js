import { Alignment, AlignItems, FlexDirection, JustifyContent } from './constants.js';

const h = {

    /**
     * Sets cross axis center alignment
     * @param {string} dim Dimension: 'width' if row dir. and 'height' if column dir.
     * @param {number} bound getLeft() if row and getTop() if column
     * @param {string} setXY item property to set x or y. 'setX' if row, 'setY' if column
     */
    alignCrossCenter: (f, dim, bound, setXY) => {
        let items = f.items;
        let center = f[dim] / 2 + bound;
        let xy = 0;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            item.setOrigin(0, 0);
            xy = center - item[dim] / 2;
            item[setXY](xy);
        }
    },

    alignCrossStretch: (f, dim, bound, setXY) => {
        let items = f.items;
        let maxSize = f[dim] - 2 * f.padding;
        let xy = bound + f.padding;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (item.fitContent && f.flexDirection != item.flexDirection) {
                item.fitContent = false;
            }
            item[setXY](xy);
            if (item[dim] > maxSize) {
                maxSize = item[dim];
            }
        }

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            if (dim == 'width') {
                h.setItemDisplaySize(item, maxSize, item.height);
                continue;
            }
            h.setItemDisplaySize(item, item.width, maxSize);
        }
    },

    alignEnd: (f, dim, bound, setXY, isMainAxis) => {
        let items = f.items;
        let xy = bound;

        for (let i = items.length - 1; i >= 0; i--) {
            let item = items[i];
            item.setOrigin(0, 0);
            item[setXY](xy - item[dim]);
            if (isMainAxis) {
                xy -= item[dim] + f.itemsMargin;
            }
        }
    },

    /**
     * Sets main axis center alignment
     * @param {object} f Flex object.
     * @param {string} dim Dimension: 'width' if row dir. and 'height' if column dir.
     * @param {number} itemsSize getItemsSize() if row dir and getItemsSize() if column dir.  
     * @param {number} bound getLeft() if row and getTop() if column
     * @param {string} setXY UiElement property to set x or y. 'setX' if row, 'setY' if column
     */
    alignMainCenter: (f, dim, itemsSize, bound, setXY) => {
        let items = f.items;
        let center = f[dim] / 2 + bound;
        let xy = center - itemsSize / 2;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            item.setOrigin(0, 0);
            item[setXY](xy);
            xy += item[dim] + f.itemsMargin;
        }
    },

    alignStart: (f, dim, bound, setXY, isMainAxis) => {
        let items = f.items;
        let xy = bound;

        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            item.setOrigin(0, 0);
            item[setXY](xy);
            if (isMainAxis) {
                xy += item[dim] + f.itemsMargin;
            }
        }
    },

    checkHeight: (f, height) => {
        let totalHeight = height + f.padding * 2;
        if (totalHeight > f.height) {
            f.height = totalHeight;
        }
        h.updateBounds(f);
    },

    checkWidth: (f, width) => {
        let totalWidth = width + f.padding * 2;
        if (totalWidth > f.width) {
            f.width = totalWidth;
        }
        h.updateBounds(f);
    },

    fillH: (f) => {
        let group = f.items;
        let groupLength = f.items.length;
        h.resetWidths(f);
        let freeSpace = h.getFreeSpaceH(f);

        let itemX = f._bounds.left;

        for (let i = 0; i < groupLength; i++) {
            h.setItemWidth(f, group[i], freeSpace);
            let item = group[i];
            item.setOrigin(0, 0);
            item.setX(itemX);
            itemX += item.width + f.itemsMargin;
        } // End for
    },

    fillV: (f) => {
        let group = f.items;
        let groupLength = f.items.length;
        h.resetHeights(f);
        let freeSpace = h.getFreeSpaceV(f);

        let y = f._bounds.top;

        for (let i = 0; i < groupLength; i++) {
            h.setItemHeight(f, group[i], freeSpace);
            let item = group[i];
            item.setOrigin(0, 0);
            item.setY(y);
            y += item.height + f.itemsMargin;
        } // End for
    },

    getFreeSpaceH: (f) => {
        return f.width - h.getItemsSize(f) - 2 * f.padding;
    },

    getFreeSpaceV: (f) => {
        return f.height - h.getItemsSize(f) - 2 * f.padding;
    },

    getItemsSize: (f) => {
        let sizesSum = 0;
        for (let i = 0; i < f.items.length; i++) {
            let item = f.items[i];
            sizesSum += item.basis;
        }
        let paddingsSum = (f.items.length - 1) * f.itemsMargin;
        return sizesSum + paddingsSum;
    },

    getLeft: (f) => {
        return f.x - f.width * f.origin.x;

    },

    getTop: (f) => {
        return f.y - f.height * f.origin.y;
    },

    resetHeights: (f) => {
        for (let i = 0; i < f.items.length; i++) {
            let item = f.items[i];
            h.setItemDisplaySize(item, item.width, f._heights[i]);
            item.height = f._heights[i];
        }
    },

    resetWidths: (f) => {
        for (let i = 0; i < f.items.length; i++) {
            let item = f.items[i];
            h.setItemDisplaySize(item, f._widths[i], item.height);
            item.width = f._widths[i];
        }
    },

    setAlignH: (f, alignment) => {

        if (alignment == Alignment.STRETCH) {
            h.alignCrossStretch(f, 'width', h.getLeft(f), 'setX');
            return;
        }

        if ((f._growSum || f._shrinkSum) && f.flexDirection == FlexDirection.ROW) {
            let freeSpace = h.getFreeSpaceH(f);
            if (!f.fitContent && ((f._growSum && freeSpace >= 0) || (f._shrinkSum && freeSpace < 0))) {
                h.fillH(f);
                return;
            }
        }

        if (alignment == Alignment.LEFT) {
            if (f.flexDirection == FlexDirection.ROW) {
                h.alignStart(f, 'width', f._bounds.left, 'setX', true);
                return;
            }
            h.alignStart(f, 'width', f._bounds.left, 'setX', false);
            return;
        }

        if (alignment == Alignment.RIGHT) {
            if (f.flexDirection == FlexDirection.ROW) {
                h.alignEnd(f, 'width', f._bounds.right, 'setX', true);
                return;
            }
            h.alignEnd(f, 'width', f._bounds.right, 'setX', false);
            return;
        }

        if (alignment == Alignment.CENTER) {
            if (f.flexDirection == FlexDirection.ROW) {
                h.alignMainCenter(f, 'width', h.getItemsSize(f), h.getLeft(f), 'setX');
            } else {
                h.alignCrossCenter(f, 'width', h.getLeft(f), 'setX');
            }
            return;
        }


    }, // End setHAlign()

    setAlignV: (f, alignment) => {

        if (alignment == Alignment.STRETCH) {
            h.alignCrossStretch(f, 'height', h.getTop(f), 'setY');
            return;
        }

        if ((f._growSum || f._shrinkSum) && f.flexDirection == FlexDirection.COLUMN) {
            let freeSpace = h.getFreeSpaceV(f);
            if (!f.fitContent && ((f._growSum && freeSpace >= 0) || (f._shrinkSum && freeSpace < 0))) {
                h.fillV();
                return;
            }
        }

        if (alignment == Alignment.TOP) {
            if (f.flexDirection == FlexDirection.COLUMN) {
                h.alignStart(f, 'height', f._bounds.top, 'setY', true);
                return;
            }
            h.alignStart(f, 'height', f._bounds.top, 'setY', false);
            return;
        }

        if (alignment == Alignment.BOTTOM) {
            if (f.flexDirection == FlexDirection.COLUMN) {
                h.alignEnd(f, 'height', f._bounds.bottom, 'setY', true);
                return;
            }
            h.alignEnd(f, 'height', f._bounds.bottom, 'setY', false);
            return;
        }

        if (alignment == Alignment.CENTER) {
            if (f.flexDirection == FlexDirection.COLUMN) {
                h.alignMainCenter(f, 'height', h.getItemsSize(f), h.getTop(f), 'setY');
            } else {
                h.alignCrossCenter(f, 'height', h.getTop(f), 'setY');
            }
            return;
        }

    }, // End setVAlign()

    setItemDisplaySize: (item, width, height) => {
        if (item['type'] == 'Text') {
            // Not allow to change text bounds height
            if (item.height != height) {
                return;
            }
            let b = item['getBounds']();
            item['setWordWrapWidth'](width);
            item['setFixedSize'](width, height);
            return;
        }
        item.setDisplaySize(width, height);
    },

    setItems: (f) => {
        h.updateBounds(f);
        f.setJustifyContent(f.justifyContent);
        f.setAlignItems(f.alignItems);
    },

    setItemHeight: (f, item, freeSpace) => {
        if (f.flexDirection == FlexDirection.ROW || !item.flexGrow) {
            return;
        }

        let height = 0;

        if (freeSpace >= 0) {
            if (!item.flexGrow) {
                return;
            }
            height = (item.flexGrow / f._growSum) * freeSpace + item.height;
        }

        if (freeSpace < 0) {
            if (!item.flexShrink) {
                return;
            }
            height = (item.flexShrink / f._shrinkSum) * freeSpace + item.height;
        }

        h.setItemDisplaySize(item, item.width, height);
        item.height = height;
    },

    setItemWidth: (f, item, freeSpace) => {

        if (f.flexDirection == FlexDirection.COLUMN || !item.flexGrow) {
            return;
        }

        let width = 0;

        if (freeSpace >= 0) {
            if (!item.flexGrow) {
                return;
            }
            width = (item.flexGrow / f._growSum) * freeSpace + item.width;
        }

        if (freeSpace < 0) {
            if (!item.flexShrink) {
                return;
            }
            width = (item.flexShrink / f._shrinkSum) * freeSpace + item.width;
        }

        h.setItemDisplaySize(item, width, item.height);
        item.width = width;
    },

    setJustifyH: (f) => {
        let group = f.items;
        let groupLength = f.items.length;
        let freeSpace = h.getFreeSpaceH(f);
        let padding = 0;
        let x = 0;

        if (f.justifyContent == JustifyContent.SPACE_AROUND) {
            padding = freeSpace / (groupLength + 1);
            x = h.getLeft(f) + f.padding + padding;
        } else {
            padding = freeSpace / (groupLength - 1);
            x = h.getLeft(f) + f.padding;
        }

        for (let i = 0; i < groupLength; i++) {
            let item = group[i];
            item.setOrigin(0, 0);
            item.setX(x);
            x += item.width + padding + f.itemsMargin;
        } // End for
    },

    setJustifyV: (f) => {
        let group = f.items;
        let groupLength = f.items.length;
        let freeSpace = h.getFreeSpaceV(f);
        let padding = 0;
        let y = 0;

        if (f.justifyContent == JustifyContent.SPACE_AROUND) {
            padding = freeSpace / (groupLength + 1);
            y = h.getTop(f) + padding + f.padding;
        } else {
            padding = freeSpace / (groupLength - 1);
            y = h.getTop(f) + f.padding;
        }

        for (let i = 0; i < groupLength; i++) {
            let item = group[i];
            item.setOrigin(0, 0);
            item.setY(y);
            y += item.height + padding + f.itemsMargin;
        } // End for
    },

    updateBounds: (f) => {
        let x = h.getLeft(f);
        let y = h.getTop(f);

        f._bounds = {
            left: x + f.padding,
            right: x + f.width - f.padding,
            top: y + f.padding,
            bottom: y + f.height - f.padding
        };
    }
};

export { h };