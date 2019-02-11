import diff from '../util/diff';

describe('diff', () => {
  it('Should return no differences', () => {
    const obj1 = {
      key1: 0
    };

    const obj2 = {
      key1: 0
    };

    const res = diff(obj1, obj2);

    expect(res).toEqual({});
  });

  it('Should return one difference', () => {
    const obj1 = {
      key1: 0
    };

    const obj2 = {
      key1: 1
    };

    const res = diff(obj1, obj2);

    expect(res).toEqual({ key1: 1 });
  });

  it('Should return 1 removed key', () => {
    const obj1 = {
      key1: 0
    };

    const obj2 = {};

    const res = diff(obj1, obj2);

    expect(res).toEqual({ key1: undefined });
  });

  it('Should return 1 added key', () => {
    const obj1 = {};

    const obj2 = {
      key1: 0
    };

    const res = diff(obj1, obj2);

    expect(res).toEqual({ key1: 0 });
  });

  it('Should return 1 removed and 1 added key', () => {
    const obj1 = {
      key1: 0
    };

    const obj2 = {
      key2: 0
    };

    const res = diff(obj1, obj2);

    expect(res).toEqual({ key1: undefined, key2: 0 });
  });
});
