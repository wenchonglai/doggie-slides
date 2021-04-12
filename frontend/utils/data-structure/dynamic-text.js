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
        .map(styleString => 
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
    this._styleMap.splice(index1, index2 - index1)

    const [leftKey, leftStyle] = this._styleMap.getLeftEntry(Math.max(index1 - 1, 0));
    const style = this._styleMap.get(leftKey);

    if ( leftKey > 0 && 
      toStyleString(leftStyle) === toStyleString(style)
    ) { this._styleMap.delete(index1); }
    // renew text
    this._text = this._text.splice(index1, index2 - index1);

    return index1;
  }
  
  getSegmentStartIndex(index){
    return this._segmentMap.getLeftIndex(index - 1);
  }

  getSegmentEndIndex(index){
    const keys = this._segmentMap.keys;
    return this._segmentMap.getRightIndex(index + 1) - 1;
  }

  getSegmentStartOffset(index){ // left arrow
    if (index >= this._text.length - 1) 
      index = this._text.length - 2;

    let offsetMap = this._text
      .match(/((?:\n)|(?:[^\w^\n]*[\w]*))/g)
      .map(str => str.length);
console.log(this._text, this._text.match(/((?:\n)|(?:[^\w^\n]*[\w]*))/g));
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

  setStyle(offset1, offset2, style){
    offset1 = Math.min(Math.max(0, offset1), this.length);
    offset2 = Math.min(Math.max(0, offset2), this.length);

    if (offset2 <= offset1) return false;

    const styleMap = this._styleMap;
    const sortedKeys = Array.from(styleMap).sort((a, b) => a - b);
    let prevStyle = styleMap.getLeftValue(Math.max(0, offset1 - 1));
    let newStyle = prevStyle;
    let lastStyle = prevStyle;
    
    styleMap.set(offset1, {...prevStyle});

    for (let i = offset1; i < offset2; i++){ // to be optimized
      let currStyle = styleMap.get(i);

      if (currStyle){
        newStyle = {...currStyle, ...style};
        if (toStyleString(prevStyle) === toStyleString(newStyle) && i > 0){
          styleMap.delete(i);
        } else {
          styleMap.set(i, newStyle);
        }
        
        lastStyle = currStyle;
        prevStyle = newStyle;
      }
    }

    if (toStyleString(newStyle) == toStyleString(lastStyle)){
      styleMap.delete(offset2);
    } else {
      styleMap.set(offset2, lastStyle);
    }

    // this._styleMap.set(index1, style);
    // lastStyle && this._styleMap.set(index2, lastStyle);

    // for (let i of sortedKeys)
    //   if (i >= index1 && i < index2)
    //     this._styleMap.delete(i);
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
      const lastChar = substring.at(-1);
      const style = this._styleMap.getLeftValue(l);

      const {width, height} = this.measureSubstringSize(substring, style);

      if (![' ', '\n', '\t'].includes(substring)){               // if the last character is not a break character
        if (tempQueue.length > 0 && offsetX + width > maxWidth){  // if a line has more than one segment and the last segment exceeds the right boundary
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

// let dt = new DynamicText('01239');

// console.time();
// dt.insertAt(4, '45678');
// console.timeEnd();
// console.time();
// dt.insertAt(5, 'abcd', {color: 'red'});
// console.timeEnd();
// console.time();
// dt.insertAt(10, '!!!!', {color: 'red'});
// console.timeEnd();
// console.log(dt.fragments.toString());
// console.time();
// console.timeEnd();
// console.log(dt, dt.fragments._offsets, dt.toString(), dt.toSVG());
