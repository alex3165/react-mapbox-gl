const reduce = require('reduce-object'); // tslint:disable-line

const find = (obj: any, predicate: (...args: any[]) => boolean) => (
  Object.keys(obj).filter((key) => predicate(obj[key], key))[0]
);

const diff = (obj1: any, obj2: any) => (
  reduce(obj2, (res: any, value: any, key: string) => {
    const toMutate = res;
    if (find(obj1, (v, k) => key === k && value !== v)) {
      toMutate[key] = value;
    }
    return toMutate;
  }, {})
);

export default diff;
