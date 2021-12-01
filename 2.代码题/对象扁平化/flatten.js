const isObject = (x) => typeof x === "object";

const isArray = Array.isArray;

function flatten(someObj) {
  const result = {};

  const forIn = (key='', obj, isObjBelongArray) => {
    for (i in obj) {
      if (isObject(obj[i])) {
        const objIsArray = isArray(obj[i]);
        forIn(`${key ? `${key}${isObjBelongArray?``:`.`}` : ""}${i}${isObjBelongArray?`]`:''}${objIsArray?`[`:``}`, obj[i], objIsArray);
      } else {
        let resultKey;
        if (isObjBelongArray) {
          resultKey = `${key ? `${key}` : ""}${i}]`;
        } else {
          resultKey = `${key ? `${key}.` : ""}${i}`;
        }
        result[resultKey] = obj[i];
      }
    }
  };

  forIn('', someObj);
  return result;
}


module.exports = flatten;
