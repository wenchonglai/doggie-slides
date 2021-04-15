import React from 'react';
import '../monkey-patches/array';
import '../monkey-patches/string';

import {bisectLeft, insertLeft} from './bisect.js';
import SortedArray from './sorted-array';
import SortedMap from './sorted-map';
import {parseStyleString, parseFontString, toStyleString} from '../string_parsers'
import {getSelectedText, getTextstylesByTextbox} from '../../selectors/selectors';

const CTX = document.createElement('canvas').getContext('2d');
const COMMON_CHAR_SIZE_MAP = {};
const DEFAULT_FONT_SIZE = 14;

CTX.font = `14px Times`;

export default class DynamicText{
  static fromCurrentSelection(state){
    const textData = getSelectedText(state);
    return new DynamicText(textData[0].text, textData[1].map(({offset, styleString}) => ({offset, styleString})));
  }

  static fromTexbox(state, textbox){
    const textstyles = getTextstylesByTextbox(state, textbox);
    return new DynamicText(textbox.text, textstyles.map(({offset, styleString}) => ({offset, styleString})))
  }

  constructor(text = '', styleStrings){
    this._text = '';
    this._bufferSize = 256;
    this._indices = {
      spaces: new SortedArray(),
      tabs: new SortedArray(),
      returns: new SortedArray()
    };

    this._styleMap = new SortedMap(
      styleStrings
        .filter(
          styleString => styleString.offset >= 0 && 
            styleString.offset <= text.length
        ).map(
          styleString => 
            [styleString.offset, parseStyleString(styleString.styleString)]
        )
    );

    this._segmentMap = new SortedMap();

    this._defaultFont = CTX.font || style.defaultFont;
    
    if (text[text.length - 1] !== '\0') text = text + '\0';
    
    this.insert(text, 0, true);
  }

  get length(){ return this._text.length; }

  getCommonCharSize(ch){
    let font = CTX.font;

    if (COMMON_CHAR_SIZE_MAP[font]) COMMON_CHAR_SIZE_MAP[font] = {};

    let width = COMMON_CHAR_SIZE_MAP[font][ch];

    if (width) return width;
    else {
      return COMMON_CHAR_SIZE_MAP[font][ch] = CTX.measureText(ch);
    }
  }

  getCommonStyle(offset1 = 0, offset2 = this.length, key){
    let styleMap = this._styleMap;
    let leftOffset = styleMap.getLeftKey(offset1);
    let rightOffset = styleMap.getLeftKey(offset2 - 1);
    let style = styleMap.get(leftOffset)[key];

    for (let i = leftOffset + 1; i <= rightOffset; i += 1){ //optimization needed
      let styles = styleMap.get(i);

      if (styles && style !== styles[key]) 
        return undefined;
    }

    return style;
  }

  insert(text, offset = this.length, init = false){
    length = text.length;

    if (length === 0){ return; }

    offset = Math.max(Math.min(this.length, offset), 0);
    const temp_indices = { spaces: [], tabs: [], returns: []}
    
    // add special characters in text to temporary arrays 
    for (let i = 0, arr = []; i < length; i++){
      let ch = text[i];
      
      if (ch === ' ' || ch === '-'){ temp_indices.spaces.push(offset + i); }
      if (ch === '\t'){ temp_indices.tabs.push(offset + i); }
      if (ch === '\n'){ temp_indices.returns.push(offset + i); }
    }

    for ( let key in this._indices){
      let thisIndices = this._indices[key];

      for (let i = bisectLeft(thisIndices, offset), l = thisIndices.length; i < l; i++) // offset existing indices right of offset by length
        thisIndices[i] += length;
      // add temporary arrays to the indices
      this._indices[key].push(...temp_indices[key]);
    }

    // modify style indices
    init || this._styleMap.splice(offset, 0, length);

    // renew text
    this._text = this._text.splice(offset, 0, text);
  }

  remove(index1 = this.length - 1, index2 = index1 + 1){
    if (this.length <= 1) return false;

    index1 = Math.min(Math.max(0, index1), this.length);
    index2 = Math.min(Math.max(0, index2), this.length);

    for (let type in this._indices){
      let indices = this._indices[type];
      let key1 = bisectLeft(indices, index1);
      let key2 = bisectLeft(indices, index2);
      
      for (let i = bisectLeft(indices, index2), l = indices.length; i < l; i++) // offset existing indices right of index by -(index2 - index1)
        indices[i] -= index2 - index1;

      indices.splice(key1, key2 - key1);
    }

    // modify style indices
    // the the rightmost value to the left of index2
    const endingStyle = this._styleMap.getLeftValue(index2);

    // delete all styles between index1 and index2
    this._styleMap.splice(index1, index2 - index1);

    //set style at index1 to endingStyle 
    this._styleMap.set(index1, endingStyle)

    // delete endingStyle if it is the same with the previous one
    const prevStyle = this._styleMap.getLeftValue(index1 - 1);

    if (index1 > 0 && prevStyle && toStyleString(prevStyle) === toStyleString(endingStyle)) {
      this._styleMap.delete(index1);
    }
    

    // { let index = Math.max(1, index1);  // avoid deleting style at index 0
    //   this._styleMap.splice(index, index2 - index);
    // }

    // const [leftKey, leftStyle] = this._styleMap.getLeftEntry(Math.max(index1, 0));
    // const style = this._styleMap.get(leftKey);

    // if ( index1 > 0 &&  toStyleString(leftStyle) === toStyleString(style)) {
    //   this._styleMap.delete(index1);
    // }

    // renew text
    this._text = this._text.splice(index1, index2 - index1);

    return index1;
  }

  getSegmentStartOffset(index){ // left arrow
    if (index >= this._text.length - 1) 
      index = this._text.length - 2;

    let offsetMap = this._text
      .match(/((?:\n)|(?:[^\w^\n]*[\w]*))/g)
      .map(str => str.length);

    let aggr = this.length;

    for (let len = offsetMap.length, i = len - 1; i >= 0; i--){
      aggr -= offsetMap[i];
      
      if (aggr < index) return aggr;
    }

   return 0;
  }

  getSegmentEndOffset(index){ // right arrow
    if (index >= this._text.length - 1) 
      index = this._text.length - 2;

    let offsetMap = this._text
      .match(/((?:\n)|(?:[^\w^\n]*[\w]*))/g)
      .map(str => str.length);

    let aggr = 0;

    for (let i = 0, len = offsetMap.length; i < len; i++){
      aggr += offsetMap[i];
      
      if (aggr > index) return aggr;
    }

   return this._text.length - 2
  }

  get lastOffset(){
    return this._segmentMap.lastKey;
  }
  changeFontSize(offset1, offset2, value){
    this.setStyle(offset1, offset2, {'_': true});
    
    for (let i = offset1; i < offset2; i++){
      let style = this._styleMap.get(i);

      if (style && style.fontSize){
        let currFontSize = Number(style.fontSize.replace('px', ''));
        style.fontSize = (Number(currFontSize + value) || currFontSize) + 'px';
      }
    }

    return this.setStyle(offset1, offset2, {'_': undefined});
  }
  
  setStyle(offset1 = 0, offset2 = this.length, style){
    if (offset1 >= offset2) return this;
  // .o...a....b..c...... - currStyle
  // ....^^^^^^^^........ - style
  // .o..OA....B.bc......
    offset1 = Math.min(Math.max(0, offset1), this.length);
    offset2 = Math.min(Math.max(0, offset2), this.length);

    const styleMap = this._styleMap;

    let leftCurrStyle = styleMap.getLeftValue(offset1);
    let newStyle = {...leftCurrStyle, ...style};
    let leftNewStyle = newStyle;

    if (toStyleString(newStyle) !== toStyleString(leftCurrStyle))
      styleMap.set(offset1, newStyle);

    for (let i = offset1 + 1, len = Math.min(this.length - 1, offset2); i < len; i++){ // to be optimized
      let currStyle = styleMap.get(i);

      if (currStyle){
        newStyle = {...currStyle, ...style};
        Object.keys(style).forEach((key) => {
          if (style[key] === undefined)
            delete newStyle[key];
        });
        
        if (toStyleString(leftNewStyle) === toStyleString(newStyle)){
          styleMap.delete(i);
        } else {
          styleMap.set(i, newStyle);
        }
        leftCurrStyle = currStyle;
        leftNewStyle = newStyle;
      }
    }

    let [rightOffset, rightCurrStyle] = styleMap.getRightEntry(offset2);  

    // reset style at offset2 to leftCurrStyle if there is no style value at offset2 
    if (offset2 < this.length - 1 && offset2 !== rightOffset)
      styleMap.set(offset2, leftCurrStyle);

    let rightNewStyle = styleMap.get(offset2);
    // delete the updated style at offset2 if it is identical to the new style at the left 
    if (rightNewStyle && toStyleString(rightNewStyle) === toStyleString(leftNewStyle))
      styleMap.delete(offset2);

    // delete the style at the offset to the immediate right of offset2, if any, if it is identical to leftNewStyle
    if (rightCurrStyle && rightOffset > offset2 && toStyleString(leftNewStyle) == toStyleString(rightCurrStyle))
      styleMap.delete(rightOffset);
    
    // this._styleMap.set(index1, style);
    // lastStyle && this._styleMap.set(index2, lastStyle);

    // for (let i of sortedKeys)
    //   if (i >= index1 && i < index2)
    //     this._styleMap.delete(i);

    return this;
  }

  measureSubstringSize(substring, style = {}){
    let oldFont = CTX.font, size;
    let height = style.lineHeight;

    if (style !== undefined){
      CTX.font = style.font || CTX.font;
      size = CTX.measureText(substring);
      CTX.font = oldFont;
    } else { size = CTX.measureText(substring); }
    
    if (!height){
      height = (parseInt(style.fontSize) || DEFAULT_FONT_SIZE) * 1.5
    }

    return {width: size.width, height: height};
  }

  toReactComponents(maxWidth = 800, {tabValue = 72} = {}){
    // helper function
    // process the substring starting at l and ending at r, create an React element for this substring, and update offsets

    let l = 0, r = 0;
    let offsetX = 0, offsetY = 0;
    let maxLineHeight = 0;

    this._segmentMap.clear();

    const tempQueue = [];
    const results = [];

    function _changeLine(){
      offsetX = 0;
      offsetY += maxLineHeight;
      maxLineHeight = 0;

      for (let i = 0, len = tempQueue.length; i < len; i++){
        let el = tempQueue[i];
        let reactComponent = this.toReactComponent({...el, offsetY});
        
        results.push(reactComponent);

        this._segmentMap.set(el.l, [el.offsetX, offsetY, el.height]);
      }

      tempQueue.length = 0;
    }

    function _processSubstring(l, r){
      const substring = this._text.substring(l, r);

      if (l == r || substring === '\0') return;

      const lastChar = substring.at(-1);
      const style = this._styleMap.getLeftValue(l);

      const {width, height} = this.measureSubstringSize(substring, style);

      if (![' ', '\n', '\t'].includes(substring)){               // if the last character is not a break character
        if (
          tempQueue.some(x => x.substring.match(/[\ \n\t]/)) > 0 && 
          offsetX + width > maxWidth
        ){  // if a line has more than one segment and the last segment exceeds the right boundary
          _changeLine.call(this);
        } else {
          if (height > maxLineHeight) maxLineHeight = height; 
          // tempQueue.push({substring, l, r, offsetX})
        }
      }

      if (lastChar === '\n'){
        tempQueue.push({substring, style, l, r, height, offsetX})
        _changeLine.call(this);
      } else {
        if (height > maxLineHeight) maxLineHeight = height; 

        tempQueue.push({substring, style, l, r, height, offsetX})
        offsetX += width;

        if (lastChar === '\t'){
          offsetX = ( ( offsetX / tabValue ) | 0 ) * tabValue + tabValue;
        } else {
          // last char is ' '
        }
      }
    }

    const arrs = [ this._styleMap.keys, ...Object.values(this._indices) ]; // four sorted maps documenting the indices of styles, returns, tabs, and spaces
    const positions = [0, 0, 0, 0];

    while (positions.some( (pos, i) => pos < arrs[i].length )){
      let typeIndex = 0;
      let pos = arrs[typeIndex][positions[typeIndex]];
      let minPosition = isNaN(pos) ? this.length : pos;

      for (let j = 1; j < 4; j++){
        let arrMin = arrs[j][positions[j]];

        if (arrMin !== undefined && arrMin < minPosition){
          minPosition = arrMin;
          typeIndex = j;
        }
      }

      r = minPosition + (typeIndex > 0 ? 1 : 0);

      _processSubstring.call(this, l, r);

      l = r;
      positions[typeIndex] += 1;
    }
    
    // process the remaining characters on the right of the last break character or style index
    _processSubstring.call(this, l, this.length);

    this._segmentMap.set(this.length, [offsetX, offsetY + maxLineHeight, 0]);

    _changeLine.call(this);

    return results;
  }

  getPositionByOffset(index){
    let style = this._styleMap.getLeftValue(index);
    let [leftIndex, [leftX, y, lineHeight]] = this._segmentMap.getLeftEntry(index);
    let size = this.measureSubstringSize(this._text.substring(leftIndex, index), style);
    
    return [leftX + size.width, y, lineHeight];
  }

  toReactComponent({substring, style, l, offsetX, offsetY}){
    let {font, ...otherstyles} = style;
    let fontStyles = parseFontString(font);

    return (<text 
      key={[substring, l, offsetX, offsetY].join('-')}
      {...otherstyles}
      {...fontStyles}
      x={offsetX}
      y={offsetY}
    >{substring}</text>)
  }
  
  toReduxState(){
    const textstylesAttributes = [];

    this._styleMap.entries
      .filter(([offset, styleObject]) => offset < this.length)
      .forEach(([offset, styleObject]) => {
        textstylesAttributes.push({
          offset,
          styleString: toStyleString(styleObject)
        });
      });

    return {
      text: this._text.substring(0, this._text.length - 1),
      textstylesAttributes
    };
  }
}