Object.defineProperties(String.prototype, {
  toSnakeCase: {
    value(char='_'){
      return this.replace(/([A-Z])/g, (x)=>`${char}${x.toLowerCase()}`)
    }
  },
  splice: {
    value(index, offset = 0, insert = ''){
      index2 = index + Math.max(offset, 0);
      return this.slice(0, index) + insert + this.slice(index2);
    }
  },
  at: {
    value(index){
      if (index < 0) index += this.length;
      return this[index];
    }
  }
});