export interface Item {
    basis: number;
    flexGrow: number;
    flexShrink: number;
    height: number;
    origin: {
        x: number;
        y: number;
    };
    type?: string;
    width: number;
    x: number;
    y: number;
    destroy: () => void;
    setSize: (x: number, y: number) => any;
    setOrigin: (x: number, y: number) => any;
    setScrollFactor: (x: number, y: number) => any;
    setX: (x: number) => any;
    setY: (y: number) => any;
}
export declare enum Alignment {
    BOTTOM = 1,
    CENTER = 2,
    JUSTIFY = 3,
    LEFT = 4,
    RIGHT = 5,
    STRETCH = 6,
    TOP = 7
}
/**
 * Values of the property alignItems.
 */
export declare enum AlignItems {
    CENTER = 1,
    FLEX_END = 2,
    FLEX_START = 3,
    STRETCH = 4
}
/**
 * Values of the property flexDirection.
 */
export declare enum FlexDirection {
    COLUMN = 1,
    ROW = 2
}
/**
 * Values of the property justifyContent.
 */
export declare enum JustifyContent {
    CENTER = 1,
    FLEX_END = 2,
    FLEX_START = 3,
    SPACE_AROUND = 4,
    SPACE_BETWEEN = 5
}
/**
 * Config options of Flex constructor
 * @interface
 */
export interface Config {
    /**
     * {@link Flex.x}
     */
    x?: number;
    /**
     * {@link Flex.y}
     */
    y?: number;
    /**
     * {@link Flex.width}
     */
    width?: number;
    /**
     * {@link Flex.height}
     */
    height?: number;
    /**
     * {@link Flex.padding}
     */
    padding?: number;
    /**
     * {@link Flex.itemsMargin}
     */
    itemsMargin?: number;
    /**
     * {@link Flex.alignItems}
     */
    alignItems?: number;
    /**
     * {@link Flex.flexDirection}
     */
    flexDirection?: number;
    /**
     * {@link Flex.justifyContent}
     */
    justifyContent?: number;
}
