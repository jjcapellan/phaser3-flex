import { exit } from "node:process";
import { Flex, JustifyContent, AlignItems } from "./flex.js";

// Item interface
class Item {
    constructor(x, y, width, height) {
        this.origin = { x: 0.5, y: 0.5 };
        this.width = width;
        this.height = height;
        this.x = x;
        this.y = y;
    }

    setDisplaySize(width, height) {
        this.width = width;
        this.height = height;
    }

    setOrigin(x, y) {
        this.origin.x = x;
        this.origin.y = y;
    }

    setX(x) {
        this.x = x;
    }

    setY(y) {
        this.y = y;
    }

    setScrollFactor(x, y) { }

    pos() {
        let x0 = this.x - this.width * this.origin.x;
        let y0 = this.y - this.height * this.origin.y;
        return { x: x0, y: y0 };
    }

    destroy() {
        delete this;
    }
}

function fail() {
    console.log('\n****** TEST FAILED ******');
    exit(1);
}

// Items
const item1 = new Item(0, 0, 10, 10);
const item2 = new Item(0, 0, 10, 20);

// Horizontal Flex object
let flex = new Flex({ x: 10, y: 10, width: 100 });
flex.add(item1).add(item2);

// TEST 1 (padding = 10 ; itemMargin = 4 ; justify = FLEX_START ; alignment = CENTER)
if (item1.pos().x != 20 || item2.pos().x != 34 || item1.pos().y != 25 || item2.pos().y != 20 || flex.height != 40) {
    console.log("*** Test 1 failed ***");
    console.log(`
    item1.x = ${item1.pos().x}  item2.x = ${item2.pos().x}  
    item1.y = ${item1.pos().y}  item2.y = ${item2.pos().y} 
    flex.height = ${flex.height}`);
    fail();
}

// TEST 2
flex.setX(20).setY(20);
if (item1.pos().x != 30 || item2.pos().x != 44 || item1.pos().y != 35 || item2.pos().y != 30 || flex.height != 40) {
    console.log("*** Test 2 failed ***");
    console.log(`
    item1.x = ${item1.pos().x}  item2.x = ${item2.pos().x}  
    item1.y = ${item1.pos().y}  item2.y = ${item2.pos().y} 
    flex.height = ${flex.height}`);
    fail();
}

// TEST 3
flex.setJustifyContent(JustifyContent.FLEX_END);
if (item1.pos().x != 86 || item2.pos().x != 100) {
    console.log("*** Test 3 failed ***");
    console.log(`item1.x = ${item1.pos().x}  item2.x = ${item2.pos().x}`);
    fail();
}

// TEST 4
flex.setJustifyContent(JustifyContent.CENTER);
if (item1.pos().x != 58 || item2.pos().x != 72) {
    console.log("*** Test 4 failed ***");
    console.log(`item1.x = ${item1.pos().x}  item2.x = ${item2.pos().x}`);
    fail();
}

// TEST 5
flex.setJustifyContent(JustifyContent.SPACE_BETWEEN);
if (item1.pos().x != 30 || item2.pos().x != 100) {
    console.log("*** Test 5 failed ***");
    console.log(`item1.x = ${item1.pos().x}  item2.x = ${item2.pos().x}`);
    fail();
}

// TEST 6
flex.setJustifyContent(JustifyContent.SPACE_AROUND);
if (Math.floor(item1.pos().x) != 48 || Math.floor(item2.pos().x) != 81) {
    console.log("*** Test 6 failed ***");
    console.log(`item1.x = ${item1.pos().x}  item2.x = ${item2.pos().x}`);
    fail();
}

// TEST 7
flex.setAlignItems(AlignItems.FLEX_START);
if (item1.pos().y != 30 || item2.pos().y != 30) {
    console.log("*** Test 7 failed ***");
    console.log(`item1.y = ${item1.pos().y}  item2.y = ${item2.pos().y}`);
    fail();
}

// TEST 8
flex.setAlignItems(AlignItems.FLEX_END);
if (item1.pos().y != 40 || item2.pos().y != 30) {
    console.log("*** Test 8 failed ***");
    console.log(`item1.y = ${item1.pos().y}  item2.y = ${item2.pos().y}`);
    fail();
}

// TEST 9
flex.setAlignItems(AlignItems.CENTER);
if (item1.pos().y != 35 || item2.pos().y != 30) {
    console.log("*** Test 9 failed ***");
    console.log(`item1.y = ${item1.pos().y}  item2.y = ${item2.pos().y}`);
    fail();
}



console.log('****** TEST PASSED ******');




