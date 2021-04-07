import Fragment from './fragment';

class Fragments{
  constructor(){
    this._fragments = [];
    this._offsets = [0];
    this._size = 0;
  }

  get length(){ return this._offsets.at(-1) }
  get size(){ return this._size; }

  get(i){ return this._fragments.at(i); }

  update(i){
    if (i < 0 || i > this.size) return false;
    this._offsets[i] = (i === 0) ? 0 : (this._offsets[i - 1] + this._fragments[i - 1].length);

    for (let j = i + 1; j <= this.size; j ++){
      const lastFragment = this.get(j - 1);
      const fragment = this.get(j);
      
      if (fragment && lastFragment && fragment.style.shallowEquals(lastFragment.style)){
        lastFragment.text += fragment.text;
        this.delete(j, 1, false);
        this._size--;
        j--;
      }

      this._offsets[j] = this._offsets[j - 1] + this.get(j - 1).length;
    }
  }

  insert(fragment, index = this.size, forceUpdate = true){
    if (fragment.length === 0) return false;

    index = Math.min(index, this.size);

    this._fragments.splice(index, 0, fragment);
    this._offsets.splice(index, 0, 0);
    this._size += 1;

    forceUpdate && this.update(index);
  }

  delete(index, count = 1, forceUpdate = true){
    if (count <= 0) return false;

    this._fragments.splice(index, count);
    this._offsets.splice(index, count);
    this._size = this._fragments.length;

    forceUpdate && this.update(index);
  }

  set(index, text, {...style} = {}, forceUpdate = true){
    const fragment = this.get(index);
    if (fragment === undefined) return false;
    if (text.length === 0){
      return this.delete(index, 1, forceUpdate);
    }

    fragment.text = text;

    fragment.setStyle(style);

    forceUpdate && this.update(index + (index < 0 ? this.size : 0));
  }

  toString(){ return this._fragments.map(fragment => fragment.toString()).join(''); }
  toSVG(){ return `<g>${this._fragments.map(fragment => fragment.toSVG()).join('')}</g>` }
  map(callback, thisArgs){ return this._fragments.map(callback, thisArgs); }
}

const fs = new Fragments();
// fs.insert(new Fragment('abc'));
// fs.insert(new Fragment('defg'));
// fs.insert(new Fragment('12'), 1);
// fs.insert(new Fragment('0'), 0);
// fs.insert(new Fragment('5555'), 4);
// console.log(fs.toString(), fs.length, fs.toString().length);
// fs.delete(2);
// console.log(fs, fs.toString(), fs.length, fs.toString().length);
// fs.set(1, 'random');
// console.log(fs, fs.toString(), fs.length, fs.toString().length); 

export default Fragments;