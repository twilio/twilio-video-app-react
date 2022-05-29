/** 全角カナ文字が含まれるときはtrue**/
export const includeZenkakuKana = (text: string) => {
  return !!text.match(/[ァ-ヶー　]+/);
};
/** 半角カナ文字が含まれるときはtrue**/
export const includeHankakuKana = (text: string) => {
  return !!text.match(/[ｱ-ﾝﾞﾟ]+/);
};
/** 英語が含まれるときはtrue**/
export const includeEnglish = (text: string) => {
  return !!text.match(/[a-zA-Z]+/);
};

/**英語orカタカナを含む文字の場合はtrue **/
export const isBannedText = (text: string) => {
  return includeHankakuKana(text) || includeZenkakuKana(text) || includeEnglish(text);
};
