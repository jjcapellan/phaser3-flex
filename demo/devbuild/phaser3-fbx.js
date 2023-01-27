(() => {
  // src/constants.js
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
