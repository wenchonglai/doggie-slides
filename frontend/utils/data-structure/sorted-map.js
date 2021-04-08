import { bisectLeft, bisectRight } from './bisect';

export default class SortedMap extends Map{
  constructor(...args){ super(...args) }

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

  splice(index, removeLength = 0, insertLength = 0){
    //remove
    let keys = this.keys;
    
    if (removeLength > 0){
      const index2 = index + removeLength;
      const key2 = bisectLeft(keys, index + removeLength);
      const lastStyle = this.get(key2);

      for (let key of keys)
        if (key >= index){
          if (key >= index2)
            this._styleMap.set(key - (index2 - index1), this._styleMap.get(key));

          if (key <= index2)
            lastStyle = this.get(key)

          this._styleMap.delete(key);
        }
      
        lastStyle && this.set(index, lastStyle);
    }

    keys = this.keys;

    //insert
    for (let len = keys.length, i = len - 1; keys[i] >= index; key --){
      let key = keys[i];

      this.set(i + insertLength, this.get(i));
      this.delete(i);
    }
  }
  get keys(){ return Array.from(Map.prototype.keys.call(this)).sort((a, b) => a - b); }
  get values(){ return this.keys.map(key => this.get(key)); }
  get entries(){ return this.keys.map(key => [key, this.get(key)] ); }
}