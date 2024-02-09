declare module "sharedtypes" {
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
        setDisplaySize: (x: number, y: number) => any;
        setOrigin: (x: number, y: number) => any;
        setScrollFactor: (x: number, y: number) => any;
        setX: (x: number) => any;
        setY: (y: number) => any;
    }
    export enum Alignment {
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
    export enum AlignItems {
        CENTER = 1,
        FLEX_END = 2,
        FLEX_START = 3,
        STRETCH = 4
    }
    /**
     * Values of the property flexDirection.
     */
    export enum FlexDirection {
        COLUMN = 1,
        ROW = 2
    }
    /**
     * Values of the property justifyContent.
     */
    export enum JustifyContent {
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
}
declare module "helpers" {
    import { Alignment, Item } from "sharedtypes";
    import { Flex } from "flex";
    function checkHeight(f: Flex, height: number): void;
    function checkWidth(f: Flex, width: number): void;
    function fitHeight(f: Flex): void;
    function fitTextToColumn(f: Flex, item: Item): void;
    function fitWidth(f: Flex): void;
    function getItemsSize(f: Flex): number;
    function resetHeights(f: Flex): void;
    function resetWidths(f: Flex): void;
    function setAlignH(f: Flex, alignment: Alignment): void;
    function setAlignV(f: Flex, alignment: Alignment): void;
    function setItems(f: any): void;
    function setJustify(f: Flex): void;
    export { checkHeight, checkWidth, fitHeight, fitTextToColumn, fitWidth, getItemsSize, resetHeights, resetWidths, setAlignH, setAlignV, setItems, setJustify };
}
declare module "flex" {
    import { AlignItems, Config, Item, JustifyContent } from "sharedtypes";
    class Flex {
        /**
         * X position. (Default = 0)
         */
        x: number;
        /**
         * Y position. (Default = 0)
         */
        y: number;
        /**
         * Width of this object. (Default = 0)
         */
        width: number;
        /**
         * Height of this object. (Default = 0)
         */
        height: number;
        /**
         * Minimum distance between this object content and its border. (Default = 10)
         */
        padding: number;
        /**
         * Minimum distance between items contained inside this object. (Default = 4)
         */
        itemsMargin: number;
        /**
         * Alignment of the items with respect to the cross axis. (Default = AlignItems.CENTER)
         */
        alignItems: number;
        /**
         * Sets how items are placed in the flex object defining the main axis. (Default = FlexDirection.ROW)
         */
        flexDirection: number;
        /**
         * Alignment of the items with respect to the main axis. (Default = JustifyContent.FLEX_START)
         */
        justifyContent: number;
        /**
         * Array of all items managed by this object.
         */
        items: Item[];
        /**
         * Position of this object anchor relative to its width and height. (x and y between 0 and 1).
         * Sets how this object is placed.
         */
        origin: {
            x: number;
            y: number;
        };
        /**
         * Original size of this object in the main axis.
         */
        basis: number;
        scene: Phaser.Scene;
        flexGrow: number;
        flexShrink: number;
        /**
         * @private
         */
        _fparent: Flex;
        /**
         * @private
         */
        _scrollFactorX: number;
        /**
         * @private
         */
        _scrollFactorY: number;
        /**
         * @private
         */
        _isFlex: boolean;
        /**
         * @private
         */
        _basisSum: number;
        /**
         * @private
         */
        _heights: number[];
        /**
         * @private
         */
        _widths: number[];
        /**
         * @private
         */
        _growSum: number;
        /**
         * @private
         */
        _shrinkSum: number;
        /**
         * @private
         */
        _bounds: {
            left: number;
            right: number;
            top: number;
            bottom: number;
        };
        /**
         * Creates an instance of Flex class
         * @param scene
         * @param config
         * @returns
         */
        constructor(scene: Phaser.Scene, config: Config);
        /**
         * Adds an item to the items list of this object. The position and size of this items
         * are managed by this object.
         *
         * @param item
         * @param flexGrow
         * @param flexShrink
         * @returns This Flex instance.
         */
        add(item: Item, flexGrow?: number, flexShrink?: number): Flex;
        /**
         * Each item managed by this object are destroyed.
         *
         * @returns This Flex instance.
         */
        clear(): Flex;
        /**
         * An item is removed from the items list managed by this flex object.
         *
         * @param index Index of the item to be removed in the items array of this instance.
         * @param destroy The item should be destroyed?.
         * @returns This Flex instance.
         */
        remove(index: number, destroy: boolean): Flex;
        /**
         * Sets the size of this object.
         *
         * @param width
         * @param height
         * @returns This Flex instance.
         */
        setDisplaySize(width: number, height: number): Flex;
        /**
         * Disposes all resources used by this object.
         *
         */
        destroy(): void;
        /**
         * Sets the *alignItems* property of this object.
         *
         * @param alignItems
         * @returns This Flex instance.
         */
        setAlignItems(alignItems: AlignItems): Flex;
        /**
         * Sets the *height* of this object.
         *
         * @param height
         * @returns This Flex instance.
         */
        setHeight(height: number): Flex;
        /**
         * Sets the *width* of this object.
         *
         * @param width
         * @returns This Flex instance.
         */
        setWidth(width: number): Flex;
        /**
         * Sets the *justifyContent* property of this object.
         *
         * @param justifyContent
         * @returns This Flex instance.
         */
        setJustifyContent(justifyContent: JustifyContent): Flex;
        /**
         * Sets the *origin* property of this object.
         *
         * @param x
         * @param y
         * @returns This Flex instance.
         */
        setOrigin(x: number, y: number): Flex;
        /**
         * Sets the *scrollFactor* property of this object.
         *
         * @param x
         * @param y
         * @returns This Flex instance.
         */
        setScrollFactor(x: number, y: number | undefined): Flex;
        /**
         * Sets the x position of this object.
         *
         * @param x
         * @returns This Flex instance.
         */
        setX(x: number): Flex;
        /**
         * Sets the y position of this object.
         *
         * @param y
         * @returns This Flex instance.
         */
        setY(y: number): Flex;
        /**
         * Updates items positions. Should be used only if any item have changed its size.
         */
        update(): void;
    }
    export { Flex };
}
declare module "index" {
    import { Flex } from "flex";
    import { AlignItems, Config, FlexDirection, JustifyContent } from "sharedtypes";
    export { AlignItems, Config, Flex, FlexDirection, JustifyContent };
}
