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

// console.log({}.isEmpty);
// console.log(![1,2,3,4].shallowEquals({0:1,1:2,2:3,3:4}));
// console.log([1,2,3,4].shallowEquals([1,2,3,4]));
// console.log({0:1,1:2,2:3,3:4}.shallowEquals({0:1,1:2,2:3,3:4}));

export default {};