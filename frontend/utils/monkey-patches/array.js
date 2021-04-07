Object.defineProperties(Array.prototype, {
  first: {
    get(){ return this[0]; },
    set(val){ return this[0] = val; }
  },
  last: {
    get(){ return this.at(-1); },
    set(val){ return this[this.length - 1] = val; }
  },
  isEmpty: {
    get(){ return this.length === 0; }
  },
  at: {
    value(index){
      if (index < 0) index += this.length;
      
      return this[index];
    }
  }
});

export default {};