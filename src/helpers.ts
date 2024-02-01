/// <reference path="../node_modules/phaser/types/phaser.d.ts" />
import { Alignment, AlignItems, FlexDirection, Item, JustifyContent } from "./sharedtypes";
import { Flex } from "./flex";

const SetPosName = {
    width: "setX",
    height: "setY"
};

/**
 * Sets cross axis center alignment
 * @param f Flex object.
 * @param dim Dimension: "width" if row dir. and "height" if column dir.
 */
function alignCrossCenter(f: Flex, dim: string) {
    const setPos = SetPosName[dim];
    const bound = dim == "width" ? getLeft(f) : getTop(f);
    const center = f[dim] / 2 + bound;


    f.items.forEach(item => {
        item.setOrigin(0, 0);
        const position = center - item[dim] / 2;
        item[setPos](position);
    });
}

// This function affects only to flex items
function alignCrossStretch(f: Flex, dim: string) {
    const setPos = SetPosName[dim];
    const bound = dim == "width" ? getLeft(f) : getTop(f);
    let maxSize = f[dim] - 2 * f.padding;
    let position = bound + f.padding;

    f.items.forEach(item => {
        if (!item["_isFlex"]) return;

        item[setPos](position);
        if (item[dim] > maxSize) {
            maxSize = item[dim];
        }
    });

    f.items.forEach((item, index) => {
        if (!item["_isFlex"]) return;
        if (dim == "width") {
            f._widths[index] = item[dim];
        } else {
            f._heights[index] = item[dim];
        }
        const size: [number, number] = dim == "width" ? [maxSize, item.height] : [item.width, maxSize];
        setItemDisplaySize(item, ...size);
    });
}

function isMainAxis(dim: string, dir: FlexDirection) {
    return (dim == "width" && dir == FlexDirection.ROW) || (dim == "height" && dir == FlexDirection.COLUMN);
}

function alignEnd(f: Flex, dim: string) {
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
function alignMainCenter(f: Flex, dim: string) {
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

function alignStart(f: Flex, dim: string) {
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

function checkDimension(f: Flex, dim: string, value: number) {
    const totalDimension = value + f.padding * 2;
    if (totalDimension > f[dim]) {
        f[dim] = totalDimension;
    }
    updateBounds(f);
}

function checkHeight(f: Flex, height: number) {
    checkDimension(f, "height", height);
}

function checkWidth(f: Flex, width: number) {
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

function fillH(f: Flex) {
    fill(f, "width");
}

function fillV(f: Flex) {
    fill(f, "height");
}

function fitDimension(f: Flex, dim: string) {
    const max = f[`_${dim}s`].length ? Math.max(...f[`_${dim}s`]) : 0;
    f[dim] = max + 2 * f.padding;
    updateBounds(f);
}

function fitHeight(f: Flex) {
    fitDimension(f, "height");
}

function fitTextToColumn(f: Flex, item: Item) {
    let w = f.width - f.padding * 2;
    item["setWordWrapWidth"](w);
    let b = item["getBounds"]();
    item["setFixedSize"](w, b.height);
}

function fitWidth(f: Flex) {
    fitDimension(f, "width");
}

function getFreeSpace(f: Flex) {
    const dim = f.flexDirection == FlexDirection.ROW ? f.width : f.height;
    return dim - getItemsSize(f) - 2 * f.padding;
}

function getItemsSize(f: Flex) {
    const paddingsSum = (f.items.length - 1) * f.itemsMargin;
    return f._basisSum + paddingsSum;
}

function getLeft(f: Flex) {
    return f.x - f.width * f.origin.x;

}

function getTop(f: Flex) {
    return f.y - f.height * f.origin.y;
}

function resetHeights(f: Flex) {
    for (let i = 0; i < f.items.length; i++) {
        let item = f.items[i];
        setItemDisplaySize(item, item.width, f._heights[i]);
        item.height = f._heights[i];
    }
}

function resetWidths(f: Flex) {
    for (let i = 0; i < f.items.length; i++) {
        let item = f.items[i];
        setItemDisplaySize(item, f._widths[i], item.height);
        item.width = f._widths[i];
    }
}

function setAlignH(f: Flex, alignment: Alignment) {

    if (alignment == Alignment.STRETCH) {
        alignCrossStretch(f, "width");
        return;
    }

    if (f.flexDirection == FlexDirection.ROW) {
        let freeSpace = getFreeSpace(f);
        if ((f._growSum && freeSpace >= 0) || freeSpace < 0) {
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

function setAlignV(f: Flex, alignment: Alignment) {

    if (alignment == Alignment.STRETCH) {
        alignCrossStretch(f, "height");
        return;
    }

    if (f.flexDirection == FlexDirection.COLUMN) {
        let freeSpace = getFreeSpace(f);
        if ((f._growSum && freeSpace >= 0) || freeSpace < 0) {
            fillV(f);
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

function setItemDisplaySize(item: Item, width: number, height: number) {
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

function setItemSize(f: Flex, item: Item, freeSpace: number) {

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

function setJustify(f: Flex) {
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

function updateBounds(f: Flex) {
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