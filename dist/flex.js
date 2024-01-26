// src/constants.js
var Alignment = {
  BOTTOM: 1,
  CENTER: 2,
  JUSTIFY: 3,
  LEFT: 4,
  RIGHT: 5,
  STRETCH: 6,
  TOP: 7
};
var AlignItems = {
  CENTER: 1,
  FLEX_END: 2,
  FLEX_START: 3,
  STRETCH: 4
};
var FlexDirection = {
  COLUMN: 1,
  ROW: 2
};
var JustifyContent = {
  CENTER: 1,
  FLEX_END: 2,
  FLEX_START: 3,
  SPACE_AROUND: 4,
  SPACE_BETWEEN: 5
};

// src/helpers.js
var SetPosName = {
  width: "setX",
  height: "setY"
};
function alignCrossCenter(f, dim) {
  const setPos = SetPosName[dim];
  const bound = dim == "width" ? getLeft(f) : getTop(f);
  const center = f[dim] / 2 + bound;
  f.items.forEach((item) => {
    item.setOrigin(0, 0);
    const position = center - item[dim] / 2;
    item[setPos](position);
  });
}
function alignCrossStretch(f, dim) {
  const setPos = SetPosName[dim];
  const bound = dim == "width" ? getLeft(f) : getTop(f);
  let maxSize = f[dim] - 2 * f.padding;
  let position = bound + f.padding;
  f.items.forEach((item) => {
    if (!item._isFlex)
      return;
    if (item.fitContent && f.flexDirection != item.flexDirection) {
      item._fitContent = item.fitContent;
      item.fitContent = false;
    }
    item[setPos](position);
    if (item[dim] > maxSize) {
      maxSize = item[dim];
    }
  });
  f.items.forEach((item, index) => {
    if (!item._isFlex)
      return;
    if (dim == "width") {
      f._widths[index] = item[dim];
    } else {
      f._heights[index] = item[dim];
    }
    const size = dim == "width" ? [maxSize, item.height] : [item.width, maxSize];
    setItemDisplaySize(item, ...size);
  });
}
function isMainAxis(dim, dir) {
  return dim == "width" && dir == FlexDirection.ROW || dim == "height" && dir == FlexDirection.COLUMN;
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
function alignMainCenter(f, dim) {
  const setPos = SetPosName[dim];
  const bound = dim == "width" ? getLeft(f) : getTop(f);
  const itemsSize = getItemsSize(f);
  let center = f[dim] / 2 + bound;
  let position = center - itemsSize / 2;
  f.items.forEach((item) => {
    item.setOrigin(0, 0);
    item[setPos](position);
    position += item[dim] + f.itemsMargin;
  });
}
function alignStart(f, dim) {
  const setPos = SetPosName[dim];
  let position = f._bounds[dim == "width" ? "left" : "top"];
  f.items.forEach((item) => {
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
  f.items.forEach((item) => {
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
function restoreFitContent(f) {
  f.items.forEach((item) => {
    if (item._isFlex) {
      item.fitContent = item._fitContent;
    }
  });
}
function setAlignH(f, alignment) {
  if (alignment == Alignment.STRETCH) {
    alignCrossStretch(f, "width");
    return;
  }
  if (f.flexDirection == FlexDirection.ROW) {
    let freeSpace = getFreeSpace(f);
    if (!f.fitContent && (f._growSum && freeSpace >= 0 || freeSpace < 0)) {
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
}
function setAlignV(f, alignment) {
  if (alignment == Alignment.STRETCH) {
    alignCrossStretch(f, "height");
    return;
  }
  if (f.flexDirection == FlexDirection.COLUMN) {
    let freeSpace = getFreeSpace(f);
    if (!f.fitContent && (f._growSum && freeSpace >= 0 || freeSpace < 0)) {
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
}
function setItemDisplaySize(item, width, height) {
  if (item["type"] == "Text") {
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
    dimValue = item.flexGrow / f._growSum * freeSpace + item.basis;
  }
  if (freeSpace < 0) {
    dimValue = item.flexShrink * item.basis / f._basisSum * freeSpace + item.basis;
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
  f.items.forEach((item) => {
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

// src/flex.js
var Flex = class {
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
    this._fparent = null;
    this.items = [];
    this._isFlex = true;
    this._basisSum = 0;
    this._heights = [];
    this._widths = [];
    this._growSum = 0;
    this._bounds = {};
    if (this.flexDirection == FlexDirection.ROW && !this.width || this.flexDirection == FlexDirection.COLUMN && !this.height) {
      this.fitContent = true;
    }
    this._fitContent = this.fitContent;
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
    if (this._fparent)
      this._fparent.setX(this._fparent.x);
    return this;
  }
  clear() {
    this.items.forEach((item) => {
      if (item._isFlex) {
        item.clear(true);
      }
    });
    this.items.forEach((item) => item.destroy());
    this.items = [];
    this._heights = [];
    this._widths = [];
    this._basisSum = 0;
    return this;
  }
  remove(index, destroy) {
    if (this.items[index] == void 0) {
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
  setDisplaySize(width, height) {
    this.setWidth(width);
    this.setHeight(height);
  }
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
  setHeight(height) {
    this.height = height;
    resetHeights(this);
    setItems(this);
    return this;
  }
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
  setOrigin(x, y) {
    if (y == void 0) {
      y = x;
    }
    this.origin.x = x;
    this.origin.y = y;
    if (x > 1) {
      this.origin.x = 1;
    }
    ;
    if (x < 0) {
      this.origin.x = 0;
    }
    ;
    if (y > 1) {
      this.origin.y = 1;
    }
    ;
    if (y < 0) {
      this.origin.y = 0;
    }
    ;
    setItems(this);
    return this;
  }
  // Items shouldn"t move
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
    setItems(this);
    return this;
  }
  setY(y) {
    this.y = y;
    setItems(this);
    return this;
  }
};

// src/index.js
if (typeof window != "undefined") {
  globalThis.Fbx = {
    Flex,
    AlignItems,
    FlexDirection,
    JustifyContent
  };
}
export {
  AlignItems,
  Flex,
  FlexDirection,
  JustifyContent
};
