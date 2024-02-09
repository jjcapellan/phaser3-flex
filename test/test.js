/// <reference path="../node_modules/phaser/types/phaser.d.ts" />
import { exit } from "node:process";
import { Flex, JustifyContent, AlignItems, FlexDirection } from "./flex.js";
import { Item, scene } from "./mocks.js";
import { assert } from "./testutils.js";


let flex1, flex2, flex3, flex4;
let item1, item2, item3, item4;
let txtItem1, txtItem2;
const counter = {
    failed: 0,
    passed: 0
};

// TEST 1 - Constructor defaults
flex1 = new Flex(scene, {});
assert(
    "Default values of constructor",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: 0, act: flex1.height },
        { prop: "flex.alignItems", exp: AlignItems.CENTER, act: flex1.alignItems },
        { prop: "flex.flexDirection", exp: FlexDirection.ROW, act: flex1.flexDirection },
        { prop: "flex.justifyContent", exp: JustifyContent.FLEX_START, act: flex1.justifyContent }
    ],
    counter
);

// TEST 2 - Placement of 1 item (default alignment)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
flex1.add(item1);
assert(
    "Placement of 1 item (default alignment)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item1.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item.x", exp: flex1.x + flex1.padding, act: item1.x },
        { prop: "item.y", exp: flex1.y + flex1.padding, act: item1.y }
    ],
    counter
);

// TEST 3 - Placement of 1 item (JustifyContent.FLEX_END)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
flex1.add(item1).setJustifyContent(JustifyContent.FLEX_END);
assert(
    "Placement of 1 item (JustifyContent.FLEX_END)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item1.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item.x", exp: flex1.x + flex1.width - flex1.padding - item1.width, act: item1.x },
        { prop: "item.y", exp: flex1.y + flex1.padding, act: item1.y }
    ],
    counter
);

// TEST 4 - Placement of 1 item (JustifyContent.CENTER)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
flex1.add(item1).setJustifyContent(JustifyContent.CENTER);
assert(
    "Placement of 1 item (JustifyContent.CENTER)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item1.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item.x", exp: flex1.x + flex1.width / 2 - item1.width / 2, act: item1.x },
        { prop: "item.y", exp: flex1.y + flex1.padding, act: item1.y }
    ],
    counter
);

// TEST 5 - Placement of 1 item (AlignItems.FLEX_START)
flex1 = new Flex(scene, { height: 60 });
item1 = new Item(0, 0, 10, 10);
flex1.add(item1).setAlignItems(AlignItems.FLEX_START);
assert(
    "Placement of 1 item (AlignItems.FLEX_START)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: 60, act: flex1.height },
        { prop: "item.x", exp: flex1.x + flex1.padding, act: item1.x },
        { prop: "item.y", exp: flex1.y + flex1.padding, act: item1.y }
    ],
    counter
);

// TEST 6 - Placement of 1 item (AlignItems.FLEX_END)
flex1 = new Flex(scene, { height: 60 });
item1 = new Item(0, 0, 10, 10);
flex1.add(item1).setAlignItems(AlignItems.FLEX_END);
assert(
    "Placement of 1 item (AlignItems.FLEX_END)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: 60, act: flex1.height },
        { prop: "item.x", exp: flex1.x + flex1.padding, act: item1.x },
        { prop: "item.y", exp: flex1.y + flex1.height - flex1.padding - item1.height, act: item1.y }
    ],
    counter
);

// TEST 7 - Placement of 1 item (AlignItems.CENTER)
flex1 = new Flex(scene, { height: 60 });
item1 = new Item(0, 0, 10, 10);
flex1.add(item1).setAlignItems(AlignItems.CENTER);
assert(
    "Placement of 1 item (AlignItems.CENTER)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: 60, act: flex1.height },
        { prop: "item.x", exp: flex1.x + flex1.padding, act: item1.x },
        { prop: "item.y", exp: flex1.y + flex1.height / 2 - item1.height / 2, act: item1.y }
    ],
    counter
);

// TEST 8 - Placement of 2 items (default alignment)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
item2 = new Item(0, 0, 10, 20);
flex1.add(item1).add(item2);
assert(
    "Placement of 2 items (default alignment)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item1.x", exp: flex1.x + flex1.padding, act: item1.x },
        { prop: "item1.y", exp: flex1.y + flex1.height / 2 - item1.height / 2, act: item1.y },
        { prop: "item2.x", exp: flex1.x + flex1.padding + item1.width + flex1.itemsMargin, act: item2.x },
        { prop: "item2.y", exp: flex1.y + flex1.padding, act: item2.y }
    ],
    counter
);

// TEST 9 - Placement of 2 items (JustifyContent.CENTER)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
item2 = new Item(0, 0, 10, 20);
flex1.add(item1).add(item2).setJustifyContent(JustifyContent.CENTER);
assert(
    "Placement of 2 items (JustifyContent.CENTER)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item1.x", exp: flex1.x + flex1.width / 2 - (item1.width + item2.width + flex1.itemsMargin) / 2, act: item1.x },
        { prop: "item1.y", exp: flex1.y + flex1.height / 2 - item1.height / 2, act: item1.y },
        { prop: "item2.x", exp: flex1.x + flex1.width / 2 + (item1.width + item2.width + flex1.itemsMargin) / 2 - item2.width, act: item2.x },
        { prop: "item2.y", exp: flex1.y + flex1.padding, act: item2.y }
    ],
    counter
);

// TEST 10 - Placement of 2 items (JustifyContent.SPACE_BETWEEN)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
item2 = new Item(0, 0, 10, 20);
flex1.add(item1).add(item2).setJustifyContent(JustifyContent.SPACE_BETWEEN);
assert(
    "Placement of 2 items (JustifyContent.SPACE_BETWEEN)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item1.x", exp: flex1.x + flex1.padding, act: item1.x },
        { prop: "item1.y", exp: flex1.y + flex1.height / 2 - item1.height / 2, act: item1.y },
        { prop: "item2.x", exp: flex1.x + flex1.width - flex1.padding - item2.width, act: item2.x },
        { prop: "item2.y", exp: flex1.y + flex1.padding, act: item2.y }
    ],
    counter
);

// TEST 11 - Placement of 2 items (JustifyContent.SPACE_AROUND)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
item2 = new Item(0, 0, 10, 20);
flex1.add(item1).add(item2).setJustifyContent(JustifyContent.SPACE_AROUND);
let freeSpace = flex1.width - 2 * flex1.padding - item1.width - item2.width - flex1.itemsMargin;
assert(
    "Placement of 2 items (JustifyContent.SPACE_AROUND)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item1.x", exp: flex1.x + flex1.padding + freeSpace / 3, act: item1.x },
        { prop: "item1.y", exp: flex1.y + flex1.height / 2 - item1.height / 2, act: item1.y },
        { prop: "item2.x", exp: flex1.x + flex1.width - flex1.padding - item2.width - freeSpace / 3, act: item2.x },
        { prop: "item2.y", exp: flex1.y + flex1.padding, act: item2.y }
    ],
    counter
);

// TEST 12 - Placement of 2 items (JustifyContent.FLEX_END)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
item2 = new Item(0, 0, 10, 20);
flex1.add(item1).add(item2).setJustifyContent(JustifyContent.FLEX_END);
assert(
    "Placement of 2 items (JustifyContent.FLEX_END)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item1.x", exp: flex1.x + flex1.width - flex1.padding - item2.width - flex1.itemsMargin - item1.width, act: item1.x },
        { prop: "item1.y", exp: flex1.y + flex1.height / 2 - item1.height / 2, act: item1.y },
        { prop: "item2.x", exp: flex1.x + flex1.width - flex1.padding - item2.width, act: item2.x },
        { prop: "item2.y", exp: flex1.y + flex1.padding, act: item2.y }
    ],
    counter
);

// TEST 13 - Placement of 2 items (AlignItems.FLEX_START)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
item2 = new Item(0, 0, 10, 20);
flex1.add(item1).add(item2).setAlignItems(AlignItems.FLEX_START);
assert(
    "Placement of 2 items (AlignItems.FLEX_START)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item1.x", exp: flex1.x + flex1.padding, act: item1.x },
        { prop: "item1.y", exp: flex1.y + flex1.padding, act: item1.y },
        { prop: "item2.x", exp: flex1.x + flex1.padding + item1.width + flex1.itemsMargin, act: item2.x },
        { prop: "item2.y", exp: flex1.y + flex1.padding, act: item2.y }
    ],
    counter
);

// TEST 14 - Placement of 2 items (AlignItems.FLEX_END)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
item2 = new Item(0, 0, 10, 20);
flex1.add(item1).add(item2).setAlignItems(AlignItems.FLEX_END);
assert(
    "Placement of 2 items (AlignItems.FLEX_END)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item1.x", exp: flex1.x + flex1.padding, act: item1.x },
        { prop: "item1.y", exp: flex1.y + flex1.height - flex1.padding - item1.height, act: item1.y },
        { prop: "item2.x", exp: flex1.x + flex1.padding + item1.width + flex1.itemsMargin, act: item2.x },
        { prop: "item2.y", exp: flex1.y + flex1.height - flex1.padding - item2.height, act: item2.y }
    ],
    counter
);

// TEST 15 - Placement of 2 flex items (same width, same grow factor)
flex1 = new Flex(scene, {});
flex2 = new Flex(scene, {});
flex3 = new Flex(scene, {});
flex1.add(flex2).add(flex3);
assert(
    "Placement of 2 flex items (same width, same grow factor)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: flex2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "flexItem1.x", exp: flex1.x + flex1.padding, act: flex2.x },
        { prop: "flexItem1.y", exp: flex1.y + flex1.padding, act: flex2.y },
        { prop: "flexItem1.width", exp: (flex1.width - 2 * flex1.padding - flex1.itemsMargin) / 2, act: flex2.width },
        { prop: "flexItem2.x", exp: flex1.x + flex1.padding + flex2.width + flex1.itemsMargin, act: flex3.x },
        { prop: "flexItem2.y", exp: flex1.y + flex1.padding, act: flex3.y },
        { prop: "flexItem2.width", exp: (flex1.width - 2 * flex1.padding - flex1.itemsMargin) / 2, act: flex3.width },
    ],
    counter
);

// TEST 16 - Placement of 2 flex items (same width < flex.width, grow factor -> 1 vs 2)
flex1 = new Flex(scene, {});
flex2 = new Flex(scene, { width: 100 });
flex3 = new Flex(scene, { width: 100 });
flex1.add(flex2, 1).add(flex3, 2);
freeSpace = flex1.width - 2 * flex1.padding - flex1.itemsMargin - 200;
assert(
    "Placement of 2 flex items (same width < flex.width, grow factor -> 1 vs 2)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: flex2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "flexItem1.x", exp: flex1.x + flex1.padding, act: flex2.x },
        { prop: "flexItem1.y", exp: flex1.y + flex1.padding, act: flex2.y },
        { prop: "flexItem1.width", exp: 100 + freeSpace * (1 / 3), act: flex2.width },
        { prop: "flexItem2.x", exp: flex1.x + flex1.padding + flex2.width + flex1.itemsMargin, act: flex3.x },
        { prop: "flexItem2.y", exp: flex1.y + flex1.padding, act: flex3.y },
        { prop: "flexItem2.width", exp: 100 + freeSpace * (2 / 3), act: flex3.width }
    ],
    counter
);

// TEST 17 - Placement 2 populated flex objects (same width < flex.width, grow factor -> 1 vs 2)
flex1 = new Flex(scene, {});
item2 = new Item(0, 0, 10, 20);
item3 = new Item(0, 0, 10, 10);
flex2 = new Flex(scene, { width: 100 });
flex3 = new Flex(scene, { width: 100 });
flex2.add(item2);
flex3.add(item3);
flex1.add(flex2, 1).add(flex3, 2);
freeSpace = flex1.width - 2 * flex1.padding - flex1.itemsMargin - 200;
assert(
    "Placement 2 populated flex objects (same width < flex.width, grow factor -> 1 vs 2)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: flex2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "flexItem1.x", exp: flex1.x + flex1.padding, act: flex2.x },
        { prop: "flexItem1.y", exp: flex1.y + flex1.padding, act: flex2.y },
        { prop: "flexItem1.width", exp: 100 + freeSpace * (1 / 3), act: flex2.width },
        { prop: "flexItem2.x", exp: flex1.x + flex1.padding + flex2.width + flex1.itemsMargin, act: flex3.x },
        { prop: "flexItem2.y", exp: flex1.y + flex1.height / 2 - flex3.height / 2, act: flex3.y },
        { prop: "flexItem2.width", exp: 100 + freeSpace * (2 / 3), act: flex3.width }
    ],
    counter
);

// TEST 18 - Placement of 2 flex items (same width > flex.width, shrink factor -> 1 vs 1)
flex1 = new Flex(scene, {});
flex2 = new Flex(scene, {});
flex3 = new Flex(scene, {});
flex1.add(flex2, 1, 1).add(flex3, 1, 1);
assert(
    "Placement of 2 flex items (same width > flex.width, shrink factor -> 1 vs 1)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: flex2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "flexItem1.x", exp: flex1.x + flex1.padding, act: flex2.x },
        { prop: "flexItem1.y", exp: flex1.y + flex1.padding, act: flex2.y },
        { prop: "flexItem1.width", exp: (flex1.width - 2 * flex1.padding - flex1.itemsMargin) / 2, act: flex2.width },
        { prop: "flexItem2.x", exp: flex1.x + flex1.padding + flex2.width + flex1.itemsMargin, act: flex3.x },
        { prop: "flexItem2.y", exp: flex1.y + flex1.padding, act: flex3.y },
        { prop: "flexItem2.width", exp: (flex1.width - 2 * flex1.padding - flex1.itemsMargin) / 2, act: flex3.width },
    ],
    counter
);

// TEST 19 - Placement of 2 flex items (same width > flex.width, shrink factor -> 1 vs 2)
flex1 = new Flex(scene, {});
flex2 = new Flex(scene, {});
flex3 = new Flex(scene, {});
flex1.add(flex2, 1, 1).add(flex3, 1, 2);
assert(
    "Placement of 2 flex items (same width > flex.width, shrink factor -> 1 vs 2)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: flex2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "flexItem1.x", exp: flex1.x + flex1.padding, act: flex2.x },
        { prop: "flexItem1.y", exp: flex1.y + flex1.padding, act: flex2.y },
        { prop: "flexItem1.width + flexItem2.width", exp: (flex1.width - 2 * flex1.padding - flex1.itemsMargin), act: Math.round(flex2.width + flex3.width) },
        { prop: "flexItem2.x", exp: flex1.x + flex1.padding + flex2.width + flex1.itemsMargin, act: flex3.x },
        { prop: "flexItem2.y", exp: flex1.y + flex1.padding, act: flex3.y }
    ],
    counter
);

// TEST 20 - Remove 1 of 2 items (default alignment)
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 20);
item2 = new Item(0, 0, 10, 10);
flex1.add(item1).add(item2);
flex1.remove(0, false);
assert(
    "Remove 1 of 2 items (default alignment)",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item2.x", exp: flex1.x + flex1.padding, act: item2.x },
        { prop: "item2.y", exp: flex1.y + flex1.padding, act: item2.y }
    ],
    counter
);

// TEST 21 - Flex.update()
flex1 = new Flex(scene, {});
item1 = new Item(0, 0, 10, 10);
item2 = new Item(0, 0, 10, 20);
flex1.add(item1).add(item2).setJustifyContent(JustifyContent.SPACE_BETWEEN);
item2.width = item2.width + 10;
flex1.update();
assert(
    "Flex.update()",
    [
        { prop: "flex.x", exp: 0, act: flex1.x },
        { prop: "flex.y", exp: 0, act: flex1.y },
        { prop: "flex.width", exp: scene.scale.width, act: flex1.width },
        { prop: "flex.height", exp: item2.height + 2 * flex1.padding, act: flex1.height },
        { prop: "item1.x", exp: flex1.x + flex1.padding, act: item1.x },
        { prop: "item1.y", exp: flex1.y + flex1.height / 2 - item1.height / 2, act: item1.y },
        { prop: "item2.x", exp: flex1.x + flex1.width - flex1.padding - item2.width, act: item2.x },
        { prop: "item2.y", exp: flex1.y + flex1.padding, act: item2.y }
    ],
    counter
);




// End of all tests
const totalTests = counter.failed + counter.passed;
console.log("\n");
console.log(`Passed: ${counter.passed} of ${totalTests} tests`);
if (counter.passed != totalTests) {
    console.log("\x1b[31m **TEST NOT PASSED** \x1b[0m");
    exit(1);
} else {
    console.log("\x1b[32m **TEST PASSED** \x1b[0m");
}
