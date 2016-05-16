import _ from "lodash";

export const diff = (obj1, obj2) => (
  _.reduce(obj2, (res, value, key) => {
    if(_.find(obj1, (v, k) => key === k && value !== v)) {
      res[key] = value;
    }
    return res;
  }, {})
);
