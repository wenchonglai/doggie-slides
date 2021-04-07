import { bisectRight } from "./bisect";

export default class SortedArray extends Array{
  constructor(...args){ super(...args); }
  insert(val){
    let rightIndex = bisectRight(this, val);
    this.splice(rightIndex, 0, val);
  }
  push(...vals){
    for (let val of vals)
      this.insert(val);
  }
  unshift(...vals){
    return this.push(...vals);
  }
  concat(...arrs){
    arrs.forEach(arr => { 
      if (Array.isArray(arr))
        arr.forEach(el => {this.insert(el)});
      else this.insert(el);
    });
  }
}