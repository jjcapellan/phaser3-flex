export interface Item {
    basis: number,
    flexGrow: number,
    flexShrink: number,
    height: number,
    origin: { x: number, y: number },
    type?: string,
    width: number,
    x: number,
    y: number,
    destroy: () => void,
    setDisplaySize: (x: number, y: number) => any,
    setOrigin: (x: number, y: number) => any,
    setScrollFactor: (x: number, y: number) => any,
    setX: (x: number) => any,
    setY: (y: number) => any,
}

export enum Alignment {
    BOTTOM = 1,
    CENTER,
    JUSTIFY,
    LEFT,
    RIGHT,
    STRETCH,
    TOP
}
/**
 * Values of the property alignItems.
 */
export enum AlignItems {
    CENTER = 1,
    FLEX_END,
    FLEX_START,
    STRETCH
}
/**
 * Values of the property flexDirection.
 */
export enum FlexDirection {
    COLUMN = 1,
    ROW
}
/**
 * Values of the property justifyContent.
 */
export enum JustifyContent {
    CENTER = 1,
    FLEX_END,
    FLEX_START,
    SPACE_AROUND,
    SPACE_BETWEEN
}
/**
 * Config options of Flex constructor 
 * @interface
 */
export interface Config {
    /**
     * {@link Flex.x}
     */
    x?: number,
    /**
     * {@link Flex.y}
     */
    y?: number,
    /**
     * {@link Flex.width}
     */
    width?: number,
    /**
     * {@link Flex.height}
     */
    height?: number,
    /**
     * {@link Flex.padding}
     */
    padding?: number,
    /**
     * {@link Flex.itemsMargin}
     */
    itemsMargin?: number,
    /**
     * {@link Flex.alignItems}
     */
    alignItems?: number,
    /**
     * {@link Flex.flexDirection}
     */
    flexDirection?: number,
    /**
     * {@link Flex.justifyContent}
     */
    justifyContent?: number
}