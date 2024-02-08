import { Flex } from "./flex";
import { AlignItems, Config, FlexDirection, JustifyContent } from "./sharedtypes";

if (typeof window != "undefined") {
    globalThis.Fbx = {
        Flex: Flex,
        AlignItems: AlignItems,
        FlexDirection: FlexDirection,
        JustifyContent: JustifyContent
    };
}

export {
    AlignItems,
    Config,
    Flex,
    FlexDirection,
    JustifyContent
};