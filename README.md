# Phaser3 Flex
This small library implements some CSS Flexbox features in JavaScript for use in Phaser 3.
The "Flex" object is a container inspired by the CSS Flexbox system, which facilitates the placement and alignment of objects (very useful for creating the GUI of our game).  
**Important**: Still in early development phase.

## Main features:
* 4 types of alignment regarding the cross-axis (*alignItems*): flexStart, center, flexEnd, stretch (only applicable to other flex objects).
* 4 types of alignment regarding the main axis (*justifyContent*): flexStart, center, flexEnd, spaceBetween, spaceAround.
* 2 types of orientation (*flexDirection*): row, column.
* *flexGrow* property: determines how the free space is distributed (only applicable to flex objects).
* *flexShrink* property: determines how the lacking space is removed (only applicable to flex objects).
* Nested containers: a flex object can be inside other flex objects.

Demo: https://jjcapellan.github.io/phaser3-flex/  
Api: https://jjcapellan.github.io/phaser3-flex/docs/

## Installation
### NPM
```
npm i phaser3-flex
```
### CDN
#### Web minified version
```
<script src="https://cdn.jsdelivr.net/gh/jjcapellan/phaser3-flex@0.1.0/dist/flex.min.js"></script>
```
**Important**: Package is exposed as global *Fbx*
#### Module version
```
<script type="module" src="https://cdn.jsdelivr.net/gh/jjcapellan/phaser3-flex@0.1.0/dist/flex.js"></script>
```


## Quick start
This is the most basic example:
```js
import { Flex } from "phaser3-flex";
// Inside your Phaser.Scene ...

// Create a Flex object with default values
const flexContainer = new Flex(this);

// Create some content
const item1 = this.add.text(0, 0, "text1");
const item2 = this.add.image(0, 0, "image1");
const item3 = this.add.text(0, 0, "text2");

// Add content to the container
flexContainer.add(item1).add(item2).add(item3);
```
These are the container properties by default:
* x: 0
* y: 0
* width: scene.scale.width
* height: 0 (the height changes width the content)
* padding: 10
* itemsMargin: 4
* alignItems: AlignItems.CENTER
* justifyContent: JustifyContent.FLEX_START
* flexDirection: FlexDirection.ROW   

We can change all or some of this properties at creation time:
```js
const flexContainer = new Flex(scene, { padding: 6, justifyContent: JustifyContent.SPACE_BETWEEN });
```
Some properties can be changed after Flex object creation:
```js
flexContainer.setAlignItems(AlignItems.FLEX_END);
flexContainer.setY(100);
flexContainer.setWidth(400);
// ...
```

## License
This library is licensed under the terms of the [MIT open source license](LICENSE).
