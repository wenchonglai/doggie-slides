import '../monkey-patches/array';
import '../monkey-patches/string';
import {bisectLeft, insertLeft} from './bisect.js';
import SortedArray from './sorted-array';
import SortedMap from './sorted-map';
import React from 'react';

const CTX = document.createElement('canvas').getContext('2d');
const COMMON_CHAR_WIDTH_MAP = {};

CTX.font = '60px Helvetica';

export default class DynamicText{
  constructor(text = '', style){
    this._text = text;
    this._bufferSize = 256;
    this._indices = {
      spaces: new SortedArray(),
      tabs: new SortedArray(),
      returns: new SortedArray()
    };
    this._styleMap = new SortedMap();
    this._offsetMap = new SortedMap();
    this._defaultFont = CTX.font || style.defaultFont
  }

  get length(){ return this._text.length; }

  getCommonCharWidth(ch){
    let font = CTX.font;

    if (COMMON_CHAR_WIDTH_MAP[font]) COMMON_CHAR_WIDTH_MAP[font] = {};

    let width = COMMON_CHAR_WIDTH_MAP[font][ch];

    if (width) return width;
    else { return COMMON_CHAR_WIDTH_MAP[font][ch] = CTX.measureText(ch).width; }
  }

  insert(text, index = this.length){
    length = text.length;

    if (length === 0){ return; }

    index = Math.max(Math.min(this.length, index), 0);
    const temp_indices = { spaces: [], tabs: [], returns: []}
    
    // add special characters in text to temporary arrays 
    for (let i = 0, arr = []; i < length; i++){
      let ch = text[i];
      
      if (ch === ' ' || ch === '-'){ temp_indices.spaces.push(index + i); }
      if (ch === '\t'){ temp_indices.tabs.push(index + i); }
      if (ch === '\n'){ temp_indices.returns.push(index + i); }
    }

    for ( let key in this._indices){
      let thisIndices = this._indices[key];

      for (let i = bisectLeft(thisIndices, index), l = thisIndices.length; i < l; i++) // offset existing indices right of index by length
        thisIndices[i] += length;
      // add temporary arrays to the indices
      this._indices[key].push(...temp_indices[key]);
    }
  
    // modify style indices
    this._styleMap.splice(index, 0, length);

    // renew text
    this._text = this._text.splice(index, 0, text);
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
    this._styleMap.splice(index1, index2 - index1);

    // renew text
    this._text = this._text.splice(index1, index2 - index1);

    return index1;
  }
  
  getSegmentStartIndex(index){
    return this._offsetMap.getLeftKey(index - 1);
  }

  setStyle(index1, index2, style){
    const sortedKeys = Array.from(this._styleMap).sort((a, b) => a - b);
    const i2 = bisectLeft(sortedKeys, index2);
    const lastStyle = this._styleMap.get(i2);

    this._styleMap.set(index1, style);
    lastStyle && this._styleMap.set(index2, lastStyle);

    for (let i of sortedKeys)
      if (i >= index1 && i < index2)
        this._styleMap.delete(i);
  }

  measureSubstringWidth(substring, style){
    let oldFont = CTX.font, width;

    if (style !== undefined){
      oldFont = CTX.font;
      CTX.font = [style.fontWeight || '', style.fontSize || '', style.fontFamily || ''].join(' ');
      width = CTX.measureText(substring).width;
      CTX.font = oldFont;
    } else { width = CTX.measureText(substring).width; }

    return width;
  }

  toReactComponents(maxWidth = 800, {tabValue = 72} = {}){
    // helper function
    // process the substring starting at l and ending at r, create an React element for this substring, and update offsets
    function _processSubstring(l, r){
      const substring = this._text.substring(l, r);
      const lastChar = substring.at(-1)
      const width = this.measureSubstringWidth(substring);
      
      if (![' ', '\n', '\t'].includes(substring)){
        if (offsetX > 0 && offsetX + width > maxWidth){
          offsetX = 0;
          offsetY += 60;
        }

        results.push(this.toReactComponent(substring, l, r, offsetX, offsetY));
      }
      this._offsetMap.set(l, [offsetX, offsetY]);

      if (lastChar === '\n'){
        offsetX = 0;
        offsetY += 60;
      // } else if (lastChar === ' '){
      } else {
        offsetX += width;

        if (lastChar === '\t'){
          offsetX = ( ( offsetX / tabValue ) | 0 ) * tabValue + tabValue;
        } else {
          //ring);
        }
      }
    }

    const results = [];
    const arrs = [ this._styleMap.keys, ...Object.values(this._indices) ];
    const positions = [0, 0, 0, 0];

    let l = 0, r = 0;
    let offsetX = 0, offsetY = 0;

    this._offsetMap.clear();

    while (positions.some( (pos, i) => pos < arrs[i].length )){
      let typeIndex = 0;
      let minPosition = arrs[typeIndex][positions[typeIndex]] || Infinity;
      
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

    _processSubstring.call(this, l, this.length);

    this._offsetMap.set(this.length, [offsetX, offsetY]);

    return results;
  }

  getOffsetByIndex(index){
    let style = this._styleMap.getLeftValue(index);
    let [leftIndex, [leftX, y]] = this._offsetMap.getLeftEntry(index);
    
    return [leftX + this.measureSubstringWidth(this._text.substring(leftIndex, index), style), y];
  }

  toReactComponent(substring, l, r, offsetX, offsetY){
    return (<text key={[substring, l, offsetX, offsetY].join('-')} x={offsetX} y={offsetY}>{substring}</text>)
  }
  
  toReduxState(){
    return {text: this._text, styles: Array.from(this._styleMap)};
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
