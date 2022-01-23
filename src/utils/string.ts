const availableChars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXY';

export const randomString = (length: number) => {
  let str = '';
  for (let i = 0; i < length; i++) {
    str += availableChars.charAt(Math.round(Math.random() * availableChars.length));
  }

  return str;
};
