import { Alignment, AlignItems, FlexDirection, JustifyContent } from "./constants.js";

const SetPosName = {
    width: "setX",
    height: "setY"
};

/**
 * Sets cross axis center alignment
 * @param {object} f Flex object.
 * @param {string} dim Dimension: "width" if row dir. and "height" if column dir.
 */
function alignCrossCenter(f, dim) {
    const setPos = SetPosName[dim];
    const bound = dim == "width" ? getLeft(f) : getTop(f);
    const center = f[dim] / 2 + bound;


    f.items.forEach(item => {
        item.setOrigin(0, 0);
        const position = center - item[dim] / 2;
        item[setPos](position);
    });
}

function alignCrossStretch(f, dim) {
    const setPos = SetPosName[dim];
    const bound = dim == "width" ? getLeft(f) : getTop(f);
    let maxSize = f[dim] - 2 * f.padding;
    let position = bound + f.padding; console.log(f.items);

    f.items.forEach(item => {
        if (!item._isFlex && item.type != "Text") {
            item.setOrigin(0, 0);
        }
        if (item.fitContent && f.flexDirection != item.flexDirection) {
            item.fitContent = false;
        }
        item[setPos](position);
        if (item[dim] > maxSize) {
            maxSize = item[dim];
        }
    });
    // TO DO : support for flex object
    f.items.forEach(item => {
        if (item._isFlex || item.type == "Text") return;
        const size = dim == "width" ? [maxSize, item.height] : [item.width, maxSize];
        setItemDisplaySize(item, ...size);
    });
}

function isMainAxis(dim, dir) {
    return (dim == "width" && dir == FlexDirection.ROW) || (dim == "height" && dir == FlexDirection.COLUMN);
}

function alignEnd(f, dim) {
    const items = f.items;
    const setPos = SetPosName[dim];
    let position = f._bounds[dim == "width" ? "right" : "bottom"];

    for (let i = items.length - 1; i >= 0; i--) {
        const item = items[i];
        item.setOrigin(0, 0);
        item[setPos](position - item[dim]);
        if (isMainAxis(dim, f.flexDirection)) {
            position -= item[dim] + f.itemsMargin;
        }
    }
}

/**
 * Sets main axis center alignment
 * @param {object} f Flex object.
 * @param {string} dim Dimension: "width" if row dir. and "height" if column dir.
 */
function alignMainCenter(f, dim) {
    const setPos = SetPosName[dim];
    const bound = dim == "width" ? getLeft(f) : getTop(f);
    const itemsSize = getItemsSize(f);
    let center = f[dim] / 2 + bound;
    let position = center - itemsSize / 2;

    f.items.forEach(item => {
        item.setOrigin(0, 0);
        item[setPos](position);
        position += item[dim] + f.itemsMargin;
    });
}

function alignStart(f, dim) {
    const setPos = SetPosName[dim];
    let position = f._bounds[dim == "width" ? "left" : "top"];

    f.items.forEach(item => {
        item.setOrigin(0, 0);
        item[setPos](position);
        if (isMainAxis(dim, f.flexDirection)) {
            position += item[dim] + f.itemsMargin;
        }
    });
}

function checkDimension(f, dim, value) {
    const totalDimension = value + f.padding * 2;
    if (totalDimension > f[dim]) {
        f[dim] = totalDimension;
    }
    updateBounds(f);
}

function checkHeight(f, height) {
    checkDimension(f, "height", height);
}

function checkWidth(f, width) {
    checkDimension(f, "width", width);
}

function fill(f, dim) {
    const freeSpace = getFreeSpace(f);
    const setPos = SetPosName[dim];

    let position = f._bounds[dim == "width" ? "left" : "top"];

    f.items.forEach(item => {
        setItemSize(f, item, freeSpace);
        item.setOrigin(0, 0);
        item[setPos](position);
        position += item[dim] + f.itemsMargin;
    });
}

function fillH(f) {
    fill(f, "width");
}

function fillV(f) {
    fill(f, "height");
}

function fitDimension(f, dim) {
    const max = f[`_${dim}s`].length ? Math.max(...f[`_${dim}s`]) : 0;
    f[dim] = max + 2 * f.padding;
    updateBounds(f);
}

function fitHeight(f) {
    fitDimension(f, "height");
}

function fitTextToColumn(f, item) {
    let w = f.width - f.padding * 2;
    item.setWordWrapWidth(w);
    let b = item.getBounds();
    item.setFixedSize(w, b.height);
}

function fitWidth(f) {
    fitDimension(f, "width");
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
        alignCrossStretch(f, "width");
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
            alignStart(f, "width");
            return;
        }
        alignStart(f, "width");
        return;
    }

    if (alignment == Alignment.RIGHT) {
        if (f.flexDirection == FlexDirection.ROW) {
            alignEnd(f, "width");
            return;
        }
        alignEnd(f, "width");
        return;
    }

    if (alignment == Alignment.CENTER) {
        if (f.flexDirection == FlexDirection.ROW) {
            alignMainCenter(f, "width");
        } else {
            alignCrossCenter(f, "width");
        }
        return;
    }


} // End setHAlign()

function setAlignV(f, alignment) {

    if (alignment == Alignment.STRETCH) {
        alignCrossStretch(f, "height");
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
            alignStart(f, "height");
            return;
        }
        alignStart(f, "height");
        return;
    }

    if (alignment == Alignment.BOTTOM) {
        if (f.flexDirection == FlexDirection.COLUMN) {
            alignEnd(f, "height");
            return;
        }
        alignEnd(f, "height");
        return;
    }

    if (alignment == Alignment.CENTER) {
        if (f.flexDirection == FlexDirection.COLUMN) {
            alignMainCenter(f, "height");
        } else {
            alignCrossCenter(f, "height");
        }
        return;
    }

}// End setVAlign()

function setItemDisplaySize(item, width, height) {
    if (item["type"] == "Text") {
        // Not allow to change text bounds height
        if (item.height != height) {
            return;
        }
        item["setWordWrapWidth"](width);
        item["setFixedSize"](width, height);
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

    let dim = isRow ? "width" : "height";

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

function setJustify(f) {
    const dim = f.flexDirection == FlexDirection.ROW ? "width" : "height";
    const setPos = SetPosName[dim];
    let freeSpace = getFreeSpace(f);
    let padding = 0;
    let position = dim == "width" ? getLeft(f) : getTop(f);

    if (f.justifyContent == JustifyContent.SPACE_AROUND) {
        padding = freeSpace / (f.items.length + 1);
        position += f.padding + padding;
    } else {
        padding = freeSpace / (f.items.length - 1);
        position += f.padding;
    }

    f.items.forEach(item => {
        item.setOrigin(0, 0);
        item[setPos](position);
        position += item[dim] + padding + f.itemsMargin;
    });
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
    setJustify
};