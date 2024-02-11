/// <reference types="phaser" />
import { Alignment, Item } from "./sharedtypes";
import { Flex } from "./flex";
declare function checkHeight(f: Flex, height: number): void;
declare function checkWidth(f: Flex, width: number): void;
declare function fitHeight(f: Flex): void;
declare function fitTextToColumn(f: Flex, item: Item): void;
declare function fitWidth(f: Flex): void;
declare function getItemsSize(f: Flex): number;
declare function resetHeights(f: Flex): void;
declare function resetWidths(f: Flex): void;
declare function setAlignH(f: Flex, alignment: Alignment): void;
declare function setAlignV(f: Flex, alignment: Alignment): void;
declare function setItems(f: any): void;
declare function setJustify(f: Flex): void;
export { checkHeight, checkWidth, fitHeight, fitTextToColumn, fitWidth, getItemsSize, resetHeights, resetWidths, setAlignH, setAlignV, setItems, setJustify };
