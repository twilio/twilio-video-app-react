import { removeUndefineds } from '.';

describe('the removeUndefineds function', () => {
  it('should recursively remove any object keys with a value of undefined', () => {
    const data = {
      a: 0,
      b: '',
      c: undefined,
      d: null,
      e: {
        a: 0,
        b: '',
        c: undefined,
        d: null,
      },
    };

    const result = {
      a: 0,
      b: '',
      d: null,
      e: {
        a: 0,
        b: '',
        d: null,
      },
    };

    expect(removeUndefineds(data)).toEqual(result);
  });
});
