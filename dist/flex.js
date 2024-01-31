// src/sharedtypes.ts
var AlignItems = /* @__PURE__ */ ((AlignItems3) => {
  AlignItems3[AlignItems3["CENTER"] = 1] = "CENTER";
  AlignItems3[AlignItems3["FLEX_END"] = 2] = "FLEX_END";
  AlignItems3[AlignItems3["FLEX_START"] = 3] = "FLEX_START";
  AlignItems3[AlignItems3["STRETCH"] = 4] = "STRETCH";
  return AlignItems3;
})(AlignItems || {});
var FlexDirection = /* @__PURE__ */ ((FlexDirection2) => {
  FlexDirection2[FlexDirection2["COLUMN"] = 1] = "COLUMN";
  FlexDirection2[FlexDirection2["ROW"] = 2] = "ROW";
  return FlexDirection2;
})(FlexDirection || {});
var JustifyContent = /* @__PURE__ */ ((JustifyContent2) => {
  JustifyContent2[JustifyContent2["CENTER"] = 1] = "CENTER";
  JustifyContent2[JustifyContent2["FLEX_END"] = 2] = "FLEX_END";
  JustifyContent2[JustifyContent2["FLEX_START"] = 3] = "FLEX_START";
  JustifyContent2[JustifyContent2["SPACE_AROUND"] = 4] = "SPACE_AROUND";
  JustifyContent2[JustifyContent2["SPACE_BETWEEN"] = 5] = "SPACE_BETWEEN";
  return JustifyContent2;
})(JustifyContent || {});

// src/helpers.ts
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
  return dim == "width" && dir == 2 /* ROW */ || dim == "height" && dir == 1 /* COLUMN */;
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
  const dim = f.flexDirection == 2 /* ROW */ ? f.width : f.height;
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
  if (alignment == 6 /* STRETCH */) {
    alignCrossStretch(f, "width");
    return;
  }
  if (f.flexDirection == 2 /* ROW */) {
    let freeSpace = getFreeSpace(f);
    if (!f.fitContent && (f._growSum && freeSpace >= 0 || freeSpace < 0)) {
      fillH(f);
      return;
    }
  }
  if (alignment == 4 /* LEFT */) {
    if (f.flexDirection == 2 /* ROW */) {
      alignStart(f, "width");
      return;
    }
    alignStart(f, "width");
    return;
  }
  if (alignment == 5 /* RIGHT */) {
    if (f.flexDirection == 2 /* ROW */) {
      alignEnd(f, "width");
      return;
    }
    alignEnd(f, "width");
    return;
  }
  if (alignment == 2 /* CENTER */) {
    if (f.flexDirection == 2 /* ROW */) {
      alignMainCenter(f, "width");
    } else {
      alignCrossCenter(f, "width");
    }
    return;
  }
}
function setAlignV(f, alignment) {
  if (alignment == 6 /* STRETCH */) {
    alignCrossStretch(f, "height");
    return;
  }
  if (f.flexDirection == 1 /* COLUMN */) {
    let freeSpace = getFreeSpace(f);
    if (!f.fitContent && (f._growSum && freeSpace >= 0 || freeSpace < 0)) {
      fillV(f);
      return;
    }
  }
  if (alignment == 7 /* TOP */) {
    if (f.flexDirection == 1 /* COLUMN */) {
      alignStart(f, "height");
      return;
    }
    alignStart(f, "height");
    return;
  }
  if (alignment == 1 /* BOTTOM */) {
    if (f.flexDirection == 1 /* COLUMN */) {
      alignEnd(f, "height");
      return;
    }
    alignEnd(f, "height");
    return;
  }
  if (alignment == 2 /* CENTER */) {
    if (f.flexDirection == 1 /* COLUMN */) {
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
  const isRow = f.flexDirection == 2 /* ROW */;
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
  const dim = f.flexDirection == 2 /* ROW */ ? "width" : "height";
  const setPos = SetPosName[dim];
  let freeSpace = getFreeSpace(f);
  let padding = 0;
  let position = dim == "width" ? getLeft(f) : getTop(f);
  if (f.justifyContent == 4 /* SPACE_AROUND */) {
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

// src/flex.ts
var Flex = class {
  /**
   * X position. (Default = 0)
   */
  x;
  /**
   * Y position. (Default = 0)
   */
  y;
  /**
   * Width of this object. (Default = 0)
   */
  width;
  /**
   * Height of this object. (Default = 0)
   */
  height;
  /**
   * Minimum distance between this object content and its border. (Default = 10)
   */
  padding;
  /**
   * Minimum distance between items contained inside this object. (Default = 4)
   */
  itemsMargin;
  /**
   * Alignment of the items with respect to the cross axis. (Default = AlignItems.CENTER)
   */
  alignItems;
  /**
   * Sets how items are placed in the flex object defining the main axis. (Default = FlexDirection.ROW)
   */
  flexDirection;
  /**
   * Alignment of the items with respect to the main axis. (Default = JustifyContent.FLEX_START)
   */
  justifyContent;
  /**
   * Array of all items managed by this object.
   */
  items;
  /**
   * Position of this object anchor relative to its width and height. (x and y between 0 and 1).
   * Sets how this object is placed.
   */
  origin;
  /**
   * Original size of this object in the main axis. 
   */
  basis;
  /**
   * Should cross axis size fit to content?
   */
  fitContent;
  _fitContent;
  _fparent;
  _scrollFactorX;
  _scrollFactorY;
  _isFlex;
  _basisSum;
  _heights;
  _widths;
  _growSum;
  _bounds;
  constructor(config) {
    this.x = config.x || 0;
    this.y = config.y || 0;
    this.width = config.width || 0;
    this.height = config.height || 0;
    this.padding = config.padding || 10;
    this.itemsMargin = config.itemsMargin || 4;
    this.alignItems = config.alignItems || 1 /* CENTER */;
    this.flexDirection = config.flexDirection || 2 /* ROW */;
    this.justifyContent = config.justifyContent || 3 /* FLEX_START */;
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
    if (this.flexDirection == 2 /* ROW */ && !this.width || this.flexDirection == 1 /* COLUMN */ && !this.height) {
      this.fitContent = true;
    }
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
    if (this.width && item.type == "Text" && this.flexDirection == 1 /* COLUMN */) {
      fitTextToColumn(this, item);
    }
    item.basis = this.flexDirection == 2 /* ROW */ ? item.width : item.height;
    this._basisSum += item.basis;
    this.items.push(item);
    this._heights.push(item.height);
    this._widths.push(item.width);
    this._growSum += item.flexGrow;
    if (this.flexDirection == 2 /* ROW */) {
      checkHeight(this, item.height);
      if (this.fitContent) {
        checkWidth(this, getItemsSize(this));
      }
    }
    if (this.flexDirection == 1 /* COLUMN */) {
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
  /**
   * Each item managed by this object are destroyed.
   * 
   * @returns This Flex instance.
   */
  clear() {
    this.items.forEach((item) => {
      if (item._isFlex) {
        item.clear();
      }
    });
    this.items.forEach((item) => item.destroy());
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
    if (this.flexDirection == 2 /* ROW */) {
      fitHeight(this);
    }
    if (this.flexDirection == 1 /* COLUMN */) {
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
  setDisplaySize(width, height) {
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
  setAlignItems(alignItems) {
    if (this.alignItems == 4 /* STRETCH */ && alignItems != 4 /* STRETCH */) {
      if (this.flexDirection == 2 /* ROW */) {
        resetHeights(this);
      } else {
        resetWidths(this);
      }
      restoreFitContent(this);
    }
    this.alignItems = alignItems;
    switch (alignItems) {
      case 1 /* CENTER */:
        if (this.flexDirection == 2 /* ROW */) {
          setAlignV(this, 2 /* CENTER */);
        } else {
          setAlignH(this, 2 /* CENTER */);
        }
        break;
      case 3 /* FLEX_START */:
        if (this.flexDirection == 2 /* ROW */) {
          setAlignV(this, 7 /* TOP */);
        } else {
          setAlignH(this, 4 /* LEFT */);
        }
        break;
      case 2 /* FLEX_END */:
        if (this.flexDirection == 2 /* ROW */) {
          setAlignV(this, 1 /* BOTTOM */);
        } else {
          setAlignH(this, 5 /* RIGHT */);
        }
        break;
      case 4 /* STRETCH */:
        if (this.flexDirection == 2 /* ROW */) {
          setAlignV(this, 6 /* STRETCH */);
        } else {
          setAlignH(this, 6 /* STRETCH */);
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
  setFitContent(fitToContent) {
    this.fitContent = fitToContent;
    if (fitToContent) {
      if (this.flexDirection == 2 /* ROW */) {
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
  setHeight(height) {
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
  setWidth(width) {
    this.width = width;
    resetWidths(this);
    if (this.flexDirection == 1 /* COLUMN */) {
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
  setJustifyContent(justifyContent) {
    this.justifyContent = justifyContent;
    switch (justifyContent) {
      case 1 /* CENTER */:
        if (this.flexDirection == 2 /* ROW */) {
          setAlignH(this, 2 /* CENTER */);
        } else {
          setAlignV(this, 2 /* CENTER */);
        }
        break;
      case 3 /* FLEX_START */:
        if (this.flexDirection == 2 /* ROW */) {
          setAlignH(this, 4 /* LEFT */);
        } else {
          setAlignV(this, 7 /* TOP */);
        }
        break;
      case 2 /* FLEX_END */:
        if (this.flexDirection == 2 /* ROW */) {
          setAlignH(this, 5 /* RIGHT */);
        } else {
          setAlignV(this, 1 /* BOTTOM */);
        }
        break;
      case 4 /* SPACE_AROUND */:
        setJustify(this);
        break;
      case 5 /* SPACE_BETWEEN */:
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
  /**
   * Sets the *scrollFactor* property of this object.
   * 
   * @param x 
   * @param y 
   * @returns This Flex instance.
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
   * @param x 
   * @returns This Flex instance.
   */
  setX(x) {
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
  setY(y) {
    this.y = y;
    setItems(this);
    return this;
  }
};

// src/index.ts
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
