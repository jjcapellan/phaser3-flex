import { Alignment, AlignItems, FlexDirection, JustifyContent } from './constants.js';

/**
 * Sets cross axis center alignment
 * @param {string} dim Dimension: 'width' if row dir. and 'height' if column dir.
 * @param {number} bound getLeft() if row and getTop() if column
 * @param {string} setXY item property to set x or y. 'setX' if row, 'setY' if column
 */
function alignCrossCenter(f, dim, bound, setXY) {
    let items = f.items;
    let center = f[dim] / 2 + bound;
    let xy = 0;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item.setOrigin(0, 0);
        xy = center - item[dim] / 2;
        item[setXY](xy);
    }
}

function alignCrossStretch(f, dim, bound, setXY) {
    let items = f.items;
    let maxSize = f[dim] - 2 * f.padding;
    let xy = bound + f.padding;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (!item._isFlex && item.type != 'Text') {
            let center = f[dim] / 2 + bound;
            item.setOrigin(0, 0);
            xy = center - item[dim] / 2;
        }

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
        if (!item._isFlex && item.type != 'Text') continue;
        if (dim == 'width') {
            setItemDisplaySize(item, maxSize, item.height);
            continue;
        }
        setItemDisplaySize(item, item.width, maxSize);
    }
}

function alignEnd(f, dim, bound, setXY, isMainAxis) {
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
}

/**
 * Sets main axis center alignment
 * @param {object} f Flex object.
 * @param {string} dim Dimension: 'width' if row dir. and 'height' if column dir.
 * @param {number} itemsSize getItemsSize() if row dir and getItemsSize() if column dir.  
 * @param {number} bound getLeft() if row and getTop() if column
 * @param {string} setXY UiElement property to set x or y. 'setX' if row, 'setY' if column
 */
function alignMainCenter(f, dim, itemsSize, bound, setXY) {
    let items = f.items;
    let center = f[dim] / 2 + bound;
    let xy = center - itemsSize / 2;

    for (let i = 0; i < items.length; i++) {
        let item = items[i];
        item.setOrigin(0, 0);
        item[setXY](xy);
        xy += item[dim] + f.itemsMargin;
    }
}

function alignStart(f, dim, bound, setXY, isMainAxis) {
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
}

function checkHeight(f, height) {
    let totalHeight = height + f.padding * 2;
    if (totalHeight > f.height) {
        f.height = totalHeight;
    }
    updateBounds(f);
}

function checkWidth(f, width) {
    let totalWidth = width + f.padding * 2;
    if (totalWidth > f.width) {
        f.width = totalWidth;
    }
    updateBounds(f);
}

function fillH(f) {
    let group = f.items;
    let groupLength = f.items.length;
    let freeSpace = getFreeSpace(f);

    let itemX = f._bounds.left;

    for (let i = 0; i < groupLength; i++) {
        setItemSize(f, group[i], freeSpace);
        let item = group[i];
        item.setOrigin(0, 0);
        item.setX(itemX);
        itemX += item.width + f.itemsMargin;
    } // End for
}

function fillV(f) {
    let group = f.items;
    let groupLength = f.items.length;
    let freeSpace = getFreeSpace(f);

    let y = f._bounds.top;

    for (let i = 0; i < groupLength; i++) {
        setItemSize(f, group[i], freeSpace);
        let item = group[i];
        item.setOrigin(0, 0);
        item.setY(y);
        y += item.height + f.itemsMargin;
    } // End for
}

function fitHeight(f) {
    const max = f._heights.length ? Matmax(...f._heights) : 0;
    f.height = max + 2 * f.padding;
    updateBounds(f);
}

function fitTextToColumn(f, item) {
    let w = f.width - f.padding * 2;
    item.setWordWrapWidth(w);
    let b = item.getBounds();
    item.setFixedSize(w, b.height);
}

function fitWidth(f) {
    const max = f._widths.length ? Matmax(...f._widths) : 0;
    f.width = max + 2 * f.padding;
    updateBounds(f);
}

function getFreeSpace(f) {
    const dim = f.flexDirection == FlexDirection.ROW ? f.width : f.height;
    return dim - getItemsSize(f) - 2 * f.padding;
}

function getItemsSize(f) {
    const paddingsSum = (f.items.length - 1) * f.itemsMargin;
    return f._basisSum + paddingsSum;
}

function getLeft(f) {
    return f.x - f.width * f.origin.x;

}

function getTop(f) {
    return f.y - f.height * f.origin.y;
}

function resetHeights(f) {
    for (let i = 0; i < f.items.length; i++) {
        let item = f.items[i];
        setItemDisplaySize(item, item.width, f._heights[i]);
        item.height = f._heights[i];
    }
}

function resetWidths(f) {
    for (let i = 0; i < f.items.length; i++) {
        let item = f.items[i];
        setItemDisplaySize(item, f._widths[i], item.height);
        item.width = f._widths[i];
    }
}

function setAlignH(f, alignment) {

    if (alignment == Alignment.STRETCH) {
        alignCrossStretch(f, 'width', getLeft(f), 'setX');
        return;
    }

    if (f.flexDirection == FlexDirection.ROW) {
        let freeSpace = getFreeSpace(f);
        if (!f.fitContent && ((f._growSum && freeSpace >= 0) || freeSpace < 0)) {
            fillH(f);
            return;
        }
    }

    if (alignment == Alignment.LEFT) {
        if (f.flexDirection == FlexDirection.ROW) {
            alignStart(f, 'width', f._bounds.left, 'setX', true);
            return;
        }
        alignStart(f, 'width', f._bounds.left, 'setX', false);
        return;
    }

    if (alignment == Alignment.RIGHT) {
        if (f.flexDirection == FlexDirection.ROW) {
            alignEnd(f, 'width', f._bounds.right, 'setX', true);
            return;
        }
        alignEnd(f, 'width', f._bounds.right, 'setX', false);
        return;
    }

    if (alignment == Alignment.CENTER) {
        if (f.flexDirection == FlexDirection.ROW) {
            alignMainCenter(f, 'width', getItemsSize(f), getLeft(f), 'setX');
        } else {
            alignCrossCenter(f, 'width', getLeft(f), 'setX');
        }
        return;
    }


} // End setHAlign()

function setAlignV(f, alignment) {

    if (alignment == Alignment.STRETCH) {
        alignCrossStretch(f, 'height', getTop(f), 'setY');
        return;
    }

    if (f.flexDirection == FlexDirection.COLUMN) {
        let freeSpace = getFreeSpace(f);
        if (!f.fitContent && ((f._growSum && freeSpace >= 0) || freeSpace < 0)) {
            fillV();
            return;
        }
    }

    if (alignment == Alignment.TOP) {
        if (f.flexDirection == FlexDirection.COLUMN) {
            alignStart(f, 'height', f._bounds.top, 'setY', true);
            return;
        }
        alignStart(f, 'height', f._bounds.top, 'setY', false);
        return;
    }

    if (alignment == Alignment.BOTTOM) {
        if (f.flexDirection == FlexDirection.COLUMN) {
            alignEnd(f, 'height', f._bounds.bottom, 'setY', true);
            return;
        }
        alignEnd(f, 'height', f._bounds.bottom, 'setY', false);
        return;
    }

    if (alignment == Alignment.CENTER) {
        if (f.flexDirection == FlexDirection.COLUMN) {
            alignMainCenter(f, 'height', getItemsSize(f), getTop(f), 'setY');
        } else {
            alignCrossCenter(f, 'height', getTop(f), 'setY');
        }
        return;
    }

}// End setVAlign()

function setItemDisplaySize(item, width, height) {
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
}

function setItems(f) {
    updateBounds(f);
    f.setJustifyContent(f.justifyContent);
    f.setAlignItems(f.alignItems);
}

function setItemSize(f, item, freeSpace) {

    const isRow = f.flexDirection == FlexDirection.ROW;

    let dim = isRow ? 'width' : 'height';

    let dimValue = 0;

    if (freeSpace >= 0) {
        dimValue = (item.flexGrow / f._growSum) * freeSpace + item.basis;
    }

    if (freeSpace < 0) {
        dimValue = ((item.flexShrink * item.basis) / f._basisSum) * freeSpace + item.basis;
    }

    if (isRow) {
        setItemDisplaySize(item, dimValue, item.height);
    } else {
        setItemDisplaySize(item, item.width, dimValue);
    }

    item[dim] = dimValue;
}

function setJustifyH(f) {
    let group = f.items;
    let groupLength = f.items.length;
    let freeSpace = getFreeSpace(f);
    let padding = 0;
    let x = 0;

    if (f.justifyContent == JustifyContent.SPACE_AROUND) {
        padding = freeSpace / (groupLength + 1);
        x = getLeft(f) + f.padding + padding;
    } else {
        padding = freeSpace / (groupLength - 1);
        x = getLeft(f) + f.padding;
    }

    for (let i = 0; i < groupLength; i++) {
        let item = group[i];
        item.setOrigin(0, 0);
        item.setX(x);
        x += item.width + padding + f.itemsMargin;
    } // End for
}

function setJustifyV(f) {
    let group = f.items;
    let groupLength = f.items.length;
    let freeSpace = getFreeSpace(f);
    let padding = 0;
    let y = 0;

    if (f.justifyContent == JustifyContent.SPACE_AROUND) {
        padding = freeSpace / (groupLength + 1);
        y = getTop(f) + padding + f.padding;
    } else {
        padding = freeSpace / (groupLength - 1);
        y = getTop(f) + f.padding;
    }

    for (let i = 0; i < groupLength; i++) {
        let item = group[i];
        item.setOrigin(0, 0);
        item.setY(y);
        y += item.height + padding + f.itemsMargin;
    } // End for
}

function updateBounds(f) {
    let x = getLeft(f);
    let y = getTop(f);

    f._bounds = {
        left: x + f.padding,
        right: x + f.width - f.padding,
        top: y + f.padding,
        bottom: y + f.height - f.padding
    };
}

export {
    checkHeight,
    checkWidth,
    fitHeight,
    fitTextToColumn,
    fitWidth,
    getItemsSize,
    resetHeights,
    resetWidths,
    setAlignH,
    setAlignV,
    setItems,
    setJustifyH,
    setJustifyV
};