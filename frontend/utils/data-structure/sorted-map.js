import { bisectLeft, bisectRight } from './bisect';

export default class SortedMap extends Map{
  constructor(...args){ super(...args) }

  getLeftIndex(key){
    const keys = this.keys;
    return Math.max(bisectRight(keys, key) - 1, 0);
  }

  getRightIndex(key){
    const keys = this.keys;
    return Math.min(bisectLeft(keys, key + 1), this.size - 1);
  }

  getLeftKey(key){  // the greatest index less than or equal to key
    const keys = this.keys;
    return keys[Math.max(bisectRight(keys, key) - 1, 0)];
  }

  getRightKey(key){ // the smallest index greater than or equal to key
    const keys = this.keys;
    return keys[Math.min(bisectLeft(keys, key + 1), this.size - 1)];
  }

  getLeftValue(key){
    return Map.prototype.get.call(this, this.getLeftKey(key));
  }

  getLeftEntry(key){
    const leftKey = this.getLeftKey(key);
    return [leftKey, Map.prototype.get.call(this, leftKey)];
  }

  getRightEntry(key){
    const rightKey = this.getRightKey(key);
    return [rightKey, Map.prototype.get.call(this, rightKey)];
  }

  setLeftValue(key, val){
    const keys = this.keys;

    return Map.prototype.set.call(this, this.getLeftKey(key), val);
  }

  get lastKey(){
    return this.keys.at(-1)
  }

  get last(){
    return Map.prototype.get.call(this, this.keys.at(-1));
  }

  splice(offsetLeft, removeLength = 0, insertLength = 0){
    console.log(offsetLeft, removeLength, insertLength)
    console.log(this.keys)
    //remove
    let offsets = this.keys.sort((a, b) => a - b);

    if (removeLength > 0){
      const offsetRight = offsetLeft + removeLength;
      let lastElem;

      for (let offset of offsets)
        if (offset >= offsetLeft){

          if (offset <= offsetRight)
            lastElem = this.get(offset);
          if (offset > offsetRight)
            this.set(offset - removeLength, this.get(offset));
          this.delete(offset);
        }

      lastElem && this.set(offsetLeft, lastElem);
    }

    offsets = this.keys.sort((a, b) => a - b);

    if (insertLength > 0)
      for (let len = offsets.length, i = len - 1; offsets[i] > offsetLeft; i --){
        console.log(i);
        let key = offsets[i];

        this.set(key + insertLength, this.get(key));
        this.delete(key);
        console.log(...this.entries)
      }
    console.log(this.keys)
  }
  get keys(){ return Array.from(Map.prototype.keys.call(this)).sort((a, b) => a - b); }
  get values(){ return this.keys.map(key => this.get(key)); }
  get entries(){ return this.keys.map(key => [key, this.get(key)] ); }
}