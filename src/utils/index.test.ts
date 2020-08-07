import { removeUndefineds, getEnvironment } from '.';

delete window.location;
// @ts-ignore
window.location = {
  search: '',
};

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

describe('the getEnvironment function', () => {
  it('should return the environment as specified in the URL', () => {
    window.location.search = '?environment=dev';
    expect(getEnvironment()).toBe('dev');

    window.location.search = '?environment=prod';
    expect(getEnvironment()).toBe('prod');

    window.location.search = '?environment=stage';
    expect(getEnvironment()).toBe('stage');
  });

  it('should return undefined when the URL contains an incorrect environment name', () => {
    window.location.search = '?environment=foo';
    expect(getEnvironment()).toBe(undefined);
  });

  it('should return undefined when the URL does not contain an environment name', () => {
    window.location.search = '';
    expect(getEnvironment()).toBe(undefined);
  });
});
