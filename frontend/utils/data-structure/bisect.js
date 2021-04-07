export function bisectLeft(arr, target, l = 0, r = arr.length, callback){
  while (l < r){
    let m = (l + r) >> 1;
    let res = callback ? callback(arr[m], target) : arr[m] - target;

    if (res < 0){
      l = m + 1
    } else {
      r = m
    }
  }

  return l;
}

export function bisectRight(arr, target, l = 0, r = arr.length, callback){
  while (l < r){
    let m = (l + r) >> 1;
    let res = callback ? callback(arr[m], target) : arr[m] - target;

    if (res <= 0){
      l = m + 1
    } else {
      r = m
    }
  }

  return l;
}

export function insertLeft(arr, target, callback){
  let i = arr.bisectLeft(arr, target, 0, arr.length - 1, callback);
  arr.splice(i, 1, target);
  return arr;
}

export function insertRight(arr, target, callback){
  let i = arr.bisectRight(arr, target, 0, arr.length - 1, callback);
  arr.splice(i, 1, target);
  return arr;
}