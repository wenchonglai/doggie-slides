import { bisectLeft, bisectRight } from './bisect';

export default class SortedMap extends Map{
  constructor(...args){ super(...args) }
  getLeftKey(key){
    const keys = this.keys;
    const leftKey = keys[Math.max(bisectRight(keys, key) - 1, 0)];

    return leftKey;
  }

  getLeftValue(key){
   const leftKey = this.getLeftKey(key);

    return Map.prototype.get.call(this, leftKey);
  }


  getLeftEntry(key){
    const leftKey = this.getLeftKey(key);

    return [leftKey, Map.prototype.get.call(this, leftKey)];
  }

  setLeft(key, val){
    const keys = this.keys;
    const leftKey = keys[Math.max(bisectRight(keys, key) - 1, 0)];

    return Map.prototype.set.call(this, leftKey, val);
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