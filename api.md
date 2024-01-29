## Classes

<dl>
<dt><a href="#Flex">Flex</a></dt>
<dd></dd>
</dl>

<a name="Flex"></a>

## Flex
**Kind**: global class  

* [Flex](#Flex)
    * [new Flex(config)](#new_Flex_new)
    * [.x](#Flex+x) : <code>number</code>
    * [.y](#Flex+y) : <code>number</code>
    * [.width](#Flex+width) : <code>number</code>
    * [.height](#Flex+height) : <code>number</code>
    * [.padding](#Flex+padding) : <code>number</code>
    * [.itemsMargin](#Flex+itemsMargin) : <code>number</code>
    * [.alignItems](#Flex+alignItems) : <code>number</code>
    * [.flexDirection](#Flex+flexDirection) : <code>number</code>
    * [.justifyContent](#Flex+justifyContent) : <code>number</code>
    * [.items](#Flex+items) : <code>Array.&lt;Object&gt;</code>
    * [.fitContent](#Flex+fitContent) : <code>boolean</code>
    * [.origin](#Flex+origin) : <code>object</code>
    * [.add(item, flexGrow, flexShrink)](#Flex+add) ⇒ <code>object</code>
    * [.clear()](#Flex+clear) ⇒ <code>object</code>
    * [.remove(index, destroy)](#Flex+remove) ⇒ <code>object</code>
    * [.setDisplaySize(width, height)](#Flex+setDisplaySize)
    * [.destroy()](#Flex+destroy)
    * [.setAlignItems(alignItems)](#Flex+setAlignItems) ⇒ <code>object</code>
    * [.setFitContent(fitToContent)](#Flex+setFitContent) ⇒ <code>object</code>
    * [.setHeight(height)](#Flex+setHeight) ⇒ <code>object</code>
    * [.setWidth(height)](#Flex+setWidth) ⇒ <code>object</code>
    * [.setJustifyContent(justifyContent)](#Flex+setJustifyContent) ⇒ <code>object</code>
    * [.setOrigin(x, y)](#Flex+setOrigin) ⇒ <code>object</code>
    * [.setScrollFactor(x, [y])](#Flex+setScrollFactor) ⇒ <code>object</code>
    * [.setX(x)](#Flex+setX) ⇒ <code>object</code>
    * [.setY(y)](#Flex+setY) ⇒ <code>object</code>

<a name="new_Flex_new"></a>

### new Flex(config)
Creates an instances of an object of class Flex.

**Returns**: <code>object</code> - This Flex instance.  

| Param | Type | Default | Description |
| --- | --- | --- | --- |
| config | <code>object</code> |  |  |
| [config.x] | <code>number</code> | <code>0</code> | X position. |
| [config.y] | <code>number</code> | <code>0</code> | Y position |
| [config.width] | <code>number</code> | <code>0</code> | Width of this object. |
| [config.height] | <code>number</code> | <code>0</code> | Height of this object. |
| [config.padding] | <code>number</code> | <code>10</code> | Minimum distance between this object content and its border. |
| [config.itemsMargin] | <code>number</code> | <code>4</code> | Minimum distance between items contained inside this object. |
| [config.alignItems] | <code>number</code> | <code>1</code> | Alignment of the items with respect to the cross axis. |
| [config.flexDirection] | <code>number</code> | <code>2</code> | Sets how items are placed in the flex object defining the main axis. |
| [config.justifyContent] | <code>number</code> | <code>3</code> | Alignment of the items with respect to the main axis. |

<a name="Flex+x"></a>

### flex.x : <code>number</code>
X position. Use *setX* to change this value.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+y"></a>

### flex.y : <code>number</code>
Y position. Use *setY* to change this value.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+width"></a>

### flex.width : <code>number</code>
Width of this object. Use *setWidth* to change this value.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+height"></a>

### flex.height : <code>number</code>
Height of this object. Use *setHeight* to change this value.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+padding"></a>

### flex.padding : <code>number</code>
Minimum distance between this object content and its border.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+itemsMargin"></a>

### flex.itemsMargin : <code>number</code>
Minimum distance between items contained inside this object.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+alignItems"></a>

### flex.alignItems : <code>number</code>
Alignment of the items with respect to the cross axis.  
Values: 1 (center), 2(flex-end), 3(flex-start), 4(stretch).  
The stretch alignment is only applicable to other flex objects.  
Use *setAlignItems* to change this property. For convenience you can use the enum *AlignItems*.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+flexDirection"></a>

### flex.flexDirection : <code>number</code>
This property sets how items are placed in the flex object defining the main axis.  
Values: 1 (column), 2(row).  
Use *setFlexDirection* to change this property. For convenience you can use the enum *FlexDirection*.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+justifyContent"></a>

### flex.justifyContent : <code>number</code>
Alignment of the items with respect to the main axis.  
Values: 1 (center), 2(flex-end), 3(flex-start), 4(space-around), 5(space-between).  
Use *setJustifyContent* to change this property. For convenience you can use the enum *JustifyContent*.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+items"></a>

### flex.items : <code>Array.&lt;Object&gt;</code>
Array of items managed by this object.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
**Read only**: true  
<a name="Flex+fitContent"></a>

### flex.fitContent : <code>boolean</code>
Should cross axis size fit to content?

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+origin"></a>

### flex.origin : <code>object</code>
2D vector defining the anchor point of this object. (Type: { x: number, y: number }).  
X and Y values are a number between 0 and 1.

**Kind**: instance property of [<code>Flex</code>](#Flex)  
<a name="Flex+add"></a>

### flex.add(item, flexGrow, flexShrink) ⇒ <code>object</code>
Adds an item to the items list of this object. The position and size of this items
are managed by this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type | Default |
| --- | --- | --- |
| item | <code>object</code> |  | 
| flexGrow | <code>number</code> | <code>0</code> | 
| flexShrink | <code>number</code> | <code>1</code> | 

<a name="Flex+clear"></a>

### flex.clear() ⇒ <code>object</code>
Each item managed by this object are destroyed.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  
<a name="Flex+remove"></a>

### flex.remove(index, destroy) ⇒ <code>object</code>
An item is removed from the items list managed by this flex object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type | Description |
| --- | --- | --- |
| index | <code>number</code> | Index of the item to be removed in the items array of this instance. |
| destroy | <code>boolean</code> | The item should be destroyed?. |

<a name="Flex+setDisplaySize"></a>

### flex.setDisplaySize(width, height)
Sets the size of this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  

| Param | Type |
| --- | --- |
| width | <code>number</code> | 
| height | <code>number</code> | 

<a name="Flex+destroy"></a>

### flex.destroy()
Disposes all resources used by this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
<a name="Flex+setAlignItems"></a>

### flex.setAlignItems(alignItems) ⇒ <code>object</code>
Sets the *alignItems* property of this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type |
| --- | --- |
| alignItems | [<code>AlignItems</code>](#AlignItems) | 

<a name="Flex+setFitContent"></a>

### flex.setFitContent(fitToContent) ⇒ <code>object</code>
Sets the *fitContent* of this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type |
| --- | --- |
| fitToContent | <code>boolean</code> | 

<a name="Flex+setHeight"></a>

### flex.setHeight(height) ⇒ <code>object</code>
Sets the *height* of this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type |
| --- | --- |
| height | <code>number</code> | 

<a name="Flex+setWidth"></a>

### flex.setWidth(height) ⇒ <code>object</code>
Sets the *width* of this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type |
| --- | --- |
| height | <code>number</code> | 

<a name="Flex+setJustifyContent"></a>

### flex.setJustifyContent(justifyContent) ⇒ <code>object</code>
Sets the *justifyContent* property of this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type |
| --- | --- |
| justifyContent | [<code>JustifyContent</code>](#JustifyContent) | 

<a name="Flex+setOrigin"></a>

### flex.setOrigin(x, y) ⇒ <code>object</code>
Sets the *origin* property of this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 
| y | <code>number</code> | 

<a name="Flex+setScrollFactor"></a>

### flex.setScrollFactor(x, [y]) ⇒ <code>object</code>
Sets the *scrollFactor* property of this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type | Default |
| --- | --- | --- |
| x | <code>number</code> |  | 
| [y] | <code>number</code> | <code>x</code> | 

<a name="Flex+setX"></a>

### flex.setX(x) ⇒ <code>object</code>
Sets the x position of this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type |
| --- | --- |
| x | <code>number</code> | 

<a name="Flex+setY"></a>

### flex.setY(y) ⇒ <code>object</code>
Sets the y position of this object.

**Kind**: instance method of [<code>Flex</code>](#Flex)  
**Returns**: <code>object</code> - This Flex instance.  

| Param | Type |
| --- | --- |
| y | <code>number</code> | 

<a name="AlignItems"></a>

## AlignItems : <code>enum</code>
Values of the property alignItems.

**Kind**: global enum  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| CENTER | <code>number</code> | <code>1</code> | 
| FLEX_END | <code>number</code> | <code>2</code> | 
| FLEX_START | <code>number</code> | <code>3</code> | 
| STRETCH | <code>number</code> | <code>4</code> | 

<a name="FlexDirection"></a>

## FlexDirection : <code>enum</code>
Values of the property flexDirection.

**Kind**: global enum  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| COLUMN | <code>number</code> | <code>1</code> | 
| ROW | <code>number</code> | <code>2</code> | 

<a name="JustifyContent"></a>

## JustifyContent : <code>enum</code>
Values of the property justifyContent.

**Kind**: global enum  
**Properties**

| Name | Type | Default |
| --- | --- | --- |
| CENTER | <code>number</code> | <code>1</code> | 
| FLEX_END | <code>number</code> | <code>2</code> | 
| FLEX_START | <code>number</code> | <code>3</code> | 
| SPACE_AROUND | <code>number</code> | <code>4</code> | 
| SPACE_BETWEEN | <code>number</code> | <code>5</code> | 

