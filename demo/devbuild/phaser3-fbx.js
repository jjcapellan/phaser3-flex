(() => {
  // src/constants.js
  var Alignment = {
    BOTTOM: 0,
    CENTER: 1,
    JUSTIFY: 2,
    LEFT: 3,
    RIGHT: 4,
    STRETCH: 5,
    TOP: 6
  };
  var AlignItems = {
    CENTER: 0,
    FLEX_END: 1,
    FLEX_START: 2,
    STRETCH: 3
  };
  var FlexDirection = {
    COLUMN: 0,
    ROW: 1
  };
  var JustifyContent = {
    CENTER: 0,
    FLEX_END: 1,
    FLEX_START: 2,
    SPACE_AROUND: 3,
    SPACE_BETWEEN: 4
  };

  // src/helpers.js
  var h = {
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
      let maxSize = (void 0)[dim] - 2 * (void 0).padding;
      let xy = bound + f.padding;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        if (item.fitContent && (void 0).flexDirection != item.flexDirection) {
          item.fitContent = false;
        }
        item[setXY](xy);
        if (item[dim] > maxSize) {
          maxSize = item[dim];
        }
      }
      for (let i = 0; i < items.length; i++) {
        let item = items[i].item;
        if (dim == "width") {
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
     * @param {number} itemsSize getItemsWidth() if row dir and getItemsHeight() if column dir.  
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
        let item = group[i].item;
        item.setOrigin(0, 0);
        item.setX(itemX);
        itemX += item.width + f.itemsMargin;
      }
    },
    fillV: (f) => {
      let group = f.items;
      let groupLength = f.items.length;
      h.resetHeights(f);
      let freeSpace = h.getFreeSpaceV(f);
      let y = f._bounds.top;
      for (let i = 0; i < groupLength; i++) {
        h.setItemHeight(f, group[i], freeSpace);
        let item = group[i].item;
        item.setOrigin(0, 0);
        item.setY(y);
        y += item.height + f.itemsMargin;
      }
    },
    getFreeSpaceH: (f) => {
      return f.width - h.getItemsWidth() - 2 * f.padding;
    },
    getFreeSpaceV: (f) => {
      return f.height - h.getItemsHeight() - 2 * f.padding;
    },
    getItemsWidth: (f) => {
      let group = f.items;
      let groupLength = f.items.length;
      let widthsSum = 0;
      for (let i = 0; i < groupLength; i++) {
        let item = group[i].item;
        widthsSum += item.width;
      }
      let paddingsSum = (groupLength - 1) * f.itemsMargin;
      return widthsSum + paddingsSum;
    },
    getItemsHeight: (f) => {
      let group = f.items;
      let groupLength = f.items.length;
      let heightsSum = 0;
      for (let i = 0; i < groupLength; i++) {
        let item = group[i].item;
        heightsSum += item.height;
      }
      let paddingsSum = (groupLength - 1) * f.itemsMargin;
      return heightsSum + paddingsSum;
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
        h.setItemDisplaySize(f, item, item.width, f.heights[i]);
        item.height = f.heights[i];
      }
    },
    resetWidths: (f) => {
      for (let i = 0; i < f.items.length; i++) {
        let item = f.items[i].item;
        h.setItemDisplaySize(item, f._widths[i], item.height);
        item.width = f._widths[i];
      }
    },
    setAlignH: (f, alignment) => {
      if (alignment == Alignment.STRETCH) {
        h.alignCrossStretch(f, "width", h.getLeft(f), "setX");
        return;
      }
      if ((f.growSum || f.shrinkSum) && f.flexDirection == FlexDirection.ROW) {
        let freeSpace = h.getFreeSpaceH(f);
        if (!f.fitContent && (f.growSum && freeSpace >= 0 || f.shrinkSum && freeSpace < 0)) {
          h.fillH(f);
          return;
        }
      }
      if (alignment == Alignment.LEFT) {
        if (f.flexDirection == FlexDirection.ROW) {
          h.alignStart(f, "width", f._bounds.left, "setX", true);
          return;
        }
        h.alignStart(f, "width", f._bounds.left, "setX", false);
        return;
      }
      if (alignment == Alignment.RIGHT) {
        if (f.flexDirection == FlexDirection.ROW) {
          h.alignEnd(f, "width", f._bounds.right, "setX", true);
          return;
        }
        h.alignEnd(f, "width", f._bounds.right, "setX", false);
        return;
      }
      if (alignment == Alignment.CENTER) {
        if (f.flexDirection == FlexDirection.ROW) {
          h.alignMainCenter(f, "width", h.getItemsWidth(f), h.getLeft(f), "setX");
        } else {
          h.alignCrossCenter(f, "width", h.getLeft(f), "setX");
        }
        return;
      }
    },
    // End setHAlign()
    setAlignV: (f, alignment) => {
      if (alignment == Alignment.STRETCH) {
        h.alignCrossStretch(f, "height", h.getTop(f), "setY");
        return;
      }
      if ((f.growSum || f.shrinkSum) && f.flexDirection == FlexDirection.COLUMN) {
        let freeSpace = h.getFreeSpaceV(f);
        if (!f.fitContent && (f.growSum && freeSpace >= 0 || f.shrinkSum && freeSpace < 0)) {
          h.fillV();
          return;
        }
      }
      if (alignment == Alignment.TOP) {
        if (f.flexDirection == FlexDirection.COLUMN) {
          h.alignStart(f, "height", f._bounds.top, "setY", true);
          return;
        }
        h.alignStart(f, "height", f._bounds.top, "setY", false);
        return;
      }
      if (alignment == Alignment.BOTTOM) {
        if (f.flexDirection == FlexDirection.COLUMN) {
          h.alignEnd(f, "height", f._bounds.bottom, "setY", true);
          return;
        }
        h.alignEnd(f, "height", f._bounds.bottom, "setY", false);
        return;
      }
      if (alignment == Alignment.CENTER) {
        if (f.flexDirection == FlexDirection.COLUMN) {
          h.alignMainCenter(f, "height", h.getItemsHeight(f), h.getTop(f), "setY");
        } else {
          h.alignCrossCenter(f, "height", h.getTop(f), "setY");
        }
        return;
      }
    },
    // End setVAlign()
    setItemDisplaySize: (item, width, height) => {
      if (item["type"] == "Text") {
        if (item.height != height) {
          return;
        }
        let b = item["getBounds"]();
        item["setWordWrapWidth"](width);
        item["setFixedSize"](width, height);
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
        height = item.flexGrow / f.growSum * freeSpace + item.height;
      }
      if (freeSpace < 0) {
        if (!item.flexShrink) {
          return;
        }
        height = item.flexShrink / f.shrinkSum * freeSpace + item.height;
      }
      h.setItemDisplaySize(f, item, item.width, height);
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
        width = item.flexGrow / f.growSum * freeSpace + item.width;
      }
      if (freeSpace < 0) {
        if (!item.flexShrink) {
          return;
        }
        width = item.flexShrink / f.shrinkSum * freeSpace + item.width;
      }
      h.setItemDisplaySize(f, item, width, item.height);
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
        let item = group[i].item;
        item.setOrigin(0, 0);
        item.setX(x);
        x += item.width + padding + f.itemsMargin;
      }
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
        let item = group[i].item;
        item.setOrigin(0, 0);
        item.setY(y);
        y += item.height + padding + f.itemsMargin;
      }
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
      this.items = [];
      this._heights = [];
      this._widths = [];
      this._growSum = 0;
      this._shrinkSum = 0;
      this._bounds = {};
      if (this.flexDirection == FlexDirection.ROW && !this.width || this.flexDirection == FlexDirection.COLUMN && !this.height) {
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
        if (this.flexDirection == Flex.FlexDirection.row) {
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
          if (t.flexDirection == FlexDirection.ROW) {
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
            h.setAlignV(Alignment.STRETCH);
          } else {
            h.setAlignH(Alignment.STRETCH);
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
    setWidth() {
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
    setOrigin() {
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
})();
