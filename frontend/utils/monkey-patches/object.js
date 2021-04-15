Object.defineProperties(Object.prototype, {
  isEmpty: {
    get(){ return Object.keys(this).length === 0; }
  },
  shallowEquals: {
    value(obj){
      if (this.constructor !== obj.constructor ||
          this.__proto__ !== obj.__proto__ ||
          Object.keys(this).length !== Object.keys(obj).length
      ) return false;

      for (let key in this)
        if (this[key] !== obj[key])
          return false;

      return true;
    }
  },
  contains: {
    value(obj){
      for (let key in obj)
        if (this[key] !== obj[key])
          return false;
      return true;
    }
  }
});

export default {};