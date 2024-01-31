export interface Item {
    _fitContent: boolean,
    _fparent?: Item,
    _isFlex?: boolean,
    basis: number,
    clear?: () => Item,
    destroy: () => void,
    fitContent?: boolean,
    flexDirection?: number,
    flexGrow?: number,
    flexShrink?: number,
    getBounds?: () => any,
    height: number,
    origin: { x: number, y: number },
    setDisplaySize: (x: number, y: number) => any,
    setFixedSize?: (w: number, h: number) => any
    setOrigin: (x: number, y: number) => any,
    setScrollFactor: (x: number, y: number) => any,
    setWordWrapWidth?: (value: number) => any,
    setX: (x: number) => any,
    setY: (y: number) => any,
    type?: string,
    width: number,
    x: number,
    y: number,
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