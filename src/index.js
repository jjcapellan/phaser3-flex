import { Flex } from './flex.js';
import { AlignItems, FlexDirection, JustifyContent } from './constants.js';

if (typeof window != 'undefined') {
    globalThis.Fbx = {
        Flex: Flex,
        AlignItems: AlignItems,
        FlexDirection: FlexDirection,
        JustifyContent: JustifyContent
    };
}

export {
    AlignItems,
    Flex,
    FlexDirection,
    JustifyContent
};