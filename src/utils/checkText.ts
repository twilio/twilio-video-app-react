export const isZenkakuKana = (text: string) => {
  return !!text.match(/[ァ-ヶー　]+/);
};

export const ishankakuKana = (text: string) => {
  return !!text.match(/[ｱ-ﾝﾞﾟ]+/);
};

export const isEnglish = (text: string) => {
  return !!text.match(/[a-zA-Z]+/);
};
