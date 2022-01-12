import React, { createContext, ReactNode, useState } from 'react';
import { LANGUAGE_CODE } from 'types/Language';

export interface ILanguageContextType {
  langCode: string;
  setLangCode: (code: LANGUAGE_CODE) => void;
}

export const LanguageContext = createContext<ILanguageContextType>(null!);

export const LanguageProvider = (props: { children: ReactNode }) => {
  const [langCode, setLangCode] = useState<LANGUAGE_CODE>(LANGUAGE_CODE.de_DE);

  return (
    <LanguageContext.Provider
      value={{
        langCode,
        setLangCode,
      }}
    >
      {props.children}
    </LanguageContext.Provider>
  );
};
