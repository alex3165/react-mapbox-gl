import reduce from 'reduce-object';

const find = (obj, predicate) => (
  Object.keys(obj).find(key => predicate(obj[key], key))
);

const diff = (obj1, obj2) => (
  reduce(obj2, (res, value, key) => {
    const toMutate = res;
    if (find(obj1, (v, k) => key === k && value !== v)) {
      toMutate[key] = value;
    }
    return toMutate;
  }, {})
);

export default diff;
