import reduce from "reduce-object";

function find(obj, predicate) {
  let res;
  for (const key in obj) {
    if (predicate(obj[key], key)) {
      res = obj[key];
      break;
    }
  }

  return res;
}

export const diff = (obj1, obj2) => (
  reduce(obj2, (res, value, key) => {
    if(find(obj1, (v, k) => key === k && value !== v)) {
      res[key] = value;
    }
    return res;
  }, {})
);
